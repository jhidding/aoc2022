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
# ~\~ begin <<docs/src/day06.md|day06-circular-buffer>>[1]
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
# ~\~ end

end  # module
# ~\~ end
