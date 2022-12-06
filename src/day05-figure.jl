# ~\~ language=Julia filename=src/day05-figure.jl
# ~\~ begin <<docs/src/day05.md|src/day05-figure.jl>>[init]
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
# ~\~ end
