# ~\~ language=Julia filename=src/day03.jl
# ~\~ begin <<docs/src/day03.md|src/day03.jl>>[init]
module Day03

split_half(s) = begin
    l = length(s) ÷ 2
    (s[1:l], s[l+1:end])
end

priority(c::Char) = islowercase(c) ? c - 'a' + 1 : c - 'A' + 27

function main(io::IO)
    input = readlines(io)
    part1 = input .|> split_half .|> ((a,b),) -> (a ∩ b)[1] .|> priority
    println("Part 1: $(sum(part1))")
    part2 = eachcol(reshape(input, 3, :)) .|> a -> reduce(∩, a)[1] .|> priority
    println("Part 2: $(sum(part2))")
end

end  # module
# ~\~ end
