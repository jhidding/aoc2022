# Day 05

``` {.julia file=src/day05.jl}
module Day05

struct Move
    amount::Int
    from::Int
    to::Int
end

mutable struct State
    piles::Vector{Vector{Char}}
    instructions::Vector{Move}
end

function Base.parse(::Type{Move}, line)
    r = r"move (\d+) from (\d+) to (\d+)"
    m = match(r, line)
    if m === nothing
        error("Parse error, not a Move: $line")
    end
    Move(parse.(Int, m)...)
end

function read_input(io::IO)
    lines = collect(readlines(io))
    piles = [[] for _ in 1:9]
    for i in 1:8
        for j in 1:9
            c = lines[i][(j-1)*4+2]
            if c != ' '
                push!(piles[j], c)
            end
        end
    end

    instructions = lines[11:end] .|> l->parse(Move, l)
    State(piles, instructions)
end

function main(io::IO)
    input = read_input(io)
    println(input)
end

end  # module
```
