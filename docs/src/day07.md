# Day 07: No Space Left On Device

``` {.julia file=src/day07.jl}
module Day07

abstract type Console end
struct CD <: Console
    dir :: String
end
struct CDUP <: Console end
struct LS <: Console end
struct FILE <: Console
    size :: Int
    name :: String
    ext :: Union{Nothing, String}
end

filename(f::FILE) = isnothing(f.ext) ? f.name : f.name * f.ext

struct DIR <: Console
    name :: String
end

function Base.parse(::Type{CD}, line::String)
    cd_re = r"^\$ cd ([a-z]+)$"
    m = match(cd_re, line)
    isnothing(m) ? nothing : CD(m[1])
end

function Base.parse(::Type{CDUP}, line::String)
    cdup_re = r"^\$ cd \.\.$"
    m = match(cdup_re, line)
    isnothing(m) ? nothing : CDUP()
end

function Base.parse(::Type{LS}, line::String)
    ls_re = r"^\$ ls$"
    m = match(ls_re, line)
    isnothing(m) ? nothing : LS()
end

function Base.parse(::Type{FILE}, line::String)
    file_re = r"^(\d+) (\w+)(\.\w+)?$"
    m = match(file_re, line)
    isnothing(m) ? nothing : FILE(parse(Int, m[1]), m[2], m[3])
end

function Base.parse(::Type{DIR}, line::String)
    dir_re = r"^dir (\w+)$"
    m = match(dir_re, line)
    isnothing(m) ? nothing : DIR(m[1])
end

function Base.parse(::Type{Console}, line::String)
    types = [CD, CDUP, LS, FILE, DIR]
    for t in types
        r = parse(t, line)
        !isnothing(r) && return r
    end
    nothing
end 

mutable struct FileTree
    name::String
    contents::Dict{String,Union{FILE,FileTree}}
    size::Int
end

function build_tree(input::Vector{Console})
    root = FileTree("/", Dict(), 0)
    cwd = root
    path = [root]
    for entry in input
        if entry isa CD
            @assert (entry.dir in keys(cwd.contents)) "dir $(entry.dir) not found in $(keys(cwd.contents))"
            @assert (cwd.contents[entry.dir] isa FileTree) "dir $(entry.dir) seems to be a file $(cwd.contents[entry.dir])"
            push!(path, cwd)
            cwd = cwd.contents[entry.dir]
        elseif entry isa CDUP
            path[end].size += cwd.size
            cwd = pop!(path)
        elseif entry isa LS
            # do nothing
        elseif entry isa FILE
            cwd.contents[filename(entry)] = entry
            cwd.size += entry.size
        elseif entry isa DIR
            cwd.contents[entry.name] = FileTree(entry.name, Dict(), 0)
        end
    end
    root
end

function flatten(t::FileTree)
    subdirs::Vector{FileTree} = filter(v -> v isa FileTree, collect(values(t.contents)))
    subsubdirs::Vector{FileTree} = vcat(map(flatten, subdirs)...)
    [subdirs; subsubdirs]
end

function read_input(io::IO)
    filter(!isnothing, readlines(io) .|> l -> parse(Console, l))
end

function main(io::IO)
    input::Vector{Console} = read_input(io)
    tree = build_tree(input)
    flat = flatten(tree)
    part1 = sum(d.size for d in flat if d.size <= 100000)
    println("Part 1: $part1")

    space_free = 70000000 - tree.size
    need_to_free = 30000000 - space_free
    (part2, _) = findmin(d->d.size, filter(d -> d.size >= need_to_free, flat))
    println("Part 2: $part2")
end

end  # module
```

```@example
using AOC2022  # hide
@day 7
```
