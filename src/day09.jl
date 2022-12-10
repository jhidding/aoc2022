# ~\~ language=Julia filename=src/day09.jl
# ~\~ begin <<docs/src/day09.md|src/day09.jl>>[init]
module Day09

export read_input, State, make_move!

const Pt2 = Tuple{Int,Int}

struct Move
    d::Pt2
    s::Int
end

mutable struct State
    rope::Vector{Pt2}
    history::Set{Pt2}
end

const directions = Dict{Char,Pt2}(
    'L' => (-1,0), 'R' => (1,0), 'U' => (0,1), 'D' => (0,-1))

Base.parse(::Type{Move}, line::AbstractString) =
    Move(directions[line[1]], parse(Int, line[3:end]))

read_input(io::IO) =
    parse.(Move, readlines(io))

function make_move!(st::State, m::Move)
    for _ in 1:m.s
        st.rope[1] = st.rope[1] .+ m.d
        for (i,x) in enumerate(st.rope[2:end])
            dist = st.rope[i] .- x
            if max(abs.(dist)...) > 1
                st.rope[i+1] = x .+ sign.(dist)
            end
        end
        push!(st.history, st.rope[end])
    end
end

function main(io::IO, io_out::IO=stdout)
    input = read_input(io)
    st = State([(0,0), (0,0)], Set([(0,0)]))
    foreach(m->make_move!(st, m), input)
    println(io_out, "Part 1: $(length(st.history))")
    st = State(fill((0,0), 10), Set([(0,0)]))
    foreach(m->make_move!(st, m), input)
    println(io_out, "Part 2: $(length(st.history))")
end

end  # module
# ~\~ end
