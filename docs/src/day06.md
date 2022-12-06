# Day 06: Tuning Trouble

``` {.julia file=src/day06.jl}
module Day06

function find_start_marker(n::Int, s::String)
    for i in n:length(s)
        if length(Set(s[i-n+1:i])) == n
            return i
        end
    end
    nothing
end

function main(io::IO)
    input = readline(io)
    println("Part 1: $(find_start_marker(4, input))")
    println("Part 2: $(find_start_marker(14, input))")
end

end  # module
```

```@example
using AOC2022  # hide
@day 6
```
