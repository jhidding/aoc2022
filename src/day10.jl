# ~\~ language=Julia filename=src/day10.jl
# ~\~ begin <<docs/src/day10.md|src/day10.jl>>[init]
module Day10

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
    readlines(inp) .|> parse_instr
end

function run_program(instr::AbstractVector{Instruction})
    x = 1
    Channel() do chan
        cycle() = begin put!(chan, x) end
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

function main(inp::IO, out::IO)
    input = read_input(inp)
    part1 = sum(collect(enumerate(run_program(input)) .|>
                ((c, x),) -> c*x)[20:40:220])
    println(out, "Part 1: $part1")
    crt = reshape(repeat(0:39, 6), 40, 6)'
    x = reshape(collect(run_program(input)), 40, 6)'
    crt_lines = String.(eachrow(abs.(crt - x) .|> x -> x > 1 ? ' ' : '█'))
    println(out, "Part 2:")
    foreach(l->println(out, l), crt_lines)
end

end  # module
# ~\~ end
