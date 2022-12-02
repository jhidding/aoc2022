var documenterSearchIndex = {"docs":
[{"location":"day01/#Day-01:-Calorie-Counting","page":"Day 01: Calorie Counting","title":"Day 01: Calorie Counting","text":"","category":"section"},{"location":"day01/","page":"Day 01: Calorie Counting","title":"Day 01: Calorie Counting","text":"Adding up numbers! I solved today's exercise in both Julia and Rust, as I'm still unsure in what language to do the rest. Julia gives beautiful clutter free code, Rust gives the nice guarantees of a decent type system. ","category":"page"},{"location":"day01/#Rust","page":"Day 01: Calorie Counting","title":"Rust","text":"","category":"section"},{"location":"day01/","page":"Day 01: Calorie Counting","title":"Day 01: Calorie Counting","text":"The first thing we need to do (in any Rust project) is to define an Error type, and a specialised Result. It is idiomatic to have specialised Result this way. A lot of functions in Rust return their own kind of Result, which we can map_err to ours. This way we can collect errors from different sources. For now, we just have input errors.","category":"page"},{"location":"day01/","page":"Day 01: Calorie Counting","title":"Day 01: Calorie Counting","text":"<div class=\"noweb-label\">file:<i>src/aoc.rs</i></div>","category":"page"},{"location":"day01/","page":"Day 01: Calorie Counting","title":"Day 01: Calorie Counting","text":"#[derive(Debug)]\npub enum Error {\n    Input(String)\n}\n\npub type Result<T> = core::result::Result<T, Error>;\n\npub fn input_error<T>(err:T) -> Error where T: core::fmt::Debug {\n    Error::Input(format!(\"{:?}\", err))\n}","category":"page"},{"location":"day01/","page":"Day 01: Calorie Counting","title":"Day 01: Calorie Counting","text":"Our input has lists of integers that are separated by an empty line. We store this in a Vec<Vec<u32>>.","category":"page"},{"location":"day01/","page":"Day 01: Calorie Counting","title":"Day 01: Calorie Counting","text":"<div class=\"noweb-label\">⪡read-lists-of-int⪢≣</div>","category":"page"},{"location":"day01/","page":"Day 01: Calorie Counting","title":"Day 01: Calorie Counting","text":"fn read_input() -> Result<Vec<Vec<u32>>> {\n    let mut v = Vec::<u32>::new();\n    let mut result = Vec::new();\n    for line in io::stdin().lines() {\n        let l = line.map_err(input_error)?;\n        if l.is_empty() {\n            result.push(v);\n            v = Vec::<u32>::new();\n        } else {\n            v.push(l.parse().map_err(input_error)?);\n        }\n    }\n    if !v.is_empty() {\n        result.push(v);\n    }\n    Ok(result)\n}","category":"page"},{"location":"day01/","page":"Day 01: Calorie Counting","title":"Day 01: Calorie Counting","text":"Note how smart Rust is here. When we call result.push(v) the vector v is moved into the result vector. After that the contents of v are no longer accessible through v. This is Ok though, since we immediately construct a new vector to continue with.","category":"page"},{"location":"day01/","page":"Day 01: Calorie Counting","title":"Day 01: Calorie Counting","text":"To compute the sums of each input vector, I find the syntax a bit wordy.","category":"page"},{"location":"day01/","page":"Day 01: Calorie Counting","title":"Day 01: Calorie Counting","text":"<div class=\"noweb-label\">file:<i>src/day01.rs</i></div>","category":"page"},{"location":"day01/","page":"Day 01: Calorie Counting","title":"Day 01: Calorie Counting","text":"mod aoc;\n\nuse crate::aoc::{Error,Result,input_error};\nuse std::io;\n\n<<read-lists-of-int>>\n\nfn main() -> Result<()> {\n    let input = read_input()?;\n    let mut sums: Vec<u32> = input.iter().map(|x| { x.iter().sum::<u32>() }).collect();\n\n    let part1 = sums.iter().max().ok_or(Error::Input(\"Empty input\".to_string()))?;\n    println!(\"Part 1: {}\", part1);\n\n    sums.sort();\n    let part2: u32 = sums[sums.len()-3..].iter().sum();\n    println!(\"Part 2: {}\", part2);\n    Ok(())\n}","category":"page"},{"location":"day01/#Julia","page":"Day 01: Calorie Counting","title":"Julia","text":"","category":"section"},{"location":"day01/","page":"Day 01: Calorie Counting","title":"Day 01: Calorie Counting","text":"In Julia I was able to write a bit more abstract code from the get-go. This should also be possible in Rust, but it was harder to think about all the traits. So we have a generic function for splitting an iterable into chunks:","category":"page"},{"location":"day01/","page":"Day 01: Calorie Counting","title":"Day 01: Calorie Counting","text":"<div class=\"noweb-label\">⪡function-split-on⪢≣</div>","category":"page"},{"location":"day01/","page":"Day 01: Calorie Counting","title":"Day 01: Calorie Counting","text":"function split_on(lst, sep)\n    Channel() do channel\n        v = []\n        for item in lst\n            if item == sep\n                put!(channel, v)\n                v = []\n            else\n                push!(v, item)\n            end\n        end\n        if !isempty(v)\n            put!(channel, v)\n        end\n    end\nend","category":"page"},{"location":"day01/","page":"Day 01: Calorie Counting","title":"Day 01: Calorie Counting","text":"Then the rest of the program follows.","category":"page"},{"location":"day01/","page":"Day 01: Calorie Counting","title":"Day 01: Calorie Counting","text":"<div class=\"noweb-label\">file:<i>src/day01.jl</i></div>","category":"page"},{"location":"day01/","page":"Day 01: Calorie Counting","title":"Day 01: Calorie Counting","text":"module Day01\n\nexport main\n\n<<function-split-on>>\n\nfunction read_input(io::IO=stdin)\n    map(sub -> parse.(Int, sub), split_on(readlines(io), \"\"))\nend\n\nfunction main(io::IO=stdin)\n    input = read_input(io)\n    part1 = maximum(sum.(input))\n    println(\"Part 1: $part1\")\n    part2 = sum(sort(sum.(input))[end-3:end])\n    println(\"Part 2: $part2\")\nend\n\nend  # module","category":"page"},{"location":"day01/","page":"Day 01: Calorie Counting","title":"Day 01: Calorie Counting","text":"using AOC2022  # hide\n@day 01","category":"page"},{"location":"day02/#Day-02:-Rock-Paper-Scissors","page":"Day 02: Rock Paper Scissors","title":"Day 02: Rock Paper Scissors","text":"","category":"section"},{"location":"day02/","page":"Day 02: Rock Paper Scissors","title":"Day 02: Rock Paper Scissors","text":"<div class=\"noweb-label\">file:<i>src/day02.jl</i></div>","category":"page"},{"location":"day02/","page":"Day 02: Rock Paper Scissors","title":"Day 02: Rock Paper Scissors","text":"module Day02\n\n@enum RPS Rock=1 Paper=2 Scissors=3\n\nconst win_table = Dict(Rock => Paper, Paper => Scissors, Scissors => Rock)\ninvert(table) = Dict(b => a for (a, b) in table)\nconst lose_table = invert(win_table)\n\nto_win_against(a::RPS) = win_table[a]\nto_lose_against(a::RPS) = lose_table[a]\nto_draw_against(a::RPS) = a\n\nBase.:>(a::RPS, b::RPS) = a == to_win_against(b)\nscore(a::RPS, b::RPS) = Int(b) + (a > b ? 0 : (b > a ? 6 : 3))\nscore(game::Vector{Tuple{RPS,RPS}}) = sum(map(round->score(round...), game))\n\nread_input(io::IO) = [(line[1], line[3]) for line in readlines(io)]\n\nfunction main(io::IO)\n    input = read_input(io)\n    abc = Dict('A' => Rock, 'B' => Paper, 'C' => Scissors)\n    xyz1 = Dict('X' => Rock, 'Y' => Paper, 'Z' => Scissors)\n    game1 = [(abc[a], xyz1[b]) for (a,b) in input]\n    println(\"Part 1: $(score(game1))\")\n\n    xyz2 = Dict('X' => to_lose_against, 'Y' => to_draw_against, 'Z' => to_win_against)\n    game2 = [(abc[a], xyz2[b](abc[a])) for (a,b) in input]\n    score2 = sum(map(round->score(round...), game2))\n    println(\"Part 2: $(score(game2))\")\nend\n\nend","category":"page"},{"location":"day02/","page":"Day 02: Rock Paper Scissors","title":"Day 02: Rock Paper Scissors","text":"using AOC2022  # hide\n@day 2","category":"page"},{"location":"#Advent-of-Code-2022","page":"Advent of Code 2022","title":"Advent of Code 2022","text":"","category":"section"},{"location":"","page":"Advent of Code 2022","title":"Advent of Code 2022","text":"(Image: Entangled badge) (Image: Documentation)","category":"page"},{"location":"","page":"Advent of Code 2022","title":"Advent of Code 2022","text":"These are my solutions to Advent of Code 2022.","category":"page"},{"location":"#Literate-programming","page":"Advent of Code 2022","title":"Literate programming","text":"","category":"section"},{"location":"","page":"Advent of Code 2022","title":"Advent of Code 2022","text":"I use a system of literate programming called Entangled. Many of the code blocks you see in this document end up in the actual source code for the modules that I use in the examples. These code blocks are marked with either a filename or a noweb reference. The blocks marked with a noweb reference can be included elsewhere using the <<...>> syntax.","category":"page"},{"location":"#Running-Julia-solutions","page":"Advent of Code 2022","title":"Running Julia solutions","text":"","category":"section"},{"location":"","page":"Advent of Code 2022","title":"Advent of Code 2022","text":"To accommodate easy running of Julia code, I wrote an overarching module. This includes the Julia code for all days, each day in its own module. To run the code for a single day, there is the @day macro. So","category":"page"},{"location":"","page":"Advent of Code 2022","title":"Advent of Code 2022","text":"using AOC2022\n@day 1","category":"page"},{"location":"","page":"Advent of Code 2022","title":"Advent of Code 2022","text":"<div class=\"noweb-label\">file:<i>src/AOC2022.jl</i></div>","category":"page"},{"location":"","page":"Advent of Code 2022","title":"Advent of Code 2022","text":"module AOC2022\n\nusing Printf\nexport @day\n\nadvent = filter(f -> occursin(r\"day[0-9]{2}.jl\", f), readdir(@__DIR__))\n\nfor day in advent\n    include(day)\nend\n\nmacro day(n::Int)\n    modname = Symbol(@sprintf \"Day%02u\" n)\n    input_file = joinpath(@__DIR__, @sprintf \"../data/day%02u.txt\" n)\n    :(open($modname.main, $input_file, \"r\"))\nend\n\nend","category":"page"}]
}