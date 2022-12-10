# Day 10: Cathode-Ray Tube
At first I thought "Yay! The first state-machine exercise!", I can write a compiler. It's true, I can. But for today's problem it would kinda suck. So I ended up creating a channel that emits the values for each cycle.

``` {.julia file=src/day10.jl}
module Day10

using Base: splat
using Base.Iterators: map as imap, drop, partition
export read_input, run_program

struct Instruction
    opcode :: Symbol
    args :: Vector{Int}
end

Instruction(opcode::Symbol, args::Int...) = Instruction(opcode, [args...])

choice(fs::Function ...) = function(l::AbstractString)
    for f in fs
        x = f(l)
        !isnothing(x) && return x
    end
    nothing
end

function read_input(inp::IO)
    addx_instr = r"addx (-?\d+)"
    parse_addx(l) = match(addx_instr, l) |>
        m -> isnothing(m) ? nothing : Instruction(:addx, parse(Int, m[1]))
    noop_instr = r"noop"
    parse_noop(l) = match(noop_instr, l) |>
        m -> isnothing(m) ? nothing : Instruction(:noop)
    parse_instr(l) = choice(parse_addx, parse_noop)(l)
    eachline(inp) .|> parse_instr
end

function run_program(instr)
    x = 1
    Channel() do chan
        cycle() = put!(chan, x)
        for i in instr
            if i.opcode === :addx
                cycle(); cycle()
                x += i.args[1]
            else
                cycle()
            end
        end
    end
end


f2(c, x) = abs((c-1) % 40 - x) <= 1 ? '█' : ' '

part2(input) =
    join(reshape(enumerate(run_program(input)) .|> splat(f2), 40, 6) |>
         eachcol .|> String, "\n")

function main(inp::IO, out::IO)
    input = read_input(inp)
    println(out, "Part 1: $(part1_iterated(input))")
    println(out, "Part 2:\n$(part2(input))")
end

<<iterators-every>>
<<day10-part1>>

end  # module
```

```@example
using AOC2022  # hide
@day 10
```

## Using only pure iterators

Now, I would like to make it so, that this doesn't use any memory: input gets piped to parser gets piped to state machine gets piped to solution directly. It turns out that this could be easier in Julia. For one, we can't slice an iterator normally before collecting. We'll have to `drop` 19, then take every 40th element. There is no function in the standard library to iterate every other `n`th element, so I implement it here.

``` {.julia #iterators-every}
export every

struct Every{I}
    n::Int
    xs::I

    function Every(n::Int, xs::I) where {I}
        new{I}(n, xs)
    end
end

every(n::Int, xs) = Every(n, xs)
Base.eltype(it::Every) = eltype(it.xs)
Base.IteratorSize(::Type{Every{I}}) where {I} = Base.IteratorSize(I)
Base.length(it::Every) = length(it.xs) ÷ it.n
Base.size(it::Every) = (length(it),)

function Base.iterate(it::Every)
    y = iterate(it.xs)
    isnothing(y) && return nothing
    value = y[1]
    for i in 1:it.n-1
        y = iterate(it.xs, y[2])
        isnothing(y) && return (value, nothing)
    end
    return (value, y[2])
end

function Base.iterate(it::Every, st)
    isnothing(st) && return nothing
    y = iterate(it.xs, st)
    isnothing(y) && return nothing
    value = y[1]
    for i in 1:it.n-1
        y = iterate(it.xs, y[2])
        isnothing(y) && return (value, nothing)
    end
    return (value, y[2])
end
```

For part one this should save us computing the answers that we throw away. However, this is just one multiplication per cycle, so this shouldn't make much of a dent.

``` {.julia #day10-part1}
export part1_collected, part1_collected2, part1_iterated

part1_collected(input) =
    sum(collect(enumerate(run_program(input)))[20:40:220] .|> splat(*))

part1_collected2(input) =
    sum(enumerate(collect(run_program(input))[20:40:220]) .|> ((c, x),) -> (c*40-20)*x)

part1_iterated(input) =
    sum(imap(splat(*), every(40, drop(enumerate(run_program(input)), 19))))
```

```@example 1
using AOC2022
using AOC2022.Day10
using BenchmarkTools

input = open(read_input, "../../data/day10.txt", "r")
@assert (part1_collected(input) == part1_iterated(input))
```

```@example 1
with_cache("../artifacts/day10-benchmark-1.bin") do
    @benchmark part1_collected(input)
end
```

```@example 1
with_cache("../artifacts/day10-benchmark-2.bin") do
    @benchmark part1_collected2(input)
end
```

```@example 1
with_cache("../artifacts/day10-benchmark-3.bin") do
    @benchmark part1_iterated(input)
end
```
