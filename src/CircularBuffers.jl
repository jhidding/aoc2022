# ~\~ language=Julia filename=src/CircularBuffers.jl
# ~\~ begin <<docs/src/day06.md|src/CircularBuffers.jl>>[init]
module CircularBuffers

export CircularBuffer, content, pushpop!

mutable struct CircularBuffer{T}
    content::Vector{T}
    endloc::Int
    length::Int
end

# ~\~ begin <<docs/src/day06.md|circular-buffer-constructors>>[init]
CircularBuffer{T}(size::Int) where T =
    CircularBuffer{T}(Vector{T}(undef, size), 1, 0)

CircularBuffer{T}(content::Vector{T}) where T =
    CircularBuffer{T}(content, 1, length(content))
# ~\~ end
# ~\~ begin <<docs/src/day06.md|circular-buffer-methods>>[init]
Base.isempty(b::CircularBuffer{T}) where T = b.length == 0

function Base.empty!(b::CircularBuffer{T}) where T
    b.length = 0
    b.endloc = 1
end

Base.length(b::CircularBuffer{T}) where T = b.length
Base.checked_length(b::CircularBuffer{T}) where T = b.length
# ~\~ end
# ~\~ begin <<docs/src/day06.md|circular-buffer-methods>>[1]
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
# ~\~ end
# ~\~ begin <<docs/src/day06.md|circular-buffer-methods>>[2]
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
# ~\~ end

end
# ~\~ end
