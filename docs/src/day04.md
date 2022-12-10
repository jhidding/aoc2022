# Day 04: Camp Cleanup
Overlappin ranges. In the first problem we need to see if two ranges completely overlap. I couldn't think of a faster way than to check that either A contains B or B contains A. This is a stronger bound than what we have in the second part. To check for overlap we can compare the maximum of start values with the minimum of stop values.

``` {.julia file=src/day04.jl}
module Day04

contains(a::UnitRange{Int}, b::UnitRange{Int}) =
    a.start >= b.start && a.stop <= b.stop

overlap(a::UnitRange{Int}, b::UnitRange{Int}) =
    max(a.start, b.start) <= min(a.stop, b.stop)

function read_input(io::IO)
    fmt = r"(\d+)-(\d+),(\d+)-(\d+)"
    range_pair(a, b, c, d) = (a:b,c:d)
    to_range_pair(l) = range_pair((parse(Int, x) for x in match(fmt, l))...)
    readlines(io) .|> to_range_pair
end

function main(io::IO, io_out::IO=stdout)
    input = read_input(io)
    part1 = length(filter(((a, b),)->contains(a,b)||contains(b,a), input))
    println(io_out, "Part 1: $part1")
    part2 = length(filter(x->overlap(x...), input))
    println(io_out, "Part 2: $part2")
end

end  # module
```

```@example
using AOC2022  # hide
@day 4
```

Going to make a nice plot of my input

```@example
using AOC2022.Day04: read_input
using DataFrames
using CairoMakie

data = open(read_input, "../../data/day04.txt", "r")
to_row((a, b)) = (a0=a.start, a1=a.stop, b0=b.start, b1=b.stop)
df = data .|> to_row |> DataFrame

with_theme(theme_dark()) do
    CairoMakie.activate!(type = "svg")
    fig = Figure()
    ax = Axis(fig[1, 1])
    x = 1:size(df)[1]

    rangebars!(ax, 1:100, df.a0[1:100], df.a1[1:100], color="#cc444488", linewidth = 5)
    rangebars!(ax, 1:100, df.b0[1:100], df.b1[1:100], color="#4444cc88", linewidth = 5)

    save("day04.svg", fig)
end
nothing  # hide
```

![Day 4 viz](day04.svg)
