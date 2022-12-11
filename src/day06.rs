// ~\~ language=Rust filename=src/day06.rs
// ~\~ begin <<docs/src/day06.md|src/day06.rs>>[init]
mod aoc;

use crate::aoc::{Result, input_error};
use std::io;

fn read_input() -> Result<Vec<u8>> {
    let mut input = String::new();
    io::stdin().read_line(&mut input).map_err(input_error)?;
    Ok(input.bytes().collect())
}

#[derive(Debug)]
struct CircularBuffer<T> {
    content: Vec<T>,
    endloc: usize,
}

impl<T> CircularBuffer<T> {
    fn new(content: Vec<T>) -> Self {
        CircularBuffer { content: content, endloc: 0 }
    }

    fn push(self: &mut Self, mut item: T) -> T {
        std::mem::swap(&mut item, &mut self.content[self.endloc]);
        self.endloc = (self.endloc + 1) % self.content.len();
        item
    }
}

#[derive(Debug)]
struct BitSet {
    bits: usize,
    count: usize
}

impl BitSet {
    fn new() -> Self { BitSet { bits: 0, count: 0 } }
    fn insert(self: &mut Self, i: usize) {
        if self.bits & (1 << i) == 0 {
            self.count += 1;
        }
        self.bits ^= 1 << i;
    }
    fn remove(self: &mut Self, i: usize) {
        if self.bits & (1 << i) != 0 {
            self.count -= 1;
        }
        self.bits ^= 1 << i;
    }
}

fn find_start_marker(input: &Vec<u8>, n: usize) -> usize {
    let mut buf = CircularBuffer::new(input[..n].to_vec());
    let mut set = BitSet::new();
    for c in buf.content.iter() {
        set.insert((*c - b'a') as usize);
    }
    let mut pos: usize = n+1;
    for c in input[n..input.len()-1].iter() {
        let d = buf.push(*c);
        set.remove((d - b'a') as usize);
        set.insert((*c - b'a') as usize);
        if set.count == n { break; }
        pos += 1;
    }
    pos
}

fn main() -> Result<()> {
    let input = read_input()?;
    println!("Part 1: {}", find_start_marker(&input, 4));
    println!("Part 2: {}", find_start_marker(&input, 14));
    Ok(())
}
// ~\~ end
