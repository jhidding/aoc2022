push!(LOAD_PATH,"../src/")

using Documenter, AOC2022

function noweb_label_pass(src, target_path)
    mkpath(joinpath(target_path, dirname(src)))
    script = joinpath(@__DIR__, "noweb_label_pass.awk")
    run(pipeline(src, `awk -f $script`, joinpath(target_path, basename(src))))
end

function is_markdown(path)
    splitext(path)[2] == ".md"
end

sources = filter(is_markdown, readdir(joinpath(@__DIR__, "src"), join=true))
path = mktempdir()
noweb_label_pass.(sources, path)

makedocs(source = path, sitename="Advent Of Code 2022 solutions")
deploydocs(
    repo = "github.com/jhidding/aoc2022.git"
)
