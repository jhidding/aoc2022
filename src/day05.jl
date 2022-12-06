# ~\~ language=Julia filename=src/day05.jl
# ~\~ begin <<docs/src/day05.md|src/day05.jl>>[init]
module Day05

# ~\~ begin <<docs/src/day05.md|supply-stacks>>[init]
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
# ~\~ end
# ~\~ begin <<docs/src/day05.md|crate-mover>>[init]
crate_mover_9000(crates::Crates) = function (m::Move)
    for _ in 1:m.amount
        x = pop!(crates[m.from])
        push!(crates[m.to], x)
    end
end
# ~\~ end
# ~\~ begin <<docs/src/day05.md|crate-mover>>[1]
function run(crane::Function, st::State)
    foreach(crane(st.crates), st.instructions)
    st
end
# ~\~ end
# ~\~ begin <<docs/src/day05.md|crate-mover>>[2]
crate_mover_9001(crates::Crates) = function (m::Move)
    x = crates[m.from][end-m.amount+1:end]
    crates[m.from] = crates[m.from][1:end-m.amount]
    append!(crates[m.to], x)
end
# ~\~ end
# ~\~ begin <<docs/src/day05.md|day05-read-input>>[init]
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
    crates = [[] for _ in 1:9]
    for i in 1:8
        for j in 1:9
            c = lines[i][(j-1)*4+2]
            if c != ' '
                pushfirst!(crates[j], c)
            end
        end
    end

    instructions = lines[11:end] .|> l->parse(Move, l)
    State(crates, instructions)
end
# ~\~ end

function main(io::IO)
    input = read_input(io)
    part1 = run(crate_mover_9000, deepcopy(input))
    println("Part 1: $(last.(part1.crates) |> String)")
    part2 = run(crate_mover_9001, deepcopy(input))
    println("Part 2: $(last.(part2.crates) |> String)")
end

end  # module
# ~\~ end
