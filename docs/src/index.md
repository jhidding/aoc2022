# Advent of Code 2022
[![Entangled badge](https://img.shields.io/badge/entangled-Use%20the%20source!-%2300aeff)](https://entangled.github.io/)
[![Documentation](https://github.com/jhidding/aoc2022/actions/workflows/documentation.yml/badge.svg)](https://github.com/jhidding/aoc2022/actions/workflows/documentation.yml)

These are my solutions to Advent of Code 2022.

## Literate programming
I use a system of literate programming called [Entangled](https://entangled.github.io/). Many of the code blocks you see in this document end up in the actual source code for the modules that I use in the examples. These code blocks are marked with either a filename or a noweb reference. The blocks marked with a noweb reference can be included elsewhere using the `<<...>>` syntax.

## Running Julia solutions
To accommodate easy running of Julia code, I wrote an overarching module. This includes the Julia code for all days, each day in its own module. To run the code for a single day, there is the `@day` macro. So

```@example
using AOC2022
@day 1
```

``` {.julia file=src/AOC2022.jl}
module AOC2022

using Printf
using Random
using Serialization

# Introduced on day 6
include("CircularBuffers.jl")
using .CircularBuffers

export @day, @runall, with_cache

advent = filter(f -> occursin(r"day.*.jl", f), readdir(@__DIR__))

for day in advent
    include(day)
end

function day_gen(n::Int)
    modname = Symbol(@sprintf "Day%02u" n)
    input_file = joinpath(@__DIR__, @sprintf "../data/day%02u.txt" n)
    quote
        open($input_file, "r") do io_in
            $modname.main(io_in)
        end
    end
end

function frieze()
    color = (150, 100, 250)
    chars = # rand(Char(0x1fb00):Char(0x1fb3b), 5)
        rand(Char(0x1fb90):Char(0x1fb90), 5)
    colors = [1,1,1,1,1] .|> f -> round.(Int, color ./ f)
    foldl(*, ["\033[38;2;$(r);$(g);$(b)m$(c)" for ((r,g,b), c) in zip(colors, chars)])
end

function decorated_day(n::Int)
    modname = Symbol(@sprintf "Day%02u" n)
    input_file = joinpath(@__DIR__, @sprintf "../data/day%02u.txt" n)
    quote
        n=$n
        println("\033[48;2;160;20;60m $(frieze())\033[37m  \033[1mDay $n                          \033[m")
        buf = PipeBuffer()
        open($input_file, "r") do io_in
            $modname.main(io_in, buf)
        end
        for line in eachline(buf)
            println(" $(frieze())\033[m    $line")
        end
    end
end

macro day(n::Int)
    decorated_day(n)
end  

macro runall()
    function get_day(s)
        m = match(r"day(\d+)\.jl", s)
        isnothing(m) ? nothing : parse(Int, m[1])
    end
    runs = filter(!isnothing, advent .|> get_day) .|> decorated_day
    :(begin $(runs...) end)
end

function with_cache(func::Function, filename::AbstractString)
    if !isfile(filename)
        serialize(filename, func())
    end
    deserialize(filename)
end

end  # module
```
