# ~\~ language=Julia filename=src/day10.jl
# ~\~ begin <<docs/src/day10.md|src/day10.jl>>[init]
module Day10

using Base: splat
using Base.Iterators: map as imap, drop, partition
export read_input, run_program

struct Instruction
    opcode :: Symbol
    args :: Vector{Int}
end

Instruction(opcode::Symbol, args::Int...) = Instruction(opcode, [args...])

choice(fs::Function ...) = function(l::AbstractString)
    for f in fs
        x = f(l)
        !isnothing(x) && return x
    end
    nothing
end

function read_input(inp::IO)
    addx_instr = r"addx (-?\d+)"
    parse_addx(l) = match(addx_instr, l) |>
        m -> isnothing(m) ? nothing : Instruction(:addx, parse(Int, m[1]))
    noop_instr = r"noop"
    parse_noop(l) = match(noop_instr, l) |>
        m -> isnothing(m) ? nothing : Instruction(:noop)
    parse_instr(l) = choice(parse_addx, parse_noop)(l)
    eachline(inp) .|> parse_instr
end

function run_program(instr)
    x = 1
    Channel() do chan
        cycle() = put!(chan, x)
        for i in instr
            if i.opcode === :addx
                cycle(); cycle()
                x += i.args[1]
            else
                cycle()
            end
        end
    end
end


f2(c, x) = abs((c-1) % 40 - x) <= 1 ? '█' : ' '

part2(input) =
    join(reshape(enumerate(run_program(input)) .|> splat(f2), 40, 6) |>
         eachcol .|> String, "\n")

function main(inp::IO, out::IO)
    input = read_input(inp)
    println(out, "Part 1: $(part1_iterated(input))")
    println(out, "Part 2:\n$(part2(input))")
end

# ~\~ begin <<docs/src/day10.md|iterators-every>>[init]
export every

struct Every{I}
    n::Int
    xs::I

    function Every(n::Int, xs::I) where {I}
        new{I}(n, xs)
    end
end

every(n::Int, xs) = Every(n, xs)
Base.eltype(it::Every) = eltype(it.xs)
Base.IteratorSize(::Type{Every{I}}) where {I} = Base.IteratorSize(I)
Base.length(it::Every) = length(it.xs) ÷ it.n
Base.size(it::Every) = (length(it),)

function Base.iterate(it::Every)
    y = iterate(it.xs)
    isnothing(y) && return nothing
    value = y[1]
    for i in 1:it.n-1
        y = iterate(it.xs, y[2])
        isnothing(y) && return (value, nothing)
    end
    return (value, y[2])
end

function Base.iterate(it::Every, st)
    isnothing(st) && return nothing
    y = iterate(it.xs, st)
    isnothing(y) && return nothing
    value = y[1]
    for i in 1:it.n-1
        y = iterate(it.xs, y[2])
        isnothing(y) && return (value, nothing)
    end
    return (value, y[2])
end
# ~\~ end
# ~\~ begin <<docs/src/day10.md|day10-part1>>[init]
export part1_collected, part1_collected2, part1_iterated

part1_collected(input) =
    sum(collect(enumerate(run_program(input)))[20:40:220] .|> splat(*))

part1_collected2(input) =
    sum(enumerate(collect(run_program(input))[20:40:220]) .|> ((c, x),) -> (c*40-20)*x)

part1_iterated(input) =
    sum(imap(splat(*), every(40, drop(enumerate(run_program(input)), 19))))
# ~\~ end

end  # module
# ~\~ end
