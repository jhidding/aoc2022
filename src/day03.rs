// ~\~ language=Rust filename=src/day03.rs
// ~\~ begin <<docs/src/day03.md|src/day03.rs>>[init]
mod aoc;

use crate::aoc::{Result, Error}; //input_error};
use std::io;
use std::collections::HashSet;

fn read_input() -> Vec<String> {
    io::stdin().lines().map(|l| l.unwrap()).collect()
}

fn split_half<'a>(s: &'a String) -> (&'a str, &'a str) {
    let h = s.len()/2;
    (&s[0..h], &s[h..])
}

fn priority(c: u8) -> Result<u8> {
    match c {
        b'a'..=b'z' => Ok(c - b'a' + 1),
        b'A'..=b'Z' => Ok(c - b'A' + 27),
        _           => Err(Error::Value(format!("Expected a-zA-Z, got {}", c)))
    } 
}

fn main() -> Result<()> {
    let input = read_input();
    {
        let mut total: u32 = 0;
        for line in &input {
            let (x, y) = split_half(&line); 
            let a: HashSet<u8> = x.bytes().collect();
            let b: HashSet<u8> = y.bytes().collect();
            for i in a.intersection(&b) {
                total += priority(*i)? as u32;
            }
        }
        println!("Part 1: {}", total);
    }
    {
        // at time of writing, std::iter::ArrayChunks is only in nightly
        let chunks = input.len() / 3;
        let mut total = 0;
        for k in 0..chunks {
            let a: HashSet<u8> = input[k*3].bytes().collect();
            let b: HashSet<u8> = input[k*3+1].bytes().collect();
            let c: HashSet<u8> = input[k*3+2].bytes().collect();
            let a_b: HashSet<u8> = a.intersection(&b).copied().collect();
            for i in a_b.intersection(&c) {
                total += priority(*i)? as u32;
            }
        }
        println!("Part 2: {}", total);
    } 
    Ok(())
}
// ~\~ end
