// ~\~ language=Rust filename=src/day02.rs
// ~\~ begin <<docs/src/day02.md|src/day02.rs>>[init]
mod aoc;

use crate::aoc::{Result,Error,input_error};
use std::io;

fn read_input() -> Result<Vec<(u8, u8)>> {
    let mut result = Vec::new();
    for line in io::stdin().lines() {
        let l = line.map_err(input_error)?;
        if l.len() != 3 { return Err(Error::Input("unexpected input".to_string())); }
        result.push((l.as_bytes()[0] - b'A', l.as_bytes()[2] - b'X'));
    }
    Ok(result)
}

// ~\~ begin <<docs/src/day02.md|day02-compute-scores>>[init]
fn score_part_1((a, b): (u8,u8)) -> u32
    { ((4+b-a)%3 * 3 + b + 1) as u32 }
// ~\~ end
// ~\~ begin <<docs/src/day02.md|day02-compute-scores>>[1]
fn score_part_2((a, b): (u8,u8)) -> u32
    { (b*3 + (a+b+2)%3 + 1) as u32 }
// ~\~ end

fn main() -> Result<()> {
    let input = read_input()?;
    println!("Part 1: {}", input.iter().copied().map(score_part_1).sum::<u32>());
    println!("Part 2: {}", input.iter().copied().map(score_part_2).sum::<u32>());
    Ok(())
}
// ~\~ end
