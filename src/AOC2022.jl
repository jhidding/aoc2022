# ~\~ language=Julia filename=src/AOC2022.jl
# ~\~ begin <<docs/src/index.md|src/AOC2022.jl>>[init]
module AOC2022

using Printf
using Serialization

# Introduced on day 6
include("CircularBuffers.jl")
using .CircularBuffers

export @day, with_cache

advent = filter(f -> occursin(r"day.*\.jl", f), readdir(@__DIR__))

for day in advent
    include(day)
end

macro day(n::Int)
    modname = Symbol(@sprintf "Day%02u" n)
    input_file = joinpath(@__DIR__, @sprintf "../data/day%02u.txt" n)
    :(open($modname.main, $input_file, "r"))
end  

function with_cache(func::Function, filename::AbstractString)
    if !isfile(filename)
        serialize(filename, func())
    end
    deserialize(filename)
end

end  # module
# ~\~ end
