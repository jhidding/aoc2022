# Day 08: Treetop Tree House
I feel there must be a smarter solution to this problem.

``` {.julia file=src/day08.jl}
module Day08

export read_input, mark_visible, viewing_distance, viewing_distance_2, scenic_score, scenic_score_2

function read_input(io::IO)
    foldl(hcat, readlines(io) .|> l->Vector{Char}(l) .- '0')'
end

function mark_visible_1(treeline::AbstractVector{Int})
    result = zeros(Int, size(treeline))
    highest = -1
    for (i, t) in enumerate(treeline)
        if t > highest
            result[i] = 1
            highest = t
        end
    end
    result
end

function mark_visible(treeline::AbstractVector{Int})
    mark_visible_1(treeline) .| reverse(mark_visible_1(reverse(treeline)))
end

function mark_visible(forest::AbstractMatrix{Int})
    m1 = foldl(hcat, mark_visible(c) for c in eachcol(forest))
    m2 = foldl(hcat, mark_visible(c) for c in eachcol(forest'))'
    m1 .| m2
end

function viewing_distance(treeline::AbstractVector{Int})
    result = zeros(Int, size(treeline))
    for (i, x) in enumerate(treeline)
        i == 1 && continue
        for j in 1:i-1
            result[i] += 1
            treeline[i-j] >= x && break
        end
    end
    result
end

function scenic_score(forest::AbstractMatrix{Int})
    s1 = foldl(hcat, viewing_distance(c) for c in eachcol(forest))
    s2 = foldl(hcat, reverse(viewing_distance(reverse(c))) for c in eachcol(forest))
    s3 = foldl(hcat, viewing_distance(c) for c in eachcol(forest'))'
    s4 = foldl(hcat, reverse(viewing_distance(reverse(c))) for c in eachcol(forest'))'
    s1 .* s2 .* s3 .* s4
end

<<day08-second-attempt>>

function main(io::IO)
    input = read_input(io)
    visible = mark_visible(input)
    println("Part 1: $(sum(visible))")
    score = scenic_score(input)
    println("Part 2: $(maximum(score))")
end

end  # module
```

```@example
using AOC2022  # hide
@day 8
```

## Plot

```@example
using AOC2022.Day08
using CairoMakie

CairoMakie.activate!(type = "svg")
forest = open(read_input, "../../data/day08.txt", "r")
xs = collect(Float32, 1:size(forest)[1])
ys = collect(Float32, 1:size(forest)[2])
fig = Figure(resolution=(1000,350))
ax1 = Axis(fig[1,1], aspect=1)
ax2 = Axis(fig[1,2], aspect=1)
ax3 = Axis(fig[1,3], aspect=1)
heatmap!(ax1, xs, ys, forest; fxaa=false)
heatmap!(ax2, xs, ys, mark_visible(forest); fxaa=false)
heatmap!(ax3, xs, ys, scenic_score(forest).^0.25; fxaa=false)
save("day08.svg", fig)
```

![My forest](day08.svg)

## Second attempt

A slightly different approach, keeps track of all distances of heights 0 to 9. Depending on the height map this could be faster, but in practice it isn't.

``` {.julia #day08-second-attempt}
function viewing_distance_2(treeline::AbstractVector{Int})
    result = zeros(Int, size(treeline))
    dists = zeros(Int, 10)
    for (i, x) in enumerate(treeline)
        result[i] = dists[x+1]
        dists[x+2:end] .+= 1
        dists[1:x+1] .= 1
    end
    return result
end

function scenic_score_2(forest::AbstractMatrix{Int})
    s1 = foldl(hcat, viewing_distance_2(c) for c in eachcol(forest))
    s2 = foldl(hcat, reverse(viewing_distance_2(reverse(c))) for c in eachcol(forest))
    s3 = foldl(hcat, viewing_distance_2(c) for c in eachcol(forest'))'
    s4 = foldl(hcat, reverse(viewing_distance_2(reverse(c))) for c in eachcol(forest'))'
    s1 .* s2 .* s3 .* s4
end
```

## Benchmarks

```@example 1
using BenchmarkTools
using AOC2022
using AOC2022.Day08

input = open(read_input, "../../data/day08.txt", "r")

with_cache("../artifacts/day08-benchmark-1.bin") do
    @benchmark scenic_score(input)
end
```

```@example 1
with_cache("../artifacts/day08-benchmark-2.bin") do
    @benchmark scenic_score_2(input)
end
```
