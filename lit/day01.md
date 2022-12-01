# Day 01: Calorie Counting

Adding up numbers!

``` {.rust file=src/lib.rs}
mod aoc {
    pub enum Error {
        Input(String)
    }

    pub type Result<T> = std::Result<T, Error>;
}
```

``` {.rust file=src/day01.rs}
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
```
