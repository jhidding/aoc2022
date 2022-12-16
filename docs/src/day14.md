# Day 14: Regolith Reservoir

``` {.julia file=src/day14.jl}
module Day14

using Base.Iterators: map as imap, flatten
export consecutive_pairs, read_input

@enum Material air rock sand

struct Cave{T}
    origin::CartesianIndex
    matrix::Matrix{T}
end

function consecutive_pairs(it)
    Channel() do chan
        length(it) < 2 && return
        (prev, st) = iterate(it)
        while !isnothing(begin next = iterate(it, st) end)
            (next, st) = next
            put!(chan, (prev, next))
            prev = next
        end
    end
end

function read_input(inp::IO)
    parse_coord(s) = (split(s, ",") .|> n -> parse(Int, n)) |> Tuple
    parse_path(s) = split(s, "->") .|> parse_coord
    paths = readlines(inp) .|> parse_path
    xlim = extrema(imap(c->c[1], flatten(paths)))
    ylim = extrema(imap(c->c[2], flatten(paths)))
    ylim = (0, ylim[2] + 2)
    xlim = (min(xlim[1], 500 - ylim[2]), max(xlim[2], 500 + ylim[2]))
    cave = Cave(CartesianIndex((xlim[1]-1, ylim[1]-1)),
                fill(air, (xlim[2]-xlim[1]+1, ylim[2]-ylim[1]+1)))
    for path in paths
        cs = path .|> x -> CartesianIndex(x) - cave.origin
        for (a, b) in consecutive_pairs(cs)
            (a, b) = minmax(a, b)
            cave.matrix[a:b] .= rock
        end
    end
    cave
end

function Base.print(io::IO, cave::Cave)
    println(io, cave.origin)
    chars = Dict(rock => "\033[1;33m#", air => "\033[1;30m.", sand => "\033[1;34mo")
    for line in eachcol(cave.matrix)
        println(io, join(line .|> m -> getindex(chars, m)))
    end
    print(io, "\033[m")
end

function drop_grain_of_sand(cave::Cave)
    pos = CartesianIndex((500, 0)) - cave.origin
    dx = CartesianIndex((1, 0))
    dy = CartesianIndex((0, 1))
    while true
        !checkbounds(Bool, cave.matrix, pos) && return false

        if get(cave.matrix, pos+dy, air) == air
            pos += dy
        elseif get(cave.matrix, pos+dy-dx, air) == air
            pos += (dy - dx)
        elseif get(cave.matrix, pos+dy+dx, air) == air
            pos += (dy + dx)
        else
            cave.matrix[pos] = sand
            break
        end
    end
    return true
end

function main(inp::IO, out::IO)
    input = read_input(inp)
    cave = deepcopy(input)
    count = 0
    while drop_grain_of_sand(cave)
        count += 1
    end
    println(out, cave)
    println(out, "Part 1: $count")
    cave = input; count = 1   # off-by-one
    cave.matrix[:,end] .= rock
    while drop_grain_of_sand(cave) &&
          cave.matrix[CartesianIndex((500, 0)) - cave.origin] == air
        count += 1
    end
    println(out, cave)
    println(out, "Part 2: $count")
end

end  # module
```

