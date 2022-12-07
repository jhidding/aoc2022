# Day 06: Tuning Trouble

``` {.julia file=src/day06.jl}
module Day06

using ..CircularBuffers

function find_start_marker(n::Int, s::String)
    for i in n:length(s)
        if allunique(s[i-n+1:i])
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

<<day06-circular-buffer>>

end  # module
```

```@example
using AOC2022  # hide
@day 6
```

## Let's go crazy
This is rather mad, but we can implement a circular buffer, so theoretically we would not need to load all data at once. Call me crazy, but this **sliding window** thing that is introduced here is typically something seemingly innocuous that comes back with a revenge next week in Advent of Code.

``` {.julia #day06-circular-buffer}
function find_start_marker_cb(n::Int, s::String)
    b = CircularBuffer{Char}(n)
    for (i, c) in enumerate(s)
        push!(b, c)
        if length(b) == n && allunique(b)
            return i
        end
    end
    -1
end
```

A circular buffer sits on a `Vector` of constant size. Each time we `push!` an element to the buffer, we assign it to the current `endloc` pointer, overwriting the oldest value. This pointer gets advanced by one, wrapping around when needed.

``` {.julia file=src/CircularBuffers.jl}
module CircularBuffers

export CircularBuffer, content, pushpop!

mutable struct CircularBuffer{T}
    content::Vector{T}
    endloc::Int
    length::Int
end

<<circular-buffer-constructors>>
<<circular-buffer-methods>>

end
```

For now we have two constructors: one that has the buffer size given, and leaves the contents uninitialised, the other where you give prefilled contents and we assume the buffer is completely filled.

``` {.julia #circular-buffer-constructors}
CircularBuffer{T}(size::Int) where T =
    CircularBuffer{T}(Vector{T}(undef, size), 1, 0)

CircularBuffer{T}(content::Vector{T}) where T =
    CircularBuffer{T}(content, 1, length(content))
```

Julia provides an interface definition for collections. This interface is not in any way regulated by the type system though. It is convenient to build some unit tests.

``` {.julia file=test/runtests.jl}
using Test, AOC2022.CircularBuffers

@testset "CircularBuffers" begin
    b = CircularBuffer{Int}(4)
    @test isempty(b)
    foreach(i->push!(b, i), 1:3)
    @test length(b) == 3
    @test sort(content(b)) == [1, 2, 3]
    foreach(i->push!(b, i), 1:3)
    @test 1 ∈ b && 2 ∈ b && 3 ∈ b
    @test 4 ∉ b
    @test length(b) == 4
    empty!(b)
    @test isempty(b)
    @test eltype(b) == Int
end
```

### General collection
A general collection in Julia is expected to have the following methods defined.

``` {.julia #circular-buffer-methods}
Base.isempty(b::CircularBuffer{T}) where T = b.length == 0

function Base.empty!(b::CircularBuffer{T}) where T
    b.length = 0
    b.endloc = 1
end

Base.length(b::CircularBuffer{T}) where T = b.length
Base.checked_length(b::CircularBuffer{T}) where T = b.length
```

### Iterable collection
In many cases we need to see the contents but are not interested in the order of things. The `contents` function only worries about rearranging stuff when the length of the buffer contents is shorter than the buffer size.

``` {.julia #circular-buffer-methods}
function content(b::CircularBuffer{T}) where T
    if b.length < length(b.content)
        start = mod1(b.endloc-b.length, length(b.content))
        if start+b.length <= length(b.content)
            b.content[start:start+b.length-1]
        else
            rest = start + b.length - length(b.content)
            [b.content[start:end];b.content[1:rest]]
        end
    else
        b.content
    end
end
```

``` {.julia #circular-buffer-methods}
Base.in(item::T, b::CircularBuffer{T}) where T = item in content(b)
Base.eltype(::CircularBuffer{T}) where T = T
Base.unique(b::CircularBuffer{T}) where T = unique(content(b))
Base.unique(f::Function, b::CircularBuffer{T}) where T = unique(f, content(b))

function Base.push!(b::CircularBuffer{T}, item::T) where T
    b.content[b.endloc] = item
    b.endloc = mod1(b.endloc+1, length(b.content))
    b.length = min(length(b.content), b.length+1)
end

function pushpop!(b::CircularBuffer{T}, item::T) where T
    oldvalue = b.content[b.endloc]
    b.content[b.endloc] = item
    b.endloc = mod1(b.endloc+1, length(b.content))
    oldvalue
end

Base.allunique(b::CircularBuffer{T}) where T = allunique(content(b))
```

## Using a bitset
Julia has a datatype `BitSet`, but that doesn't keep track of the number of items in the set. We can make our own `BitCounter`. This doesn't exactly count the number of unique items in the set, but doubles are counted only once due to the virtue of the exclusive-or operator. This means that the maximum count is still the length of the set, and this only occurs when all inserted elements are unique.

``` {.julia #day06-circular-buffer}
mutable struct BitCounter{T}
    bits::T
    count::T
end

BitCounter{T}() where T <: Integer = BitCounter{T}(0, 0)

function insert!(b::BitCounter{T}, i::T) where T <: Integer
    if b.bits & (1 << i) == 0
        b.count += 1
    end
    b.bits ⊻= (1 << i)
end

function remove!(b::BitCounter{T}, i::T) where T <: Integer
    if b.bits & (1 << i) != 0
        b.count -= 1
    end
    b.bits ⊻= (1 << i)
end

function find_start_marker_bitmask(n::Int, s::String)
    b = CircularBuffer{Char}(Vector{Char}(s[1:n]))
    x = BitCounter{Int64}()
    for c in s[1:n]
        insert!(x, c - 'a')
    end
    for (j, c) in enumerate(s[n+1:end])
        out = pushpop!(b, c)
        remove!(x, out - 'a')
        insert!(x, c - 'a')
        if x.count == n
            return j+n
        end
    end
    -1
end
```

## Benchmarks
The crazy thing is: the circular buffer version is faster than the first version, which I don't understand at all. What I do understand is why the bitmask version beats all the others.

```@example 1
using BenchmarkTools
using AOC2022: with_cache
using AOC2022.Day06: find_start_marker, find_start_marker_cb, find_start_marker_bitmask

input = open(readline, "../../data/day06.txt", "r")
find_start_marker(14, input) == 
    find_start_marker_cb(14, input) == 
    find_start_marker_bitmask(14, input)
```

```@example 1
with_cache("../artifacts/day06-benchmark-1.bin") do
    @benchmark find_start_marker(14, input)
end
```

```@example 1
with_cache("../artifacts/day06-benchmark-2.bin") do
    @benchmark find_start_marker_cb(14, input)
end
```

```@example 1
with_cache("../artifacts/day06-benchmark-3.bin") do
    @benchmark find_start_marker_bitmask(14, input)
end
```
