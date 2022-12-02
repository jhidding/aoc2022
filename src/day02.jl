# ~\~ language=Julia filename=src/day02.jl
# ~\~ begin <<docs/src/day02.md|src/day02.jl>>[init]
module Day02

@enum RPS Rock=0 Paper=1 Scissors=2

to_win_against(a::RPS) = RPS(mod(Int(a) + 1, 3))
to_lose_against(a::RPS) = RPS(mod(Int(a) - 1, 3))
to_draw_against(a::RPS) = a

Base.:>(a::RPS, b::RPS) = a == to_win_against(b)
score(a::RPS, b::RPS) = Int(b) + 1 + (a > b ? 0 : (b > a ? 6 : 3))
score(game::Vector{Tuple{RPS,RPS}}) = sum(map(round->score(round...), game))

read_input(io::IO) = [(line[1], line[3]) for line in readlines(io)]

function main(io::IO)
    input = read_input(io)
    abc = Dict('A' => Rock, 'B' => Paper, 'C' => Scissors)
    xyz1 = Dict('X' => Rock, 'Y' => Paper, 'Z' => Scissors)
    game1 = [(abc[a], xyz1[b]) for (a,b) in input]
    println("Part 1: $(score(game1))")

    xyz2 = Dict('X' => to_lose_against, 'Y' => to_draw_against, 'Z' => to_win_against)
    game2 = [(abc[a], xyz2[b](abc[a])) for (a,b) in input]
    println("Part 2: $(score(game2))")
end

end
# ~\~ end
