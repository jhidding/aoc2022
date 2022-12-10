# ~\~ language=Julia filename=src/day09-movie.jl
# ~\~ begin <<docs/src/day09.md|src/day09-movie.jl>>[init]
module Day09Movie

include("day09.jl")
using .Day09
using GLMakie

export plot_state!, State, make_move!, read_input

function plot_state!(ax, st::State)
    pts = foldl(hcat, st.rope .|> e -> [e...])'
    lines!(ax, pts[:,1], pts[:,2])
end

end  # module
# ~\~ end
