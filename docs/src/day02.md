# Day 02: Rock Paper Scissors

``` {.julia file=src/day02.jl}
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
```

```@example
using AOC2022  # hide
@day 2
```

## Rust
For the rustic solution, I did away with any enums and just used `u8`.

``` {.rust file=src/day02.rs}
mod aoc;

use crate::aoc::{Result,input_error};
use std::io;

fn read_input() -> Result<Vec<(u8, u8)>> {
    let mut result = Vec::new();
    for line in io::stdin().lines() {
        let l = line.map_err(input_error)?;
        result.push((l.as_bytes()[0] - b'A', l.as_bytes()[2] - b'X'));
    }
    Ok(result)
}

fn to_win_against(a: u8) -> u8 { (a + 1) % 3 }
fn to_lose_against(a: u8) -> u8 { (a + 2) % 3 }
fn to_draw_against(a: u8) -> u8 { a }
fn win(a: u8, b: u8) -> bool { a == to_win_against(b) }
fn score(a: u8, b: u8) -> u32 {
    if win(a,b) {
        b as u32 + 1
    } else if win(b, a) {
        b as u32 + 7
    } else {
        b as u32 + 4
    }
}

fn game_score<I>(g: I) -> u32 where I: Iterator<Item = (u8,u8)>
    { g.map(|(a,b)|{score(a, b)}).sum() }

fn xyz(i: u8) -> fn (u8) -> u8
    { [to_lose_against, to_draw_against, to_win_against][i as usize] }

fn main() -> Result<()> {
    let input = read_input()?;
    println!("Part 1: {}", game_score(input.iter().copied()));
    let games = input.into_iter().map(|(a,b)|{(a,xyz(b)(a))});
    println!("Part 2: {}", game_score(games));
    Ok(())
}
```
