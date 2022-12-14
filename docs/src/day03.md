# Day 03: Rucksack Reorganization
Here Julia is being very nice, by allowing me to do set-operation on strings. I was for a moment confused by the column major ordering of Julia's arrays. So in Python the line for part 2, would be something like:

```python
for row in input.reshape([-1, 3]):
    ... # find union of string characters
```

In Julia we have:

```julia
for col in eachcol(reshape(input, 3, :))
    ... # do our thing
end
```

That just takes a bit getting used to I guess.

``` {.julia file=src/day03.jl}
module Day03

split_half(s) = begin
    l = length(s) ÷ 2
    (s[1:l], s[l+1:end])
end

priority(c::Char) = islowercase(c) ? c - 'a' + 1 : c - 'A' + 27

function main(io::IO, io_out::IO=stdout)
    input = readlines(io)
    part1 = input .|> split_half .|> ((a,b),) -> (a ∩ b)[1] .|> priority
    println(io_out, "Part 1: $(sum(part1))")
    part2 = eachcol(reshape(input, 3, :)) .|> a -> reduce(∩, a)[1] .|> priority
    println(io_out, "Part 2: $(sum(part2))")
end

end  # module
```

```@example
using AOC2022  # hide
@day 3
```

## Rust
I feel so clumsy with Rust... 

``` {.rust file=src/day03.rs}
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
```
