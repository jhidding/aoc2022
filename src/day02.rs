// ~\~ language=Rust filename=src/day02.rs
// ~\~ begin <<docs/src/day02.md|src/day02.rs>>[init]
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
// ~\~ end
