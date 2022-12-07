# Day 05: Supply Stacks
We need to move crates from a start configuration. I store the data (stack and instructions) in a struct.

``` {.julia #supply-stacks}
const Crates = Vector{Vector{Char}}

struct Move
    amount::Int
    from::Int
    to::Int
end

mutable struct State
    crates::Crates
    instructions::Vector{Move}
end
```

The CrateMover-9000 uses a one-by-one stack operation to move crates.

``` {.julia #crate-mover}
crate_mover_9000(crates::Crates) = function (m::Move)
    for _ in 1:m.amount
        x = pop!(crates[m.from])
        push!(crates[m.to], x)
    end
end
```

Here I've hand-curried the `crate_mover_9000` function, to make it easier to work with the `foreach` function:

``` {.julia #crate-mover}
function run(crane::Function, st::State)
    foreach(crane(st.crates), st.instructions)
    st
end
```

For the CrateMover-9001 we can use array slicing to do what we want.

``` {.julia #crate-mover}
crate_mover_9001(crates::Crates) = function (m::Move)
    x = crates[m.from][end-m.amount+1:end]
    crates[m.from] = crates[m.from][1:end-m.amount]
    append!(crates[m.to], x)
end
```

```@setup 1
using AOC2022.Day05: read_input, run, crate_mover_9000, crate_mover_9001, Crates
using AOC2022.Day05Figure: plot
using CairoMakie

CairoMakie.activate!(type = "svg")
data = open(read_input, "../../data/day05.txt", "r")

part1 = run(crate_mover_9000, deepcopy(data))
part2 = run(crate_mover_9001, deepcopy(data))

with_theme(theme_black()) do
    fig = Figure(fonts=(; regular="serif"))
    ax_args = Dict(
        :limits => (0.2, 9.8, -0.3, 27.3),
        :aspect => DataAspect(),
        :xtickalign => 1,
        :ytickalign => 1,
        # :xticksmirrored => true,
        # :yticksmirrored => true,
        :xticks => 1:9,
        :yticks => 0:5:25,
        :titlefont => :regular)
    plot(data.crates, fig=fig, ax=Axis(fig[1,1]; title="input", ax_args...))
    plot(part1.crates, fig=fig, ax=Axis(fig[1,2]; title="CrateMover9000", ax_args...))
    plot(part2.crates, fig=fig, ax=Axis(fig[1,3]; title="CrateMover9001", ax_args...))
    save("day05-result.svg", fig)
end
```

![Stack after Part 2](day05-result.svg)

``` {.julia file=src/day05.jl}
module Day05

<<supply-stacks>>
<<crate-mover>>
<<day05-read-input>>

function main(io::IO)
    input = read_input(io)
    part1 = run(crate_mover_9000, deepcopy(input))
    println("Part 1: $(last.(part1.crates) |> String)")
    part2 = run(crate_mover_9001, deepcopy(input))
    println("Part 2: $(last.(part2.crates) |> String)")
end

end  # module
```

```@example 1
using AOC2022  # hide
@day 5
```

On Reddit [`u/i_have_no_biscuits`](https://www.reddit.com/r/adventofcode/comments/zdbvzn/2022_day_5_a_christmas_day_5_message_for_you_all/?utm_source=share&utm_medium=web2x&context=3) constructed an additional input with a hidden message:

```@example 1
open(AOC2022.Day05.main, "../../data/day05-msg.txt", "r")
```

## Reading input

``` {.julia #day05-read-input}
function Base.parse(::Type{Move}, line)
    r = r"move (\d+) from (\d+) to (\d+)"
    m = match(r, line)
    isnothing(m) ? nothing : Move(parse.(Int, m)...)
end

function read_input(io::IO)
    lines = collect(readlines(io))
    crates = [[] for _ in 1:9]
    for l in lines
        if !contains(l, r"\[[A-Z]\]")
            break
        end
        for j in 1:9
            c = l[(j-1)*4+2]
            if c != ' '
                pushfirst!(crates[j], c)
            end
        end
    end

    instructions = filter(!isnothing, lines .|> l->parse(Move, l))
    State(crates, instructions)
end
```

## Plotting code

``` {.julia file=src/day05-figure.jl}
module Day05Figure

export plot

using Makie
using Makie.GeometryBasics

include("day05.jl")
using .Day05: Crates

unzip(lst) = (getindex.(lst,1), getindex.(lst,2))

crates_to_rects(crates::Crates) =
    unzip([(Rect(i-0.45, j-0.95, 0.9, 0.9), k - 'A')
           for i in 1:9
           for (j, k) in enumerate(crates[i])])

plot(crates::Crates; fig=nothing, ax=nothing) = begin
    if ax === nothing
        fig = Figure()
        ax = Axis(fig[1,1]; aspect=DataAspect(), 
            xticksmirrored = true, yticksmirrored = true,
            xticks=1:9, yticks=0:5:25)
    end
    crates |> crates_to_rects |>
        r -> poly!(ax, r[1], color = r[2], colormap = :roma)
    for i in 1:9
        for (j, k) in enumerate(crates[i])
            text!(ax, i, j-0.5, text="$k", align=(:center,:center), color=:black)
        end
    end
    fig
end

end  # module
```
