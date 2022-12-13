# ~\~ language=Julia filename=src/day13.jl
# ~\~ begin <<docs/src/day13.md|src/day13.jl>>[init]
module Day13

# ~\~ begin <<docs/src/day01.md|function-split-on>>[init]
function split_on(lst, sep)
    Channel() do channel
        v = []
        for item in lst
            if item == sep
                put!(channel, v)
                v = []
            else
                push!(v, item)
            end
        end
        if !isempty(v)
            put!(channel, v)
        end
    end
end
# ~\~ end

struct Packet
    x
end

function read_input(io::IO)
    get_args(x::Int) = x
    get_args(x::Vector{Any}) = x .|> get_args
    get_args(x::Expr) = x.args |> get_args
    [(Packet(get_args(Meta.parse(i))), Packet(get_args(Meta.parse(j))))
     for (i, j) in split_on(eachline(io), "")]
end

@enum Check Ok NotOk Continue

compare(a::Int, b::Int) = a < b ? Ok : (a > b ? NotOk : Continue)
compare(a::Int, b::Vector) = compare([a], b)
compare(a::Vector, b::Int) = compare(a, [b])
compare(a::Vector, b::Vector) =
    if isempty(a) && isempty(b)
        Continue
    elseif isempty(a)
        Ok
    elseif isempty(b)
        NotOk
    else
        let x = compare(a[1], b[1])
            if x == Continue
                compare(a[2:end], b[2:end])
            else
                x
            end
        end
    end

Base.:<(a::Packet, b::Packet) = compare(a.x, b.x) == Ok

function main(inp::IO, out::IO)
    input = read_input(inp)
    part1 = sum(i for (i, (a, b)) in enumerate(input) if a < b)
    println(out, "Part 1: $part1")
    packets = foldl(vcat, ([a, b] for (a, b) in input))
    idx1 = length(filter(p -> p < Packet([[2]]), packets)) + 1
    idx2 = length(filter(p -> p < Packet([[6]]), packets)) + 2   # [[2]] is also smaller
    part2 = idx1 * idx2
    println(out, "Part 2: $part2")
end

end  # module
# ~\~ end
