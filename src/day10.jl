# ~\~ language=Julia filename=src/day10.jl
# ~\~ begin <<docs/src/day10.md|src/day10.jl>>[init]
module Day10

export read_input, run_program

struct Instruction
    opcode :: Symbol
    args :: Vector{Int}
end

Instruction(opcode::Symbol, args::Int...) = Instruction(opcode, [args...])

construct(m::Union{Nothing,RegexMatch}, f::Function) =
    isnothing(m) ? nothing : f(m...)

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

cycle = quote
    put!(chan, c * x)
    c += 1
end

function compile(instr::Instruction)
    if instr.opcode === :addx
        quote
            $(fill(cycle, 3)...)
            x += $(instr.args[1])
        end
    elseif instr.opcode === :noop
        cycle
    end
end

function compile(instr::AbstractVector{Instruction})
    quote
        function (x::Int, c::Int)
            Channel{Int}() do chan
                $((instr .|> compile)...)
            end
        end
    end
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

function main(inp::IO)
    input = read_input(inp)
    out = run_program(input)
    part1 = sum(collect(enumerate(run_program(input)) .|> ((c, x),) -> c*x)[20:40:220])
    println("Part 1: $part1")
end

end  # module
# ~\~ end
