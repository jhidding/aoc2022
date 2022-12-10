# ~\~ language=Julia filename=src/day01.jl
# ~\~ begin <<docs/src/day01.md|src/day01.jl>>[init]
module Day01

export main

# ~\~ begin <<docs/src/day01.md|function-split-on>>[init]
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
# ~\~ end

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
# ~\~ end
