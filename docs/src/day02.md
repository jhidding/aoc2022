# Day 02: Rock Paper Scissors
I had a longer solution in Julia, but then I started thinking about tricks in modular arithmetic, and came up with this:

## Julia

``` {.julia file=src/day02.jl}
module Day02

read_input(io::IO) = [(line[1]-'A', line[3]-'X') for line in readlines(io)]
score_1((a, b)::Tuple{Int,Int}) = mod(b - a + 1, 3) * 3 + b + 1
score_2((a, b)::Tuple{Int,Int}) = b * 3 + mod(a + b - 1, 3) + 1

function main(io::IO)
    input = read_input(io)
    println("Part 1: $(sum(score_1.(input)))")
    println("Part 2: $(sum(score_2.(input)))")
end

end
```

```@example
using AOC2022  # hide
@day 2
```

Everything will be explained for the rustic version.

## Rust
For the rustic solution, I did away with any enums and just used `u8`. I figured out that we can use some modular arithmetic to find the desired choice for rock, paper or scissors. The following equations should all be read modulo 3. 

| R/P/S | value |
| --- | --- |
| Rock | 0 |
| Paper | 1 |
| Scissors | 2 |

Let's call the two choices $a$ and $b$, then $a$ wins if $a = (b + 1)$, since paper beats rock, scissors beats papers and rock beats scissors.

We can also compute the score using modular arithmetic. Look at $(b - a + 1)$; this will say $0$ if $a$ won, $1$ if it's a draw, and $2$ if $b$ won. Since I'm computing on unsigned values I need to make sure that all values remain positive (you can add multiples of 3 for free), so this becomes $(4 + b - a)$:

``` {.rust #day02-compute-scores}
fn score_part_1((a, b): (u8,u8)) -> u32
    { ((4+b-a)%3 * 3 + b + 1) as u32 }
```

For the second part, we may say $b \to (a + b + 2)$. We can see this as follows: if we need to win, we need to be exactly $b = (a+1)$, if we need to draw $b = a = (a+0)$, and to lose $b = (a-1) = (a+2)$. So we have:

| code | win lose or draw | value |
|---|---|---|
| 0 | lose | $a + 2$ |
| 1 | draw | $a + 0$ |
| 2 | win | $a + 1$ |

If we substitute that into our previous formula for the score, the $(4 + b - a)$ simplifies to simply $b$.

``` {.rust #day02-compute-scores}
fn score_part_2((a, b): (u8,u8)) -> u32
    { (b*3 + (a+b+2)%3 + 1) as u32 }
```

The rest is boiler-plate.

``` {.rust file=src/day02.rs}
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

<<day02-compute-scores>>

fn main() -> Result<()> {
    let input = read_input()?;
    println!("Part 1: {}", input.iter().copied().map(score_part_1).sum::<u32>());
    println!("Part 2: {}", input.iter().copied().map(score_part_2).sum::<u32>());
    Ok(())
}
```


