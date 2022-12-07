# ~\~ language=Julia filename=src/day06.jl
# ~\~ begin <<docs/src/day06.md|src/day06.jl>>[init]
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

# ~\~ begin <<docs/src/day06.md|day06-circular-buffer>>[init]
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
# ~\~ end

end  # module
# ~\~ end
