# Day 08
I feel there must be a smarter solution to this problem.

``` {.julia file=src/day08.jl}
module Day08

export read_input, mark_visible, viewing_distance, scenic_score

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
using AOC2022.Day08
using CairoMakie

CairoMakie.activate!(type = "svg")
forest = open(read_input, "../../data/day08.txt", "r")
xs = collect(Float32, 1:size(forest)[1])
ys = collect(Float32, 1:size(forest)[2])
fig = Figure()
ax1 = Axis(fig[1,1])
ax2 = Axis(fig[1,2])
ax3 = Axis(fig[1,3])
heatmap!(ax1, xs, ys, convert(Matrix{Float32}, forest))
heatmap!(ax2, xs, ys, convert(Matrix{Float32}, mark_visible(forest)))
heatmap!(ax3, xs, ys, convert(Matrix{Float32}, scenic_score(forest)))
save("day08.svg", fig)
```

![My forest](day08.svg)
