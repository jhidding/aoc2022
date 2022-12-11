# ~\~ language=Julia filename=src/AOC2022.jl
# ~\~ begin <<docs/src/index.md|src/AOC2022.jl>>[init]
module AOC2022

using Printf
using Random
using Serialization

# Introduced on day 6
include("CircularBuffers.jl")
using .CircularBuffers

export @day, @runall, with_cache

advent = filter(f -> occursin(r"day.*.jl", f), readdir(@__DIR__))

for day in advent
    include(day)
end

function day_gen(n::Int)
    modname = Symbol(@sprintf "Day%02u" n)
    input_file = joinpath(@__DIR__, @sprintf "../data/day%02u.txt" n)
    quote
        open($input_file, "r") do io_in
            $modname.main(io_in)
        end
    end
end

function frieze()
    color = (150, 100, 250)
    chars = # rand(Char(0x1fb00):Char(0x1fb3b), 5)
        rand(Char(0x1fb90):Char(0x1fb90), 5)
    colors = [1,1,1,1,1] .|> f -> round.(Int, color ./ f)
    foldl(*, ["\033[38;2;$(r);$(g);$(b)m$(c)" for ((r,g,b), c) in zip(colors, chars)])
end

function decorated_day(n::Int)
    modname = Symbol(@sprintf "Day%02u" n)
    input_file = joinpath(@__DIR__, @sprintf "../data/day%02u.txt" n)
    quote
        n=$n
        println("\033[48;2;160;20;60m $(frieze())\033[37m  \033[1mDay $n                          \033[m")
        buf = PipeBuffer()
        open($input_file, "r") do io_in
            $modname.main(io_in, buf)
        end
        for line in eachline(buf)
            println(" $(frieze())\033[m    $line")
        end
    end
end

macro day(n::Int)
    decorated_day(n)
end  

macro runall()
    function get_day(s)
        m = match(r"day(\d+)\.jl", s)
        isnothing(m) ? nothing : parse(Int, m[1])
    end
    runs = filter(!isnothing, advent .|> get_day) .|> decorated_day
    :(begin $(runs...) end)
end

function with_cache(func::Function, filename::AbstractString)
    if !isfile(filename)
        serialize(filename, func())
    end
    deserialize(filename)
end

end  # module
# ~\~ end
