// ~\~ language=Rust filename=src/day01.rs
// ~\~ begin <<lit/day01.md|src/day01.rs>>[init]
use crate::aoc::{Error,Result};
use std::io;

fn read_input() -> Result<Vec<Vec<u32>>> {
    let contents = io::stdin().lines();
    let mut v = Vec::<u32>::new();
    let mut result = Vec::Vec<u32>::new();
    for line in contents {
        if line.is_empty() {
            result.push!(v);
            v = Vec::<u32>::new();
        } else {
            v.push!(line.parse().map_err())
        }
    }
}

fn main() {
}
// ~\~ end
