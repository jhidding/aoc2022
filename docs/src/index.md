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
export @day

advent = filter(f -> occursin(r"day.*\.jl", f), readdir(@__DIR__))

for day in advent
    include(day)
end

macro day(n::Int)
    modname = Symbol(@sprintf "Day%02u" n)
    input_file = joinpath(@__DIR__, @sprintf "../data/day%02u.txt" n)
    :(open($modname.main, $input_file, "r"))
end

end
```
