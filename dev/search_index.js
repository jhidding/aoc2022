var documenterSearchIndex = {"docs":
[{"location":"day01/#Day-01:-Calorie-Counting","page":"Day 01: Calorie Counting","title":"Day 01: Calorie Counting","text":"","category":"section"},{"location":"day01/","page":"Day 01: Calorie Counting","title":"Day 01: Calorie Counting","text":"Adding up numbers! I solved today's exercise in both Julia and Rust, as I'm still unsure in what language to do the rest. Julia gives beautiful clutter free code, Rust gives the nice guarantees of a decent type system. ","category":"page"},{"location":"day01/#Rust","page":"Day 01: Calorie Counting","title":"Rust","text":"","category":"section"},{"location":"day01/","page":"Day 01: Calorie Counting","title":"Day 01: Calorie Counting","text":"The first thing we need to do (in any Rust project) is to define an Error type, and a specialised Result. It is idiomatic to have specialised Result this way. A lot of functions in Rust return their own kind of Result, which we can map_err to ours. This way we can collect errors from different sources. For now, we just have input errors.","category":"page"},{"location":"day01/","page":"Day 01: Calorie Counting","title":"Day 01: Calorie Counting","text":"<div class=\"noweb-label\">file:<i>src/aoc.rs</i></div>","category":"page"},{"location":"day01/","page":"Day 01: Calorie Counting","title":"Day 01: Calorie Counting","text":"#[derive(Debug)]\npub enum Error {\n    Input(String)\n}\n\npub type Result<T> = core::result::Result<T, Error>;\n\npub fn input_error<T>(err:T) -> Error where T: core::fmt::Debug {\n    Error::Input(format!(\"{:?}\", err))\n}","category":"page"},{"location":"day01/","page":"Day 01: Calorie Counting","title":"Day 01: Calorie Counting","text":"Our input has lists of integers that are separated by an empty line. We store this in a Vec<Vec<u32>>.","category":"page"},{"location":"day01/","page":"Day 01: Calorie Counting","title":"Day 01: Calorie Counting","text":"<div class=\"noweb-label\">⪡read-lists-of-int⪢≣</div>","category":"page"},{"location":"day01/","page":"Day 01: Calorie Counting","title":"Day 01: Calorie Counting","text":"fn read_input() -> Result<Vec<Vec<u32>>> {\n    let mut v = Vec::<u32>::new();\n    let mut result = Vec::new();\n    for line in io::stdin().lines() {\n        let l = line.map_err(input_error)?;\n        if l.is_empty() {\n            result.push(v);\n            v = Vec::<u32>::new();\n        } else {\n            v.push(l.parse().map_err(input_error)?);\n        }\n    }\n    if !v.is_empty() {\n        result.push(v);\n    }\n    Ok(result)\n}","category":"page"},{"location":"day01/","page":"Day 01: Calorie Counting","title":"Day 01: Calorie Counting","text":"Note how smart Rust is here. When we call result.push(v) the vector v is moved into the result vector. After that the contents of v are no longer accessible through v. This is Ok though, since we immediately construct a new vector to continue with.","category":"page"},{"location":"day01/","page":"Day 01: Calorie Counting","title":"Day 01: Calorie Counting","text":"To compute the sums of each input vector, I find the syntax a bit wordy.","category":"page"},{"location":"day01/","page":"Day 01: Calorie Counting","title":"Day 01: Calorie Counting","text":"<div class=\"noweb-label\">file:<i>src/day01.rs</i></div>","category":"page"},{"location":"day01/","page":"Day 01: Calorie Counting","title":"Day 01: Calorie Counting","text":"mod aoc;\n\nuse crate::aoc::{Error,Result,input_error};\nuse std::io;\n\n<<read-lists-of-int>>\n\nfn main() -> Result<()> {\n    let input = read_input()?;\n    let mut sums: Vec<u32> = input.iter().map(|x| { x.iter().sum::<u32>() }).collect();\n\n    let part1 = sums.iter().max().ok_or(Error::Input(\"Empty input\".to_string()))?;\n    println!(\"Part 1: {}\", part1);\n\n    sums.sort();\n    let part2: u32 = sums[sums.len()-3..].iter().sum();\n    println!(\"Part 2: {}\", part2);\n    Ok(())\n}","category":"page"},{"location":"day01/#Julia","page":"Day 01: Calorie Counting","title":"Julia","text":"","category":"section"},{"location":"day01/","page":"Day 01: Calorie Counting","title":"Day 01: Calorie Counting","text":"In Julia I was able to write a bit more abstract code from the get-go. This should also be possible in Rust, but it was harder to think about all the traits. So we have a generic function for splitting an iterable into chunks:","category":"page"},{"location":"day01/","page":"Day 01: Calorie Counting","title":"Day 01: Calorie Counting","text":"<div class=\"noweb-label\">⪡function-split-on⪢≣</div>","category":"page"},{"location":"day01/","page":"Day 01: Calorie Counting","title":"Day 01: Calorie Counting","text":"function split_on(lst, sep)\n    Channel() do channel\n        v = []\n        for item in lst\n            if item == sep\n                put!(channel, v)\n                v = []\n            else\n                push!(v, item)\n            end\n        end\n        if !isempty(v)\n            put!(channel, v)\n        end\n    end\nend","category":"page"},{"location":"day01/","page":"Day 01: Calorie Counting","title":"Day 01: Calorie Counting","text":"Then the rest of the program follows.","category":"page"},{"location":"day01/","page":"Day 01: Calorie Counting","title":"Day 01: Calorie Counting","text":"<div class=\"noweb-label\">file:<i>src/day01.jl</i></div>","category":"page"},{"location":"day01/","page":"Day 01: Calorie Counting","title":"Day 01: Calorie Counting","text":"module Day01\n\nexport main\n\n<<function-split-on>>\n\nfunction read_input(io::IO=stdin)\n    map(sub -> parse.(Int, sub), split_on(readlines(io), \"\"))\nend\n\nfunction main(io::IO=stdin)\n    input = read_input(io)\n    part1 = maximum(sum.(input))\n    println(\"Part 1: $part1\")\n    part2 = sum(sort(sum.(input))[end-3:end])\n    println(\"Part 2: $part2\")\nend\n\nend  # module","category":"page"},{"location":"day01/","page":"Day 01: Calorie Counting","title":"Day 01: Calorie Counting","text":"using AOC2022  # hide\n@day 01","category":"page"},{"location":"day06/#Day-06:-Tuning-Trouble","page":"Day 06: Tuning Trouble","title":"Day 06: Tuning Trouble","text":"","category":"section"},{"location":"day06/","page":"Day 06: Tuning Trouble","title":"Day 06: Tuning Trouble","text":"<div class=\"noweb-label\">file:<i>src/day06.jl</i></div>","category":"page"},{"location":"day06/","page":"Day 06: Tuning Trouble","title":"Day 06: Tuning Trouble","text":"module Day06\n\nusing ..CircularBuffers\n\nfunction find_start_marker(n::Int, s::String)\n    for i in n:length(s)\n        if allunique(s[i-n+1:i])\n            return i\n        end\n    end\n    nothing\nend\n\nfunction main(io::IO)\n    input = readline(io)\n    println(\"Part 1: $(find_start_marker(4, input))\")\n    println(\"Part 2: $(find_start_marker(14, input))\")\nend\n\n<<day06-circular-buffer>>\n\nend  # module","category":"page"},{"location":"day06/","page":"Day 06: Tuning Trouble","title":"Day 06: Tuning Trouble","text":"using AOC2022  # hide\n@day 6","category":"page"},{"location":"day06/#Let's-go-crazy","page":"Day 06: Tuning Trouble","title":"Let's go crazy","text":"","category":"section"},{"location":"day06/","page":"Day 06: Tuning Trouble","title":"Day 06: Tuning Trouble","text":"This is rather mad, but we can implement a circular buffer, so theoretically we would not need to load all data at once. Call me crazy, but this sliding window thing that is introduced here is typically something seemingly innocuous that comes back with a revenge next week in Advent of Code.","category":"page"},{"location":"day06/","page":"Day 06: Tuning Trouble","title":"Day 06: Tuning Trouble","text":"<div class=\"noweb-label\">⪡day06-circular-buffer⪢≣</div>","category":"page"},{"location":"day06/","page":"Day 06: Tuning Trouble","title":"Day 06: Tuning Trouble","text":"function find_start_marker_cb(n::Int, s::String)\n    b = CircularBuffer{Char}(n)\n    for (i, c) in enumerate(s)\n        push!(b, c)\n        if length(b) == n && allunique(b)\n            return i\n        end\n    end\n    -1\nend","category":"page"},{"location":"day06/","page":"Day 06: Tuning Trouble","title":"Day 06: Tuning Trouble","text":"A circular buffer sits on a Vector of constant size. Each time we push! an element to the buffer, we assign it to the current endloc pointer, overwriting the oldest value. This pointer gets advanced by one, wrapping around when needed.","category":"page"},{"location":"day06/","page":"Day 06: Tuning Trouble","title":"Day 06: Tuning Trouble","text":"<div class=\"noweb-label\">file:<i>src/CircularBuffers.jl</i></div>","category":"page"},{"location":"day06/","page":"Day 06: Tuning Trouble","title":"Day 06: Tuning Trouble","text":"module CircularBuffers\n\nexport CircularBuffer, content\n\nmutable struct CircularBuffer{T}\n    content::Vector{T}\n    endloc::Int\n    length::Int\nend\n\n<<circular-buffer-constructors>>\n<<circular-buffer-methods>>\n\nend","category":"page"},{"location":"day06/","page":"Day 06: Tuning Trouble","title":"Day 06: Tuning Trouble","text":"For now we have two constructors: one that has the buffer size given, and leaves the contents uninitialised, the other where you give prefilled contents and we assume the buffer is completely filled.","category":"page"},{"location":"day06/","page":"Day 06: Tuning Trouble","title":"Day 06: Tuning Trouble","text":"<div class=\"noweb-label\">⪡circular-buffer-constructors⪢≣</div>","category":"page"},{"location":"day06/","page":"Day 06: Tuning Trouble","title":"Day 06: Tuning Trouble","text":"CircularBuffer{T}(size::Int) where T =\n    CircularBuffer{T}(Vector{T}(undef, size), 1, 0)\n\nCircularBuffer{T}(content::Vector{T}) where T =\n    CircularBuffer{T}(content, 1, length(content))","category":"page"},{"location":"day06/","page":"Day 06: Tuning Trouble","title":"Day 06: Tuning Trouble","text":"Julia provides an interface definition for collections. This interface is not in any way regulated by the type system though. It is convenient to build some unit tests.","category":"page"},{"location":"day06/","page":"Day 06: Tuning Trouble","title":"Day 06: Tuning Trouble","text":"<div class=\"noweb-label\">file:<i>test/runtests.jl</i></div>","category":"page"},{"location":"day06/","page":"Day 06: Tuning Trouble","title":"Day 06: Tuning Trouble","text":"using Test, AOC2022.CircularBuffers\n\n@testset \"CircularBuffers\" begin\n    b = CircularBuffer{Int}(4)\n    @test isempty(b)\n    foreach(i->push!(b, i), 1:3)\n    @test length(b) == 3\n    @test sort(content(b)) == [1, 2, 3]\n    foreach(i->push!(b, i), 1:3)\n    @test 1 ∈ b && 2 ∈ b && 3 ∈ b\n    @test 4 ∉ b\n    @test length(b) == 4\n    empty!(b)\n    @test isempty(b)\n    @test eltype(b) == Int\nend","category":"page"},{"location":"day06/#General-collection","page":"Day 06: Tuning Trouble","title":"General collection","text":"","category":"section"},{"location":"day06/","page":"Day 06: Tuning Trouble","title":"Day 06: Tuning Trouble","text":"A general collection in Julia is expected to have the following methods defined.","category":"page"},{"location":"day06/","page":"Day 06: Tuning Trouble","title":"Day 06: Tuning Trouble","text":"<div class=\"noweb-label\">⪡circular-buffer-methods⪢≣</div>","category":"page"},{"location":"day06/","page":"Day 06: Tuning Trouble","title":"Day 06: Tuning Trouble","text":"Base.isempty(b::CircularBuffer{T}) where T = b.length == 0\n\nfunction Base.empty!(b::CircularBuffer{T}) where T\n    b.length = 0\n    b.endloc = 1\nend\n\nBase.length(b::CircularBuffer{T}) where T = b.length\nBase.checked_length(b::CircularBuffer{T}) where T = b.length","category":"page"},{"location":"day06/#Iterable-collection","page":"Day 06: Tuning Trouble","title":"Iterable collection","text":"","category":"section"},{"location":"day06/","page":"Day 06: Tuning Trouble","title":"Day 06: Tuning Trouble","text":"In many cases we need to see the contents but are not interested in the order of things. The contents function only worries about rearranging stuff when the length of the buffer contents is shorter than the buffer size.","category":"page"},{"location":"day06/","page":"Day 06: Tuning Trouble","title":"Day 06: Tuning Trouble","text":"<div class=\"noweb-label\">⪡circular-buffer-methods⪢⊞</div>","category":"page"},{"location":"day06/","page":"Day 06: Tuning Trouble","title":"Day 06: Tuning Trouble","text":"function content(b::CircularBuffer{T}) where T\n    if b.length < length(b.content)\n        start = mod1(b.endloc-b.length, length(b.content))\n        if start+b.length <= length(b.content)\n            b.content[start:start+b.length-1]\n        else\n            rest = start + b.length - length(b.content)\n            [b.content[start:end];b.content[1:rest]]\n        end\n    else\n        b.content\n    end\nend","category":"page"},{"location":"day06/","page":"Day 06: Tuning Trouble","title":"Day 06: Tuning Trouble","text":"<div class=\"noweb-label\">⪡circular-buffer-methods⪢⊞</div>","category":"page"},{"location":"day06/","page":"Day 06: Tuning Trouble","title":"Day 06: Tuning Trouble","text":"Base.in(item::T, b::CircularBuffer{T}) where T = item in content(b)\nBase.eltype(::CircularBuffer{T}) where T = T\nBase.unique(b::CircularBuffer{T}) where T = unique(content(b))\nBase.unique(f::Function, b::CircularBuffer{T}) where T = unique(f, content(b))\n\nfunction Base.push!(b::CircularBuffer{T}, item::T) where T\n    b.content[b.endloc] = item\n    b.endloc = mod1(b.endloc+1, length(b.content))\n    b.length = min(length(b.content), b.length+1)\nend\n\nBase.allunique(b::CircularBuffer{T}) where T = allunique(content(b))","category":"page"},{"location":"day06/#Benchmarks","page":"Day 06: Tuning Trouble","title":"Benchmarks","text":"","category":"section"},{"location":"day06/","page":"Day 06: Tuning Trouble","title":"Day 06: Tuning Trouble","text":"The crazy thing is: the circular buffer version is faster than the first version, which I don't understand at all.","category":"page"},{"location":"day06/","page":"Day 06: Tuning Trouble","title":"Day 06: Tuning Trouble","text":"using BenchmarkTools\nusing AOC2022.Day06: find_start_marker, find_start_marker_cb\ninput = open(readline, \"../../data/day06.txt\", \"r\")\n@benchmark find_start_marker(14, input)","category":"page"},{"location":"day06/","page":"Day 06: Tuning Trouble","title":"Day 06: Tuning Trouble","text":"@benchmark find_start_marker_cb(14, input)","category":"page"},{"location":"day07/#Day-07:-No-Space-Left-On-Device","page":"Day 07: No Space Left On Device","title":"Day 07: No Space Left On Device","text":"","category":"section"},{"location":"day07/","page":"Day 07: No Space Left On Device","title":"Day 07: No Space Left On Device","text":"<div class=\"noweb-label\">file:<i>src/day07.jl</i></div>","category":"page"},{"location":"day07/","page":"Day 07: No Space Left On Device","title":"Day 07: No Space Left On Device","text":"module Day07\n\nabstract type Console end\nstruct CD <: Console\n    dir :: String\nend\nstruct CDUP <: Console end\nstruct LS <: Console end\nstruct FILE <: Console\n    size :: Int\n    name :: String\n    ext :: Union{Nothing, String}\nend\n\nfilename(f::FILE) = isnothing(f.ext) ? f.name : f.name * f.ext\n\nstruct DIR <: Console\n    name :: String\nend\n\nfunction Base.parse(::Type{CD}, line::String)\n    cd_re = r\"^\\$ cd ([a-z]+)$\"\n    m = match(cd_re, line)\n    isnothing(m) ? nothing : CD(m[1])\nend\n\nfunction Base.parse(::Type{CDUP}, line::String)\n    cdup_re = r\"^\\$ cd \\.\\.$\"\n    m = match(cdup_re, line)\n    isnothing(m) ? nothing : CDUP()\nend\n\nfunction Base.parse(::Type{LS}, line::String)\n    ls_re = r\"^\\$ ls$\"\n    m = match(ls_re, line)\n    isnothing(m) ? nothing : LS()\nend\n\nfunction Base.parse(::Type{FILE}, line::String)\n    file_re = r\"^(\\d+) (\\w+)(\\.\\w+)?$\"\n    m = match(file_re, line)\n    isnothing(m) ? nothing : FILE(parse(Int, m[1]), m[2], m[3])\nend\n\nfunction Base.parse(::Type{DIR}, line::String)\n    dir_re = r\"^dir (\\w+)$\"\n    m = match(dir_re, line)\n    isnothing(m) ? nothing : DIR(m[1])\nend\n\nfunction Base.parse(::Type{Console}, line::String)\n    types = [CD, CDUP, LS, FILE, DIR]\n    for t in types\n        r = parse(t, line)\n        !isnothing(r) && return r\n    end\n    nothing\nend \n\nmutable struct FileTree\n    name::String\n    contents::Dict{String,Union{FILE,FileTree}}\n    size::Int\nend\n\nfunction build_tree(input::Vector{Console})\n    root = FileTree(\"/\", Dict(), 0)\n    cwd = root\n    path = [root]\n    for entry in input\n        if entry isa CD\n            @assert (entry.dir in keys(cwd.contents)) \"dir $(entry.dir) not found in $(keys(cwd.contents))\"\n            @assert (cwd.contents[entry.dir] isa FileTree) \"dir $(entry.dir) seems to be a file $(cwd.contents[entry.dir])\"\n            push!(path, cwd)\n            cwd = cwd.contents[entry.dir]\n        elseif entry isa CDUP\n            path[end].size += cwd.size\n            cwd = pop!(path)\n        elseif entry isa LS\n            # do nothing\n        elseif entry isa FILE\n            cwd.contents[filename(entry)] = entry\n            cwd.size += entry.size\n        elseif entry isa DIR\n            cwd.contents[entry.name] = FileTree(entry.name, Dict(), 0)\n        end\n    end\n    root\nend\n\nfunction flatten(t::FileTree)\n    subdirs::Vector{FileTree} = filter(v -> v isa FileTree, collect(values(t.contents)))\n    subsubdirs::Vector{FileTree} = vcat(map(flatten, subdirs)...)\n    [subdirs; subsubdirs]\nend\n\nfunction read_input(io::IO)\n    filter(!isnothing, readlines(io) .|> l -> parse(Console, l))\nend\n\nfunction main(io::IO)\n    input::Vector{Console} = read_input(io)\n    tree = build_tree(input)\n    flat = flatten(tree)\n    part1 = sum(d.size for d in flat if d.size <= 100000)\n    println(\"Part 1: $part1\")\n\n    space_free = 70000000 - tree.size\n    need_to_free = 30000000 - space_free\n    (part2, _) = findmin(d->d.size, filter(d -> d.size >= need_to_free, flat))\n    println(\"Part 2: $part2\")\nend\n\nend  # module","category":"page"},{"location":"day07/","page":"Day 07: No Space Left On Device","title":"Day 07: No Space Left On Device","text":"using AOC2022  # hide\n@day 7","category":"page"},{"location":"day02/#Day-02:-Rock-Paper-Scissors","page":"Day 02: Rock Paper Scissors","title":"Day 02: Rock Paper Scissors","text":"","category":"section"},{"location":"day02/","page":"Day 02: Rock Paper Scissors","title":"Day 02: Rock Paper Scissors","text":"I had a longer solution in Julia, but then I started thinking about tricks in modular arithmetic, and came up with this:","category":"page"},{"location":"day02/#Julia","page":"Day 02: Rock Paper Scissors","title":"Julia","text":"","category":"section"},{"location":"day02/","page":"Day 02: Rock Paper Scissors","title":"Day 02: Rock Paper Scissors","text":"<div class=\"noweb-label\">file:<i>src/day02.jl</i></div>","category":"page"},{"location":"day02/","page":"Day 02: Rock Paper Scissors","title":"Day 02: Rock Paper Scissors","text":"module Day02\n\nread_input(io::IO) = [(line[1]-'A', line[3]-'X') for line in readlines(io)]\nscore_1((a, b)::Tuple{Int,Int}) = mod(b - a + 1, 3) * 3 + b + 1\nscore_2((a, b)::Tuple{Int,Int}) = b * 3 + mod(a + b - 1, 3) + 1\n\nfunction main(io::IO)\n    input = read_input(io)\n    println(\"Part 1: $(sum(score_1.(input)))\")\n    println(\"Part 2: $(sum(score_2.(input)))\")\nend\n\nend","category":"page"},{"location":"day02/","page":"Day 02: Rock Paper Scissors","title":"Day 02: Rock Paper Scissors","text":"using AOC2022  # hide\n@day 2","category":"page"},{"location":"day02/","page":"Day 02: Rock Paper Scissors","title":"Day 02: Rock Paper Scissors","text":"Everything will be explained for the rustic version.","category":"page"},{"location":"day02/#Rust","page":"Day 02: Rock Paper Scissors","title":"Rust","text":"","category":"section"},{"location":"day02/","page":"Day 02: Rock Paper Scissors","title":"Day 02: Rock Paper Scissors","text":"For the rustic solution, I did away with any enums and just used u8. I figured out that we can use some modular arithmetic to find the desired choice for rock, paper or scissors. The following equations should all be read modulo 3. ","category":"page"},{"location":"day02/","page":"Day 02: Rock Paper Scissors","title":"Day 02: Rock Paper Scissors","text":"R/P/S value\nRock 0\nPaper 1\nScissors 2","category":"page"},{"location":"day02/","page":"Day 02: Rock Paper Scissors","title":"Day 02: Rock Paper Scissors","text":"Let's call the two choices a and b, then a wins if a = (b + 1), since paper beats rock, scissors beats papers and rock beats scissors.","category":"page"},{"location":"day02/","page":"Day 02: Rock Paper Scissors","title":"Day 02: Rock Paper Scissors","text":"We can also compute the score using modular arithmetic. Look at (b - a + 1); this will say 0 if a won, 1 if it's a draw, and 2 if b won. Since I'm computing on unsigned values I need to make sure that all values remain positive (you can add multiples of 3 for free), so this becomes (4 + b - a):","category":"page"},{"location":"day02/","page":"Day 02: Rock Paper Scissors","title":"Day 02: Rock Paper Scissors","text":"<div class=\"noweb-label\">⪡day02-compute-scores⪢≣</div>","category":"page"},{"location":"day02/","page":"Day 02: Rock Paper Scissors","title":"Day 02: Rock Paper Scissors","text":"fn score_part_1((a, b): (u8,u8)) -> u32\n    { ((4+b-a)%3 * 3 + b + 1) as u32 }","category":"page"},{"location":"day02/","page":"Day 02: Rock Paper Scissors","title":"Day 02: Rock Paper Scissors","text":"For the second part, we may say b to (a + b + 2). We can see this as follows: if we need to win, we need to be exactly b = (a+1), if we need to draw b = a = (a+0), and to lose b = (a-1) = (a+2). So we have:","category":"page"},{"location":"day02/","page":"Day 02: Rock Paper Scissors","title":"Day 02: Rock Paper Scissors","text":"code win lose or draw value\n0 lose a + 2\n1 draw a + 0\n2 win a + 1","category":"page"},{"location":"day02/","page":"Day 02: Rock Paper Scissors","title":"Day 02: Rock Paper Scissors","text":"If we substitute that into our previous formula for the score, the (4 + b - a) simplifies to simply b.","category":"page"},{"location":"day02/","page":"Day 02: Rock Paper Scissors","title":"Day 02: Rock Paper Scissors","text":"<div class=\"noweb-label\">⪡day02-compute-scores⪢⊞</div>","category":"page"},{"location":"day02/","page":"Day 02: Rock Paper Scissors","title":"Day 02: Rock Paper Scissors","text":"fn score_part_2((a, b): (u8,u8)) -> u32\n    { (b*3 + (a+b+2)%3 + 1) as u32 }","category":"page"},{"location":"day02/","page":"Day 02: Rock Paper Scissors","title":"Day 02: Rock Paper Scissors","text":"The rest is boiler-plate.","category":"page"},{"location":"day02/","page":"Day 02: Rock Paper Scissors","title":"Day 02: Rock Paper Scissors","text":"<div class=\"noweb-label\">file:<i>src/day02.rs</i></div>","category":"page"},{"location":"day02/","page":"Day 02: Rock Paper Scissors","title":"Day 02: Rock Paper Scissors","text":"mod aoc;\n\nuse crate::aoc::{Result,Error,input_error};\nuse std::io;\n\nfn read_input() -> Result<Vec<(u8, u8)>> {\n    let mut result = Vec::new();\n    for line in io::stdin().lines() {\n        let l = line.map_err(input_error)?;\n        if l.len() != 3 { return Err(Error::Input(\"unexpected input\".to_string())); }\n        result.push((l.as_bytes()[0] - b'A', l.as_bytes()[2] - b'X'));\n    }\n    Ok(result)\n}\n\n<<day02-compute-scores>>\n\nfn main() -> Result<()> {\n    let input = read_input()?;\n    println!(\"Part 1: {}\", input.iter().copied().map(score_part_1).sum::<u32>());\n    println!(\"Part 2: {}\", input.iter().copied().map(score_part_2).sum::<u32>());\n    Ok(())\n}","category":"page"},{"location":"day05/#Day-05:-Supply-Stacks","page":"Day 05: Supply Stacks","title":"Day 05: Supply Stacks","text":"","category":"section"},{"location":"day05/","page":"Day 05: Supply Stacks","title":"Day 05: Supply Stacks","text":"We need to move crates from a start configuration. I store the data (stack and instructions) in a struct.","category":"page"},{"location":"day05/","page":"Day 05: Supply Stacks","title":"Day 05: Supply Stacks","text":"<div class=\"noweb-label\">⪡supply-stacks⪢≣</div>","category":"page"},{"location":"day05/","page":"Day 05: Supply Stacks","title":"Day 05: Supply Stacks","text":"const Crates = Vector{Vector{Char}}\n\nstruct Move\n    amount::Int\n    from::Int\n    to::Int\nend\n\nmutable struct State\n    crates::Crates\n    instructions::Vector{Move}\nend","category":"page"},{"location":"day05/","page":"Day 05: Supply Stacks","title":"Day 05: Supply Stacks","text":"The CrateMover-9000 uses a one-by-one stack operation to move crates.","category":"page"},{"location":"day05/","page":"Day 05: Supply Stacks","title":"Day 05: Supply Stacks","text":"<div class=\"noweb-label\">⪡crate-mover⪢≣</div>","category":"page"},{"location":"day05/","page":"Day 05: Supply Stacks","title":"Day 05: Supply Stacks","text":"crate_mover_9000(crates::Crates) = function (m::Move)\n    for _ in 1:m.amount\n        x = pop!(crates[m.from])\n        push!(crates[m.to], x)\n    end\nend","category":"page"},{"location":"day05/","page":"Day 05: Supply Stacks","title":"Day 05: Supply Stacks","text":"Here I've hand-curried the crate_mover_9000 function, to make it easier to work with the foreach function:","category":"page"},{"location":"day05/","page":"Day 05: Supply Stacks","title":"Day 05: Supply Stacks","text":"<div class=\"noweb-label\">⪡crate-mover⪢⊞</div>","category":"page"},{"location":"day05/","page":"Day 05: Supply Stacks","title":"Day 05: Supply Stacks","text":"function run(crane::Function, st::State)\n    foreach(crane(st.crates), st.instructions)\n    st\nend","category":"page"},{"location":"day05/","page":"Day 05: Supply Stacks","title":"Day 05: Supply Stacks","text":"For the CrateMover-9001 we can use array slicing to do what we want.","category":"page"},{"location":"day05/","page":"Day 05: Supply Stacks","title":"Day 05: Supply Stacks","text":"<div class=\"noweb-label\">⪡crate-mover⪢⊞</div>","category":"page"},{"location":"day05/","page":"Day 05: Supply Stacks","title":"Day 05: Supply Stacks","text":"crate_mover_9001(crates::Crates) = function (m::Move)\n    x = crates[m.from][end-m.amount+1:end]\n    crates[m.from] = crates[m.from][1:end-m.amount]\n    append!(crates[m.to], x)\nend","category":"page"},{"location":"day05/","page":"Day 05: Supply Stacks","title":"Day 05: Supply Stacks","text":"using AOC2022.Day05: read_input, run, crate_mover_9000, crate_mover_9001, Crates\nusing AOC2022.Day05Figure: plot\nusing CairoMakie\n\nCairoMakie.activate!(type = \"svg\")\ndata = open(read_input, \"../../data/day05.txt\", \"r\")\n\npart1 = run(crate_mover_9000, deepcopy(data))\npart2 = run(crate_mover_9001, deepcopy(data))\n\nwith_theme(theme_black()) do\n    fig = Figure(fonts=(; regular=\"serif\"))\n    ax_args = Dict(\n        :limits => (0.2, 9.8, -0.3, 27.3),\n        :aspect => DataAspect(),\n        :xtickalign => 1,\n        :ytickalign => 1,\n        # :xticksmirrored => true,\n        # :yticksmirrored => true,\n        :xticks => 1:9,\n        :yticks => 0:5:25,\n        :titlefont => :regular)\n    plot(data.crates, fig=fig, ax=Axis(fig[1,1]; title=\"input\", ax_args...))\n    plot(part1.crates, fig=fig, ax=Axis(fig[1,2]; title=\"CrateMover9000\", ax_args...))\n    plot(part2.crates, fig=fig, ax=Axis(fig[1,3]; title=\"CrateMover9001\", ax_args...))\n    save(\"day05-result.svg\", fig)\nend","category":"page"},{"location":"day05/","page":"Day 05: Supply Stacks","title":"Day 05: Supply Stacks","text":"(Image: Stack after Part 2)","category":"page"},{"location":"day05/","page":"Day 05: Supply Stacks","title":"Day 05: Supply Stacks","text":"<div class=\"noweb-label\">file:<i>src/day05.jl</i></div>","category":"page"},{"location":"day05/","page":"Day 05: Supply Stacks","title":"Day 05: Supply Stacks","text":"module Day05\n\n<<supply-stacks>>\n<<crate-mover>>\n<<day05-read-input>>\n\nfunction main(io::IO)\n    input = read_input(io)\n    part1 = run(crate_mover_9000, deepcopy(input))\n    println(\"Part 1: $(last.(part1.crates) |> String)\")\n    part2 = run(crate_mover_9001, deepcopy(input))\n    println(\"Part 2: $(last.(part2.crates) |> String)\")\nend\n\nend  # module","category":"page"},{"location":"day05/","page":"Day 05: Supply Stacks","title":"Day 05: Supply Stacks","text":"using AOC2022  # hide\n@day 5","category":"page"},{"location":"day05/","page":"Day 05: Supply Stacks","title":"Day 05: Supply Stacks","text":"On Reddit u/i_have_no_biscuits constructed an additional input with a hidden message:","category":"page"},{"location":"day05/","page":"Day 05: Supply Stacks","title":"Day 05: Supply Stacks","text":"open(AOC2022.Day05.main, \"../../data/day05-msg.txt\", \"r\")","category":"page"},{"location":"day05/#Reading-input","page":"Day 05: Supply Stacks","title":"Reading input","text":"","category":"section"},{"location":"day05/","page":"Day 05: Supply Stacks","title":"Day 05: Supply Stacks","text":"<div class=\"noweb-label\">⪡day05-read-input⪢≣</div>","category":"page"},{"location":"day05/","page":"Day 05: Supply Stacks","title":"Day 05: Supply Stacks","text":"function Base.parse(::Type{Move}, line)\n    r = r\"move (\\d+) from (\\d+) to (\\d+)\"\n    m = match(r, line)\n    isnothing(m) ? nothing : Move(parse.(Int, m)...)\nend\n\nfunction read_input(io::IO)\n    lines = collect(readlines(io))\n    crates = [[] for _ in 1:9]\n    for l in lines\n        if !contains(l, r\"\\[[A-Z]\\]\")\n            break\n        end\n        for j in 1:9\n            c = l[(j-1)*4+2]\n            if c != ' '\n                pushfirst!(crates[j], c)\n            end\n        end\n    end\n\n    instructions = filter(!isnothing, lines .|> l->parse(Move, l))\n    State(crates, instructions)\nend","category":"page"},{"location":"day05/#Plotting-code","page":"Day 05: Supply Stacks","title":"Plotting code","text":"","category":"section"},{"location":"day05/","page":"Day 05: Supply Stacks","title":"Day 05: Supply Stacks","text":"<div class=\"noweb-label\">file:<i>src/day05-figure.jl</i></div>","category":"page"},{"location":"day05/","page":"Day 05: Supply Stacks","title":"Day 05: Supply Stacks","text":"module Day05Figure\n\nexport plot\n\nusing Makie\nusing Makie.GeometryBasics\n\ninclude(\"day05.jl\")\nusing .Day05: Crates\n\nunzip(lst) = (getindex.(lst,1), getindex.(lst,2))\n\ncrates_to_rects(crates::Crates) =\n    unzip([(Rect(i-0.45, j-0.95, 0.9, 0.9), k - 'A')\n           for i in 1:9\n           for (j, k) in enumerate(crates[i])])\n\nplot(crates::Crates; fig=nothing, ax=nothing) = begin\n    if ax === nothing\n        fig = Figure()\n        ax = Axis(fig[1,1]; aspect=DataAspect(), \n            xticksmirrored = true, yticksmirrored = true,\n            xticks=1:9, yticks=0:5:25)\n    end\n    crates |> crates_to_rects |>\n        r -> poly!(ax, r[1], color = r[2], colormap = :roma)\n    for i in 1:9\n        for (j, k) in enumerate(crates[i])\n            text!(ax, i, j-0.5, text=\"$k\", align=(:center,:center), color=:black)\n        end\n    end\n    fig\nend\n\nend  # module","category":"page"},{"location":"day04/#Day-04:-Camp-Cleanup","page":"Day 04: Camp Cleanup","title":"Day 04: Camp Cleanup","text":"","category":"section"},{"location":"day04/","page":"Day 04: Camp Cleanup","title":"Day 04: Camp Cleanup","text":"Overlappin ranges. In the first problem we need to see if two ranges completely overlap. I couldn't think of a faster way than to check that either A contains B or B contains A. This is a stronger bound than what we have in the second part. To check for overlap we can compare the maximum of start values with the minimum of stop values.","category":"page"},{"location":"day04/","page":"Day 04: Camp Cleanup","title":"Day 04: Camp Cleanup","text":"<div class=\"noweb-label\">file:<i>src/day04.jl</i></div>","category":"page"},{"location":"day04/","page":"Day 04: Camp Cleanup","title":"Day 04: Camp Cleanup","text":"module Day04\n\ncontains(a::UnitRange{Int}, b::UnitRange{Int}) =\n    a.start >= b.start && a.stop <= b.stop\n\noverlap(a::UnitRange{Int}, b::UnitRange{Int}) =\n    max(a.start, b.start) <= min(a.stop, b.stop)\n\nfunction read_input(io::IO)\n    fmt = r\"(\\d+)-(\\d+),(\\d+)-(\\d+)\"\n    range_pair(a, b, c, d) = (a:b,c:d)\n    to_range_pair(l) = range_pair((parse(Int, x) for x in match(fmt, l))...)\n    readlines(io) .|> to_range_pair\nend\n\nfunction main(io::IO)\n    input = read_input(io)\n    part1 = length(filter(((a, b),)->contains(a,b)||contains(b,a), input))\n    println(\"Part 1: $part1\")\n    part2 = length(filter(x->overlap(x...), input))\n    println(\"Part 2: $part2\")\nend\n\nend  # module","category":"page"},{"location":"day04/","page":"Day 04: Camp Cleanup","title":"Day 04: Camp Cleanup","text":"using AOC2022  # hide\n@day 4","category":"page"},{"location":"day04/","page":"Day 04: Camp Cleanup","title":"Day 04: Camp Cleanup","text":"Going to make a nice plot of my input","category":"page"},{"location":"day04/","page":"Day 04: Camp Cleanup","title":"Day 04: Camp Cleanup","text":"using AOC2022.Day04: read_input\nusing DataFrames\nusing CairoMakie\n\ndata = open(read_input, \"../../data/day04.txt\", \"r\")\nto_row((a, b)) = (a0=a.start, a1=a.stop, b0=b.start, b1=b.stop)\ndf = data .|> to_row |> DataFrame\n\nwith_theme(theme_dark()) do\n    CairoMakie.activate!(type = \"svg\")\n    fig = Figure()\n    ax = Axis(fig[1, 1])\n    x = 1:size(df)[1]\n\n    rangebars!(ax, 1:100, df.a0[1:100], df.a1[1:100], color=\"#cc444488\", linewidth = 5)\n    rangebars!(ax, 1:100, df.b0[1:100], df.b1[1:100], color=\"#4444cc88\", linewidth = 5)\n\n    save(\"day04.svg\", fig)\nend\nnothing  # hide","category":"page"},{"location":"day04/","page":"Day 04: Camp Cleanup","title":"Day 04: Camp Cleanup","text":"(Image: Day 4 viz)","category":"page"},{"location":"#Advent-of-Code-2022","page":"Advent of Code 2022","title":"Advent of Code 2022","text":"","category":"section"},{"location":"","page":"Advent of Code 2022","title":"Advent of Code 2022","text":"(Image: Entangled badge) (Image: Documentation)","category":"page"},{"location":"","page":"Advent of Code 2022","title":"Advent of Code 2022","text":"These are my solutions to Advent of Code 2022.","category":"page"},{"location":"#Literate-programming","page":"Advent of Code 2022","title":"Literate programming","text":"","category":"section"},{"location":"","page":"Advent of Code 2022","title":"Advent of Code 2022","text":"I use a system of literate programming called Entangled. Many of the code blocks you see in this document end up in the actual source code for the modules that I use in the examples. These code blocks are marked with either a filename or a noweb reference. The blocks marked with a noweb reference can be included elsewhere using the <<...>> syntax.","category":"page"},{"location":"#Running-Julia-solutions","page":"Advent of Code 2022","title":"Running Julia solutions","text":"","category":"section"},{"location":"","page":"Advent of Code 2022","title":"Advent of Code 2022","text":"To accommodate easy running of Julia code, I wrote an overarching module. This includes the Julia code for all days, each day in its own module. To run the code for a single day, there is the @day macro. So","category":"page"},{"location":"","page":"Advent of Code 2022","title":"Advent of Code 2022","text":"using AOC2022\n@day 1","category":"page"},{"location":"","page":"Advent of Code 2022","title":"Advent of Code 2022","text":"<div class=\"noweb-label\">file:<i>src/AOC2022.jl</i></div>","category":"page"},{"location":"","page":"Advent of Code 2022","title":"Advent of Code 2022","text":"module AOC2022\n\nusing Printf\n\n# Introduced on day 6\ninclude(\"CircularBuffers.jl\")\nusing .CircularBuffers\n\nexport @day\n\nadvent = filter(f -> occursin(r\"day.*\\.jl\", f), readdir(@__DIR__))\n\nfor day in advent\n    include(day)\nend\n\nmacro day(n::Int)\n    modname = Symbol(@sprintf \"Day%02u\" n)\n    input_file = joinpath(@__DIR__, @sprintf \"../data/day%02u.txt\" n)\n    :(open($modname.main, $input_file, \"r\"))\nend\n\nend","category":"page"},{"location":"day03/#Day-03:-Rucksack-Reorganization","page":"Day 03: Rucksack Reorganization","title":"Day 03: Rucksack Reorganization","text":"","category":"section"},{"location":"day03/","page":"Day 03: Rucksack Reorganization","title":"Day 03: Rucksack Reorganization","text":"Here Julia is being very nice, by allowing me to do set-operation on strings. I was for a moment confused by the column major ordering of Julia's arrays. So in Python the line for part 2, would be something like:","category":"page"},{"location":"day03/","page":"Day 03: Rucksack Reorganization","title":"Day 03: Rucksack Reorganization","text":"for row in input.reshape([-1, 3]):\n    ... # find union of string characters","category":"page"},{"location":"day03/","page":"Day 03: Rucksack Reorganization","title":"Day 03: Rucksack Reorganization","text":"In Julia we have:","category":"page"},{"location":"day03/","page":"Day 03: Rucksack Reorganization","title":"Day 03: Rucksack Reorganization","text":"for col in eachcol(reshape(input, 3, :))\n    ... # do our thing\nend","category":"page"},{"location":"day03/","page":"Day 03: Rucksack Reorganization","title":"Day 03: Rucksack Reorganization","text":"That just takes a bit getting used to I guess.","category":"page"},{"location":"day03/","page":"Day 03: Rucksack Reorganization","title":"Day 03: Rucksack Reorganization","text":"<div class=\"noweb-label\">file:<i>src/day03.jl</i></div>","category":"page"},{"location":"day03/","page":"Day 03: Rucksack Reorganization","title":"Day 03: Rucksack Reorganization","text":"module Day03\n\nsplit_half(s) = begin\n    l = length(s) ÷ 2\n    (s[1:l], s[l+1:end])\nend\n\npriority(c::Char) = islowercase(c) ? c - 'a' + 1 : c - 'A' + 27\n\nfunction main(io::IO)\n    input = readlines(io)\n    part1 = input .|> split_half .|> ((a,b),) -> (a ∩ b)[1] .|> priority\n    println(\"Part 1: $(sum(part1))\")\n    part2 = eachcol(reshape(input, 3, :)) .|> a -> reduce(∩, a)[1] .|> priority\n    println(\"Part 2: $(sum(part2))\")\nend\n\nend  # module","category":"page"},{"location":"day03/","page":"Day 03: Rucksack Reorganization","title":"Day 03: Rucksack Reorganization","text":"using AOC2022  # hide\n@day 3","category":"page"}]
}
