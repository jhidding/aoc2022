# ~\~ language=Julia filename=src/day02.jl
# ~\~ begin <<docs/src/day02.md|src/day02.jl>>[init]
module Day02

@enum RPS Rock=1 Paper=2 Scissors=3

const win_table = Dict(Rock => Paper, Paper => Scissors, Scissors => Rock)
invert(table) = Dict(b => a for (a, b) in table)
const lose_table = invert(win_table)

to_win_against(a::RPS) = win_table[a]
to_lose_against(a::RPS) = lose_table[a]
to_draw_against(a::RPS) = a

Base.:>(a::RPS, b::RPS) = a == to_win_against(b)
score(a::RPS, b::RPS) = Int(b) + (a > b ? 0 : (b > a ? 6 : 3))
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
    score2 = sum(map(round->score(round...), game2))
    println("Part 2: $(score(game2))")
end

end
# ~\~ end
