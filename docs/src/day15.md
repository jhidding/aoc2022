# Day 15: Beacon Exclusion Zone
Somehow, when I use Julia native ranges the runtime explodes. The current implementation still takes about 30 seconds to run. It could be faster to compute the intersection points between the boundaries of all the exclusion zones.

``` {.julia file=src/day15.jl}
module Day15

using DataStructures: SortedSet
export range_at_y, Sensor, read_input

const Pt = @NamedTuple {x::Int, y::Int}

dist(a::Pt, b::Pt) = abs(b.x - a.x) + abs(b.y - a.y)

struct Sensor
    pos::Pt
    beacon::Pt
end

range_at_y(y) = function(s::Sensor)
    d = dist(s.pos, s.beacon)
    if abs(s.pos.y - y) < d
        xrem = d - abs(y - s.pos.y)
        MyRange(s.pos.x - xrem, s.pos.x + xrem)
    else
        nothing
    end
end

Base.parse(::Type{Sensor}, s::AbstractString) = 
    let m = match(r"Sensor at x=(-?\d+), y=(-?\d+): closest beacon is at x=(-?\d+), y=(-?\d+)", s)
        isnothing(m) ? nothing : Sensor((x=parse(Int, m[1]), y=parse(Int, m[2])),
                                        (x=parse(Int, m[3]), y=parse(Int, m[4])))
    end

filter_things(it) = filter(!isnothing, it)
read_input(io::IO) = (eachline(io) .|> l -> parse(Sensor, l)) |> filter_things

struct MyRange
    start::Int
    stop::Int
end

overlap(a::MyRange, b::MyRange) =
    max(a.start, b.start) <= min(a.stop, b.stop)

Base.isless(a::MyRange, b::MyRange) =
    a.start < b.start || (a.start == b.start && a.stop < b.stop)

function Base.intersect(a::MyRange, b::MyRange)
    x, y = max(a.start, b.start), min(a.stop, b.stop)
    x <= y ? MyRange(x, y) : nothing
end

struct RangeSet
    ranges::Vector{MyRange}
    RangeSet(x::MyRange) = new([x])
    function RangeSet(xs::Vector{MyRange})
        isempty(xs) && return new([])
        sort!(xs)
        result = [xs[1]]
        for x in xs[2:end]
            if overlap(x, result[end])
                result[end] = MyRange(result[end].start, max(result[end].stop, x.stop))
            else
                push!(result, x)
            end
        end
        new(result)
    end
end

Base.length(r::MyRange) = r.stop - r.start + 1
Base.length(s::RangeSet) = sum(length.(s.ranges))

function part2(input)
    for y in 0:4000000
        for s in input
            m = RangeSet([intersect(range_at_y(y)(s),MyRange(0, 4000000))
                          for s in input if !isnothing(range_at_y(y)(s))])
            if length(m.ranges) == 2
                return (m.ranges[1].stop + 1, y)
            end
        end
    end
    nothing
end

function main(inp::IO, out::IO)
    input = read_input(inp)
    part1 = RangeSet([(input .|> range_at_y(2000000) |> filter_things)...])
    n_beacons = length(unique(filter(p->p.y==2000000, map(s->s.beacon, input))))
    n_sensors = length(filter(p->p.y==2000000, map(s->s.pos, input)))
    println(out, "Part 1: $(length(part1)-n_beacons-n_sensors)")
    (x, y) = part2(input)
    println(out, "Part 2: $(x * 4000000 + y)")
end

end  # module
```

