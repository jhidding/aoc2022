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
