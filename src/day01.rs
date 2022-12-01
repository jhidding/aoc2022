// ~\~ language=Rust filename=src/day01.rs
// ~\~ begin <<docs/src/day01.md|src/day01.rs>>[init]
mod aoc;

use crate::aoc::{Error,Result,input_error};
use std::io;

// ~\~ begin <<docs/src/day01.md|read-lists-of-int>>[init]
fn read_input() -> Result<Vec<Vec<u32>>> {
    let mut v = Vec::<u32>::new();
    let mut result = Vec::new();
    for line in io::stdin().lines() {
        let l = line.map_err(input_error)?;
        if l.is_empty() {
            result.push(v);
            v = Vec::<u32>::new();
        } else {
            v.push(l.parse().map_err(input_error)?);
        }
    }
    if !v.is_empty() {
        result.push(v);
    }
    Ok(result)
}
// ~\~ end

fn main() -> Result<()> {
    let input = read_input()?;
    let mut sums: Vec<u32> = input.iter().map(|x| { x.iter().sum::<u32>() }).collect();

    let part1 = sums.iter().max().ok_or(Error::Input("Empty input".to_string()))?;
    println!("Part 1: {}", part1);

    sums.sort();
    let part2: u32 = sums[sums.len()-3..].iter().sum();
    println!("Part 2: {}", part2);
    Ok(())
}
// ~\~ end
