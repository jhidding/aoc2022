# ~\~ language=Julia filename=src/day12.jl
# ~\~ begin <<docs/src/day12.md|src/day12.jl>>[init]
module Day12

using Base: splat
using DataStructures: PriorityQueue, enqueue!, dequeue!
export read_input, part1, trace_back

function read_input(io::IO)
    data = foldl(hcat, Vector{Char}.(readlines(io)))
    target = findfirst(c -> c == 'E', data)
    start = findfirst(c -> c == 'S', data)
    data[start] = 'a'
    data[target] = 'z'
    (height = data .- 'a', start = start, target = target)
end

function grid_dijkstra(
        DistType::Type{T}, size, 
        start::CartesianIndex, istarget::Function,
        neighbours::Function, dist_func::Function) where {T}
    visited = fill(false, size)
    distance = fill(typemax(T), size)
    distance[start] = zero(T)
    queue = PriorityQueue{CartesianIndex,T}()
    prev = Matrix{CartesianIndex}(undef, size)
    enqueue!(queue, start, zero(T))
    current = nothing
    while !isempty(queue)
        current = dequeue!(queue)
        istarget(current) && break
        visited[current] && continue
        for loc in neighbours(current)
            visited[loc] && continue
            d = distance[current] + dist_func(current, loc)
            if d < distance[loc]
                distance[loc] = d
                prev[loc] = current
                enqueue!(queue, loc, d)
            end
        end
        visited[current] = true
    end
    (distance = distance, route = prev, target = current)
end

const grid_neighbours =
    eachrow([0 1; 0 -1; 1 0; -1 0]) .|> splat(CartesianIndex)

function trace_back(prev, start, target)
    route = [target]
    current = target
    while current != start
        current = prev[current]
        pushfirst!(route, current)
    end
    route
end

function main(inp::IO, out::IO)
    input = read_input(inp)
    ok_step(a, b) = input.height[b] - input.height[a] <= 1
    in_bounds(a) = checkbounds(Bool, input.height, a)
    dist_func(a, b) = 1

    function part1()
        neighbours(pt) = (nb for nb in (grid_neighbours .+ (pt,)) if in_bounds(nb) && ok_step(pt, nb))
        grid_dijkstra(Int, size(input.height), input.start, x -> x == input.target, neighbours, dist_func)
    end

    function part2()
        neighbours(pt) = (nb for nb in (grid_neighbours .+ (pt,)) if in_bounds(nb) && ok_step(nb, pt))
        grid_dijkstra(Int, size(input.height), input.target, x -> input.height[x] == 0, neighbours, dist_func)
    end

    result = part1()
    println(out, "Part 1: $(result.distance[result.target])")
    result = part2()
    println(out, "Part 2: $(result.distance[result.target])")
end

end  # module
# ~\~ end
