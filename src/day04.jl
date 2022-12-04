# ~\~ language=Julia filename=src/day04.jl
# ~\~ begin <<docs/src/day04.md|src/day04.jl>>[init]
module Day04

contains(a::UnitRange{Int}, b::UnitRange{Int}) =
    a.start >= b.start && a.stop <= b.stop

overlap(a::UnitRange{Int}, b::UnitRange{Int}) =
    max(a.start, b.start) <= min(a.stop, b.stop)

function read_input(io::IO)
    fmt = r"(\d+)-(\d+),(\d+)-(\d+)"
    range_pair(a, b, c, d) = (a:b,c:d)
    to_range_pair(l) = range_pair((parse(Int, x) for x in match(fmt, l))...)
    readlines(io) .|> to_range_pair
end

function main(io::IO)
    input = read_input(io)
    part1 = length(filter(((a, b),)->contains(a,b)||contains(b,a), input))
    println("Part 1: $part1")
    part2 = length(filter(x->overlap(x...), input))
    println("Part 2: $part2")
end

end  # module
# ~\~ end
