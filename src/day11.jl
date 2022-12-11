# ~\~ language=Julia filename=src/day11.jl
# ~\~ begin <<docs/src/day11.md|src/day11.jl>>[init]
module Day11

# ~\~ begin <<docs/src/day11.md|quasi-yaml>>[init]
mutable struct QYPair
    value::String
    child::Union{Nothing,Dict{String,QYPair}}
end

Base.getindex(qy::QYPair, s::AbstractString) = qy.child[s]

function read_quasi_yaml(inp::IO)
    result = Dict{String,QYPair}()
    stack = [result]
    prev = result
    indents = [0]
    line_r = r"^(\s*)([^:]+):\s*([^:]*)$"
    for l in eachline(inp)
        m = match(line_r, l)
        isnothing(m) && continue
        new_indent = length(m[1])
        if new_indent > last(indents)
            prev.child = Dict{String,QYPair}()
            push!(stack, prev.child)
            push!(indents, new_indent)
        else
            while new_indent < last(indents)
                pop!(stack)
                pop!(indents)
            end
            @assert (new_indent == last(indents))
        end
        prev = QYPair(m[3], nothing)
        last(stack)[m[2]] = prev
    end
    result
end
# ~\~ end
# ~\~ begin <<docs/src/day11.md|monkey-spec>>[init]
struct MonkeySpec
    start::Vector{Int}
    operation::Expr
    test_factor::Int
    if_true::Int
    if_false::Int
end

function read_input(inp::IO)
    qy = read_quasi_yaml(inp)
    monkeys = Vector{MonkeySpec}(undef, length(qy))
    for (k, m) in qy
        n = parse.(Int, match(r"Monkey (\d+)", k)[1]) + 1
        start = parse.(Int, split(m["Starting items"].value, ", "))
        operation = Meta.parse(m["Operation"].value)
        test_factor = parse(Int, match(r"divisible by (\d+)", m["Test"].value)[1])
        action(s) = parse(Int, match(r"throw to monkey (\d+)", s)[1]) + 1
        if_true = action(m["Test"]["If true"].value)
        if_false = action(m["Test"]["If false"].value)
        monkeys[n] = MonkeySpec(start, operation, test_factor, if_true, if_false)
    end
    monkeys
end
# ~\~ end
# ~\~ begin <<docs/src/day11.md|monkey-simulator>>[init]
mutable struct Monkey
    items::Vector{Int}
    round::Function
    count::Int
end

function send(m::Monkey, v::Int)
    push!(m.items, v)
end

function monkey_soft(spec::MonkeySpec, worry_reduction::Function)
    op = spec.operation.args[2].args[1]
    num = spec.operation.args[2].args[3]
    if num isa Int
        func = op === :+ ? (x -> x + num) : (x -> x * num)
    else
        func = op === :+ ? (x -> x + x) : (x -> x * x)
    end
    function(self::Monkey, others::Vector{Monkey})
        for old in self.items
            self.count += 1
            new = worry_reduction(func(old))
            send(others[rem(new, spec.test_factor) == 0 ? spec.if_true : spec.if_false], new)
        end
        empty!(self.items)
    end
end
# ~\~ end
# ~\~ begin <<docs/src/day11.md|monkey-simulator>>[1]
function monkey_gen(spec::MonkeySpec, worry_reduction::Function)
    @eval begin
        function(self::Monkey, others::Vector{Monkey})
            for old in self.items
                self.count += 1
                $(spec.operation)
                new = $(worry_reduction)(new)

                if rem(new, $(spec.test_factor)) == 0
                    send(others[$(spec.if_true)], new)
                else
                    send(others[$(spec.if_false)], new)
                end
            end
            empty!(self.items)
        end
    end
end
# ~\~ end

init_monkeys(spec::Vector{MonkeySpec}, worry_reduction::Function) =
    [Monkey(copy(s.start), monkey_soft(s, worry_reduction), 0) for s in spec]

monkey_business(monkeys::Vector{Monkey}) =
    *(sort(monkeys .|> m -> m.count)[end-1:end]...)

function run_monkeys(monkeys::Vector{Monkey}, n_rounds::Int)
    for _ in 1:n_rounds
        for m in monkeys
            Base.invokelatest(m.round, m, monkeys)
        end
    end
    monkeys
end

function main(inp::IO, out::IO)
    input = read_input(inp)
    part1 = monkey_business(run_monkeys(init_monkeys(input, x -> x ÷ 3), 20))
    println(out,"Part 1: $part1")
    max_factor = foldl(*, (s.test_factor for s in input))
    part2 = monkey_business(run_monkeys(init_monkeys(input, x -> x % max_factor), 10000))
    println(out, "Part 2: $part2")
end

end  # module
# ~\~ end
