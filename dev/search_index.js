var documenterSearchIndex = {"docs":
[{"location":"day01/#Day-01:-Calorie-Counting","page":"Day 01: Calorie Counting","title":"Day 01: Calorie Counting","text":"","category":"section"},{"location":"day01/","page":"Day 01: Calorie Counting","title":"Day 01: Calorie Counting","text":"Adding up numbers! I solved today's exercise in both Julia and Rust, as I'm still unsure in what language to do the rest. Julia gives beautiful clutter free code, Rust gives the nice guarantees of a decent type system. ","category":"page"},{"location":"day01/#Rust","page":"Day 01: Calorie Counting","title":"Rust","text":"","category":"section"},{"location":"day01/","page":"Day 01: Calorie Counting","title":"Day 01: Calorie Counting","text":"The first thing we need to do (in any Rust project) is to define an Error type, and a specialised Result. It is idiomatic to have specialised Result this way. A lot of functions in Rust return their own kind of Result, which we can map_err to ours. This way we can collect errors from different sources. For now, we just have input errors.","category":"page"},{"location":"day01/","page":"Day 01: Calorie Counting","title":"Day 01: Calorie Counting","text":"<div class=\"noweb-label\">file:<i>src/aoc.rs</i></div>","category":"page"},{"location":"day01/","page":"Day 01: Calorie Counting","title":"Day 01: Calorie Counting","text":"#[derive(Debug)]\npub enum Error {\n    Input(String)\n}\n\npub type Result<T> = core::result::Result<T, Error>;\n\npub fn input_error<T>(err:T) -> Error where T: core::fmt::Debug {\n    Error::Input(format!(\"{:?}\", err))\n}","category":"page"},{"location":"day01/","page":"Day 01: Calorie Counting","title":"Day 01: Calorie Counting","text":"Our input has lists of integers that are separated by an empty line. We store this in a Vec<Vec<u32>>.","category":"page"},{"location":"day01/","page":"Day 01: Calorie Counting","title":"Day 01: Calorie Counting","text":"<div class=\"noweb-label\">⪡read-lists-of-int⪢≣</div>","category":"page"},{"location":"day01/","page":"Day 01: Calorie Counting","title":"Day 01: Calorie Counting","text":"fn read_input() -> Result<Vec<Vec<u32>>> {\n    let mut v = Vec::<u32>::new();\n    let mut result = Vec::new();\n    for line in io::stdin().lines() {\n        let l = line.map_err(input_error)?;\n        if l.is_empty() {\n            result.push(v);\n            v = Vec::<u32>::new();\n        } else {\n            v.push(l.parse().map_err(input_error)?);\n        }\n    }\n    if !v.is_empty() {\n        result.push(v);\n    }\n    Ok(result)\n}","category":"page"},{"location":"day01/","page":"Day 01: Calorie Counting","title":"Day 01: Calorie Counting","text":"Note how smart Rust is here. When we call result.push(v) the vector v is moved into the result vector. After that the contents of v are no longer accessible through v. This is Ok though, since we immediately construct a new vector to continue with.","category":"page"},{"location":"day01/","page":"Day 01: Calorie Counting","title":"Day 01: Calorie Counting","text":"To compute the sums of each input vector, I find the syntax a bit wordy.","category":"page"},{"location":"day01/","page":"Day 01: Calorie Counting","title":"Day 01: Calorie Counting","text":"<div class=\"noweb-label\">file:<i>src/day01.rs</i></div>","category":"page"},{"location":"day01/","page":"Day 01: Calorie Counting","title":"Day 01: Calorie Counting","text":"mod aoc;\n\nuse crate::aoc::{Error,Result,input_error};\nuse std::io;\n\n<<read-lists-of-int>>\n\nfn main() -> Result<()> {\n    let input = read_input()?;\n    let mut sums: Vec<u32> = input.iter().map(|x| { x.iter().sum::<u32>() }).collect();\n\n    let part1 = sums.iter().max().ok_or(Error::Input(\"Empty input\".to_string()))?;\n    println!(\"Part 1: {}\", part1);\n\n    sums.sort();\n    let part2: u32 = sums[sums.len()-3..].iter().sum();\n    println!(\"Part 2: {}\", part2);\n    Ok(())\n}","category":"page"},{"location":"day01/#Julia","page":"Day 01: Calorie Counting","title":"Julia","text":"","category":"section"},{"location":"day01/","page":"Day 01: Calorie Counting","title":"Day 01: Calorie Counting","text":"In Julia I was able to write a bit more abstract code from the get-go. This should also be possible in Rust, but it was harder to think about all the traits. So we have a generic function for splitting an iterable into chunks:","category":"page"},{"location":"day01/","page":"Day 01: Calorie Counting","title":"Day 01: Calorie Counting","text":"<div class=\"noweb-label\">⪡function-split-on⪢≣</div>","category":"page"},{"location":"day01/","page":"Day 01: Calorie Counting","title":"Day 01: Calorie Counting","text":"function split_on(lst, sep)\n    Channel() do channel\n        v = []\n        for item in lst\n            if item == sep\n                put!(channel, v)\n                v = []\n            else\n                push!(v, item)\n            end\n        end\n        if !isempty(v)\n            put!(channel, v)\n        end\n    end\nend","category":"page"},{"location":"day01/","page":"Day 01: Calorie Counting","title":"Day 01: Calorie Counting","text":"Then the rest of the program follows.","category":"page"},{"location":"day01/","page":"Day 01: Calorie Counting","title":"Day 01: Calorie Counting","text":"<div class=\"noweb-label\">file:<i>src/day01.jl</i></div>","category":"page"},{"location":"day01/","page":"Day 01: Calorie Counting","title":"Day 01: Calorie Counting","text":"module Day01\n\nexport main\n\n<<function-split-on>>\n\nfunction read_input(io::IO=stdin)\n    map(sub -> parse.(Int, sub), split_on(readlines(io), \"\"))\nend\n\nfunction main(io::IO=stdin)\n    input = read_input(io)\n    part1 = maximum(sum.(input))\n    println(\"Part 1: $part1\")\n    part2 = sum(sort(sum.(input))[end-3:end])\n    println(\"Part 2: $part2\")\nend\n\nend  # module","category":"page"},{"location":"day01/","page":"Day 01: Calorie Counting","title":"Day 01: Calorie Counting","text":"using AOC2022  # hide\n@day 01","category":"page"},{"location":"day02/#Day-02:-Rock-Paper-Scissors","page":"Day 02: Rock Paper Scissors","title":"Day 02: Rock Paper Scissors","text":"","category":"section"},{"location":"day02/","page":"Day 02: Rock Paper Scissors","title":"Day 02: Rock Paper Scissors","text":"I had a longer solution in Julia, but then I started thinking about tricks in modular arithmetic, and came up with this:","category":"page"},{"location":"day02/#Julia","page":"Day 02: Rock Paper Scissors","title":"Julia","text":"","category":"section"},{"location":"day02/","page":"Day 02: Rock Paper Scissors","title":"Day 02: Rock Paper Scissors","text":"<div class=\"noweb-label\">file:<i>src/day02.jl</i></div>","category":"page"},{"location":"day02/","page":"Day 02: Rock Paper Scissors","title":"Day 02: Rock Paper Scissors","text":"module Day02\n\nread_input(io::IO) = [(line[1]-'A', line[3]-'X') for line in readlines(io)]\nscore_1((a, b)::Tuple{Int,Int}) = mod(b - a + 1, 3) * 3 + b + 1\nscore_2((a, b)::Tuple{Int,Int}) = b * 3 + mod(a + b - 1, 3) + 1\n\nfunction main(io::IO)\n    input = read_input(io)\n    println(\"Part 1: $(sum(score_1.(input)))\")\n    println(\"Part 2: $(sum(score_2.(input)))\")\nend\n\nend","category":"page"},{"location":"day02/","page":"Day 02: Rock Paper Scissors","title":"Day 02: Rock Paper Scissors","text":"using AOC2022  # hide\n@day 2","category":"page"},{"location":"day02/","page":"Day 02: Rock Paper Scissors","title":"Day 02: Rock Paper Scissors","text":"Everything will be explained for the rustic version.","category":"page"},{"location":"day02/#Rust","page":"Day 02: Rock Paper Scissors","title":"Rust","text":"","category":"section"},{"location":"day02/","page":"Day 02: Rock Paper Scissors","title":"Day 02: Rock Paper Scissors","text":"For the rustic solution, I did away with any enums and just used u8. I figured out that we can use some modular arithmetic to find the desired choice for rock, paper or scissors. The following equations should all be read modulo 3. ","category":"page"},{"location":"day02/","page":"Day 02: Rock Paper Scissors","title":"Day 02: Rock Paper Scissors","text":"R/P/S value\nRock 0\nPaper 1\nScissors 2","category":"page"},{"location":"day02/","page":"Day 02: Rock Paper Scissors","title":"Day 02: Rock Paper Scissors","text":"Let's call the two choices a and b, then a wins if a = (b + 1), since paper beats rock, scissors beats papers and rock beats scissors.","category":"page"},{"location":"day02/","page":"Day 02: Rock Paper Scissors","title":"Day 02: Rock Paper Scissors","text":"We can also compute the score using modular arithmetic. Look at (b - a + 1); this will say 0 if a won, 1 if it's a draw, and 2 if b won. Since I'm computing on unsigned values I need to make sure that all values remain positive (you can add multiples of 3 for free), so this becomes (4 + b - a):","category":"page"},{"location":"day02/","page":"Day 02: Rock Paper Scissors","title":"Day 02: Rock Paper Scissors","text":"<div class=\"noweb-label\">⪡day02-compute-scores⪢≣</div>","category":"page"},{"location":"day02/","page":"Day 02: Rock Paper Scissors","title":"Day 02: Rock Paper Scissors","text":"fn score_part_1((a, b): (u8,u8)) -> u32\n    { ((4+b-a)%3 * 3 + b + 1) as u32 }","category":"page"},{"location":"day02/","page":"Day 02: Rock Paper Scissors","title":"Day 02: Rock Paper Scissors","text":"For the second part, we may say b to (a + b + 2). We can see this as follows: if we need to win, we need to be exactly b = (a+1), if we need to draw b = a = (a+0), and to lose b = (a-1) = (a+2). So we have:","category":"page"},{"location":"day02/","page":"Day 02: Rock Paper Scissors","title":"Day 02: Rock Paper Scissors","text":"code win lose or draw value\n0 lose a + 2\n1 draw a + 0\n2 win a + 1","category":"page"},{"location":"day02/","page":"Day 02: Rock Paper Scissors","title":"Day 02: Rock Paper Scissors","text":"If we substitute that into our previous formula for the score, the (4 + b - a) simplifies to simply b.","category":"page"},{"location":"day02/","page":"Day 02: Rock Paper Scissors","title":"Day 02: Rock Paper Scissors","text":"<div class=\"noweb-label\">⪡day02-compute-scores⪢⊞</div>","category":"page"},{"location":"day02/","page":"Day 02: Rock Paper Scissors","title":"Day 02: Rock Paper Scissors","text":"fn score_part_2((a, b): (u8,u8)) -> u32\n    { (b*3 + (a+b+2)%3 + 1) as u32 }","category":"page"},{"location":"day02/","page":"Day 02: Rock Paper Scissors","title":"Day 02: Rock Paper Scissors","text":"The rest is boiler-plate.","category":"page"},{"location":"day02/","page":"Day 02: Rock Paper Scissors","title":"Day 02: Rock Paper Scissors","text":"<div class=\"noweb-label\">file:<i>src/day02.rs</i></div>","category":"page"},{"location":"day02/","page":"Day 02: Rock Paper Scissors","title":"Day 02: Rock Paper Scissors","text":"mod aoc;\n\nuse crate::aoc::{Result,Error,input_error};\nuse std::io;\n\nfn read_input() -> Result<Vec<(u8, u8)>> {\n    let mut result = Vec::new();\n    for line in io::stdin().lines() {\n        let l = line.map_err(input_error)?;\n        if l.len() != 3 { return Err(Error::Input(\"unexpected input\".to_string())); }\n        result.push((l.as_bytes()[0] - b'A', l.as_bytes()[2] - b'X'));\n    }\n    Ok(result)\n}\n\n<<day02-compute-scores>>\n\nfn main() -> Result<()> {\n    let input = read_input()?;\n    println!(\"Part 1: {}\", input.iter().copied().map(score_part_1).sum::<u32>());\n    println!(\"Part 2: {}\", input.iter().copied().map(score_part_2).sum::<u32>());\n    Ok(())\n}","category":"page"},{"location":"day05/#Day-05","page":"Day 05","title":"Day 05","text":"","category":"section"},{"location":"day05/","page":"Day 05","title":"Day 05","text":"<div class=\"noweb-label\">file:<i>src/day05.jl</i></div>","category":"page"},{"location":"day05/","page":"Day 05","title":"Day 05","text":"module Day05\n\nstruct Move\n    amount::Int\n    from::Int\n    to::Int\nend\n\nmutable struct State\n    piles::Vector{Vector{Char}}\n    instructions::Vector{Move}\nend\n\nfunction Base.parse(::Type{Move}, line)\n    r = r\"move (\\d+) from (\\d+) to (\\d+)\"\n    m = match(r, line)\n    if m === nothing\n        error(\"Parse error, not a Move: $line\")\n    end\n    Move(parse.(Int, m)...)\nend\n\nfunction read_input(io::IO)\n    lines = collect(readlines(io))\n    piles = [[] for _ in 1:9]\n    for i in 1:8\n        for j in 1:9\n            c = lines[i][(j-1)*4+2]\n            if c != ' '\n                push!(piles[j], c)\n            end\n        end\n    end\n\n    instructions = lines[11:end] .|> l->parse(Move, l)\n    State(piles, instructions)\nend\n\nfunction main(io::IO)\n    input = read_input(io)\n    println(input)\nend\n\nend  # module","category":"page"},{"location":"day04/#Day-04:-Camp-Cleanup","page":"Day 04: Camp Cleanup","title":"Day 04: Camp Cleanup","text":"","category":"section"},{"location":"day04/","page":"Day 04: Camp Cleanup","title":"Day 04: Camp Cleanup","text":"Overlappin ranges. In the first problem we need to see if two ranges completely overlap. I couldn't think of a faster way than to check that either A contains B or B contains A. This is a stronger bound than what we have in the second part. To check for overlap we can compare the maximum of start values with the minimum of stop values.","category":"page"},{"location":"day04/","page":"Day 04: Camp Cleanup","title":"Day 04: Camp Cleanup","text":"<div class=\"noweb-label\">file:<i>src/day04.jl</i></div>","category":"page"},{"location":"day04/","page":"Day 04: Camp Cleanup","title":"Day 04: Camp Cleanup","text":"module Day04\n\ncontains(a::UnitRange{Int}, b::UnitRange{Int}) =\n    a.start >= b.start && a.stop <= b.stop\n\noverlap(a::UnitRange{Int}, b::UnitRange{Int}) =\n    max(a.start, b.start) <= min(a.stop, b.stop)\n\nfunction read_input(io::IO)\n    fmt = r\"(\\d+)-(\\d+),(\\d+)-(\\d+)\"\n    range_pair(a, b, c, d) = (a:b,c:d)\n    to_range_pair(l) = range_pair((parse(Int, x) for x in match(fmt, l))...)\n    readlines(io) .|> to_range_pair\nend\n\nfunction main(io::IO)\n    input = read_input(io)\n    part1 = length(filter(((a, b),)->contains(a,b)||contains(b,a), input))\n    println(\"Part 1: $part1\")\n    part2 = length(filter(x->overlap(x...), input))\n    println(\"Part 2: $part2\")\nend\n\nend  # module","category":"page"},{"location":"day04/","page":"Day 04: Camp Cleanup","title":"Day 04: Camp Cleanup","text":"using AOC2022  # hide\n@day 4","category":"page"},{"location":"#Advent-of-Code-2022","page":"Advent of Code 2022","title":"Advent of Code 2022","text":"","category":"section"},{"location":"","page":"Advent of Code 2022","title":"Advent of Code 2022","text":"(Image: Entangled badge) (Image: Documentation)","category":"page"},{"location":"","page":"Advent of Code 2022","title":"Advent of Code 2022","text":"These are my solutions to Advent of Code 2022.","category":"page"},{"location":"#Literate-programming","page":"Advent of Code 2022","title":"Literate programming","text":"","category":"section"},{"location":"","page":"Advent of Code 2022","title":"Advent of Code 2022","text":"I use a system of literate programming called Entangled. Many of the code blocks you see in this document end up in the actual source code for the modules that I use in the examples. These code blocks are marked with either a filename or a noweb reference. The blocks marked with a noweb reference can be included elsewhere using the <<...>> syntax.","category":"page"},{"location":"#Running-Julia-solutions","page":"Advent of Code 2022","title":"Running Julia solutions","text":"","category":"section"},{"location":"","page":"Advent of Code 2022","title":"Advent of Code 2022","text":"To accommodate easy running of Julia code, I wrote an overarching module. This includes the Julia code for all days, each day in its own module. To run the code for a single day, there is the @day macro. So","category":"page"},{"location":"","page":"Advent of Code 2022","title":"Advent of Code 2022","text":"using AOC2022\n@day 1","category":"page"},{"location":"","page":"Advent of Code 2022","title":"Advent of Code 2022","text":"<div class=\"noweb-label\">file:<i>src/AOC2022.jl</i></div>","category":"page"},{"location":"","page":"Advent of Code 2022","title":"Advent of Code 2022","text":"module AOC2022\n\nusing Printf\nexport @day\n\nadvent = filter(f -> occursin(r\"day[0-9]{2}.jl\", f), readdir(@__DIR__))\n\nfor day in advent\n    include(day)\nend\n\nmacro day(n::Int)\n    modname = Symbol(@sprintf \"Day%02u\" n)\n    input_file = joinpath(@__DIR__, @sprintf \"../data/day%02u.txt\" n)\n    :(open($modname.main, $input_file, \"r\"))\nend\n\nend","category":"page"},{"location":"day03/#Day-03:-Rucksack-Reorganization","page":"Day 03: Rucksack Reorganization","title":"Day 03: Rucksack Reorganization","text":"","category":"section"},{"location":"day03/","page":"Day 03: Rucksack Reorganization","title":"Day 03: Rucksack Reorganization","text":"Here Julia is being very nice, by allowing me to do set-operation on strings. I was for a moment confused by the column major ordering of Julia's arrays. So in Python the line for part 2, would be something like:","category":"page"},{"location":"day03/","page":"Day 03: Rucksack Reorganization","title":"Day 03: Rucksack Reorganization","text":"for row in input.reshape([-1, 3]):\n    ... # find union of string characters","category":"page"},{"location":"day03/","page":"Day 03: Rucksack Reorganization","title":"Day 03: Rucksack Reorganization","text":"In Julia we have:","category":"page"},{"location":"day03/","page":"Day 03: Rucksack Reorganization","title":"Day 03: Rucksack Reorganization","text":"for col in eachcol(reshape(input, 3, :))\n    ... # do our thing\nend","category":"page"},{"location":"day03/","page":"Day 03: Rucksack Reorganization","title":"Day 03: Rucksack Reorganization","text":"That just takes a bit getting used to I guess.","category":"page"},{"location":"day03/","page":"Day 03: Rucksack Reorganization","title":"Day 03: Rucksack Reorganization","text":"<div class=\"noweb-label\">file:<i>src/day03.jl</i></div>","category":"page"},{"location":"day03/","page":"Day 03: Rucksack Reorganization","title":"Day 03: Rucksack Reorganization","text":"module Day03\n\nsplit_half(s) = begin\n    l = length(s) ÷ 2\n    (s[1:l], s[l+1:end])\nend\n\npriority(c::Char) = islowercase(c) ? c - 'a' + 1 : c - 'A' + 27\n\nfunction main(io::IO)\n    input = readlines(io)\n    part1 = input .|> split_half .|> ((a,b),) -> (a ∩ b)[1] .|> priority\n    println(\"Part 1: $(sum(part1))\")\n    part2 = eachcol(reshape(input, 3, :)) .|> a -> reduce(∩, a)[1] .|> priority\n    println(\"Part 2: $(sum(part2))\")\nend\n\nend  # module","category":"page"},{"location":"day03/","page":"Day 03: Rucksack Reorganization","title":"Day 03: Rucksack Reorganization","text":"using AOC2022  # hide\n@day 3","category":"page"}]
}
