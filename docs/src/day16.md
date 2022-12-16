# Day 16: Proboscidea Volcanium
Boy, this was tough. We get a graph of valves connected by tunnels.

``` {.julia #valve-spec}
struct ValveSpec
    name::String
    flow_rate::Int
    out::Vector{String}
end
```

My input graph looks as follows

```@example 1
using AOC2022.Day16
using GraphvizDotLang: graph, node, edge, save, attr

input = open(read_input, "../../data/day16.txt", "r")
g = graph(bgcolor="black", color="orange", fontcolor="white") |> attr(:node, shape="record", fontcolor="white") |>
        attr(:edge, color="orange")
for n in input
    g |> node(n.name; label="$(n.name) | $(n.flow_rate)",
                      color=n.flow_rate > 0 ? "yellow" : "orange")
    for m in n.out
        if n.name < m
            g |> edge(n.name, m)
        end
    end
end
save(g, "day16-input.svg")
```

![](day16-input.svg)

## Reduce the graph
Now, everything I do from here depends on the fact that we can reduce this graph into a fully connected graph with only those nodes where the flow rate is positive.

Here I use Dijkstra's algorithm to find the distances between each pair of them.

``` {.julia #dijkstra}
function dijkstra(
        start::S, istarget::Function,
        neighbours::Function, dist_func::Function,
        id::Function=identity) where {S}
    visited = BitSet()
    queue = PriorityQueue{S,Int}()
    queue[start] = 0
    current = nothing; dc = nothing
    while !isempty(queue)
        (current, dc) = dequeue_pair!(queue)
        istarget(current) && return (distance=dc, target=current)
        id(current) ∈ visited && continue
        for loc in neighbours(current)
            id(loc) ∈ visited && continue
            d = dc + dist_func(current, loc)
            if d < get(queue, loc, typemax(Int))
                queue[loc] = d
            end
        end
        push!(visited, id(current))
    end
    (distance=dc, target=current)
end
```

We filter on specs that have a positive flow rate, include the "AA" node, and then compute the minimal distance between each of them. We put these distances into a matrix.

``` {.julia #day16-precompute}
tunnel_map = Dict(spec.name => spec for spec in input)
good_valves = ["AA"; filter(spec->spec.flow_rate>0, input) .|> spec->spec.name]
valve_map = Dict(v.name => i for (i, v) in enumerate(input))
n = length(good_valves)
dists = zeros(Int, (n, n))
for i ∈ 1:n, j ∈ 1:(i-1)
    (d, _) = dijkstra(good_valves[i], t->t==good_valves[j], n->tunnel_map[n].out, (a,b)->1, n->valve_map[n])
    dists[j,i] = d+1
end
flow_rate = [tunnel_map[v].flow_rate for v in good_valves]
```

Then we perform Dijkstra's algorithm again on the reduced graph, this time having a cost function of all the pressure that is not vented.

## Splitting the work
When the work is split between you and the elephant, we need to realize that both are doing independent work. I solved the problem by iterating all possible divisions of labour, and finding which one gives the best result.

``` {.julia file=src/day16.jl}
module Day16

using DataStructures: PriorityQueue, enqueue!, dequeue_pair!
using LinearAlgebra: Symmetric

export read_input, split_work, pack, unpack, State, subhash

<<valve-spec>>
<<dijkstra>>

function Base.parse(::Type{ValveSpec}, s::String)
    m = match(r"Valve ([A-Z]+) has flow rate=(\d+); tunnels? leads? to valves? ([A-Z, ]*)", s)
    isnothing(m) ?
        throw(ArgumentError("invalid input: $s")) :
        ValveSpec(m[1], parse(Int, m[2]), split(m[3], ", "))
end

function read_input(inp::IO)
    eachline(inp) .|>
        (l -> parse(ValveSpec, l))
end

struct State
    time::UInt32
    node::UInt16
    closed::UInt16
end

subhash(s::State) = convert(UInt32, s.node) << 16 | convert(UInt32, s.closed)

function pack(it)
    result::UInt16 = 0
    for i in it
        result |= (0x0001 << (i-1))
    end
    result
end

function unpack(i::UInt16)
    result = Int[]
    for k ∈ 1:16
        if i & (0x0001 << (k-1)) != 0
            push!(result, k)
        end
    end
    result
end

neighbours(dists) = function (s::State)
    [State(s.time + dists[i,s.node], i, s.closed ⊻ (0x0001 << (i-1)))
     for i ∈ unpack(s.closed)]
end

cost_function(flow_rates) = function (u::State, v::State)
    sum(flow_rates[unpack(u.closed)]) * (v.time - u.time)
end

function trace_back(prev, el)
    result = [el]
    while el ∈ keys(prev)
        pushfirst!(result, prev[el])
        el = prev[el]
    end
    result
end

function pressure(distance::Matrix{Int}, flow_rate::Vector{Int}, time::Int)
    n = size(distance)[1]
    (cost, tgt) = dijkstra(
        State(1, 1, pack(1:n)), s->isempty(s.closed)||s.time>=(time+1),
        neighbours(Symmetric(distance)), cost_function(flow_rate), subhash)

    maxcost = sum(flow_rate)
    return maxcost * time - cost
end

function split_work(n)
    Channel{Tuple{Vector{Int}, Vector{Int}}}() do chan
        for i in 1:(2^(n-2) - 1)
            a = [1]
            b = [1]
            for k in 1:(n-1)
                if (i >> (k-1)) & 1 == 0
                    push!(a, k+1)
                else
                    push!(b, k+1)
                end
            end
            put!(chan, (a, b))
        end
    end
end

function main(inp::IO, out::IO)
    input = read_input(inp)
    <<day16-precompute>>
    part1 = pressure(dists, flow_rate, 30)
    println(out, "Part 1: $part1")
    part2 = maximum(
       pressure(dists[a,a], flow_rate[a], 26) +
       pressure(dists[b,b], flow_rate[b], 26)
       for (a, b) in split_work(n))
    println(out, "Part 2: $part2")
end

end  # module
```
