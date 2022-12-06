# ~\~ language=Julia filename=src/day06.jl
# ~\~ begin <<docs/src/day06.md|src/day06.jl>>[init]
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
# ~\~ end
