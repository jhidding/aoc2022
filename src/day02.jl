# ~\~ language=Julia filename=src/day02.jl
# ~\~ begin <<docs/src/day02.md|src/day02.jl>>[init]
module Day02

read_input(io::IO) = [(line[1]-'A', line[3]-'X') for line in readlines(io)]
score_1((a, b)::Tuple{Int,Int}) = mod(b - a + 1, 3) * 3 + b + 1
score_2((a, b)::Tuple{Int,Int}) = b * 3 + mod(a + b - 1, 3) + 1

function main(io::IO)
    input = read_input(io)
    println("Part 1: $(sum(score_1.(input)))")
    println("Part 2: $(sum(score_2.(input)))")
end

end
# ~\~ end
