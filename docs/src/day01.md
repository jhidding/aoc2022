# Day 01: Calorie Counting

Adding up numbers! I solved today's exercise in both Julia and Rust, as I'm still unsure in what language to do the rest. Julia gives beautiful clutter free code, Rust gives the nice guarantees of a decent type system. 

## Rust
The first thing we need to do (in any Rust project) is to define an `Error` type, and a specialised `Result`. It is idiomatic to have specialised `Result` this way. A lot of functions in Rust return their own kind of `Result`, which we can `map_err` to ours. This way we can collect errors from different sources. For now, we just have input errors.

``` {.rust file=src/aoc.rs}
#[derive(Debug)]
pub enum Error {
    Input(String)
}

pub type Result<T> = core::result::Result<T, Error>;

pub fn input_error<T>(err:T) -> Error where T: core::fmt::Debug {
    Error::Input(format!("{:?}", err))
}
```

Our input has lists of integers that are separated by an empty line. We store this in a `Vec<Vec<u32>>`.

``` {.rust #read-lists-of-int}
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
```

Note how smart Rust is here. When we call `result.push(v)` the vector `v` is **moved** into the result vector. After that the contents of `v` are no longer accessible through `v`. This is Ok though, since we immediately construct a new vector to continue with.

To compute the sums of each input vector, I find the syntax a bit wordy.

``` {.rust file=src/day01.rs}
mod aoc;

use crate::aoc::{Error,Result,input_error};
use std::io;

<<read-lists-of-int>>

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
```

## Julia
In Julia I was able to write a bit more abstract code from the get-go. This should also be possible in Rust, but it was harder to think about all the traits. So we have a generic function for splitting an iterable into chunks:

``` {.julia #function-split-on}
function split_on(lst, sep)
    Channel() do channel
        v = []
        for item in lst
            if item == sep
                put!(channel, v)
                v = []
            else
                push!(v, item)
            end
        end
        if !isempty(v)
            put!(channel, v)
        end
    end
end
```

Then the rest of the program follows.

``` {.julia file=src/day01.jl}
module Day01

export main

<<function-split-on>>

function read_input(io::IO=stdin)
    map(sub -> parse.(Int, sub), split_on(readlines(io), ""))
end

function main(io_in::IO, io_out::IO=stdout)
    input = read_input(io_in)
    part1 = maximum(sum.(input))
    println(io_out, "Part 1: $part1")
    part2 = sum(sort(sum.(input))[end-3:end])
    println(io_out, "Part 2: $part2")
end

end  # module
```

```@example
using AOC2022  # hide
@day 01
```
