# ~\~ language=Julia filename=test/runtests.jl
# ~\~ begin <<docs/src/day06.md|test/runtests.jl>>[init]
using Test, AOC2022.CircularBuffers

@testset "CircularBuffers" begin
    b = CircularBuffer{Int}(4)
    @test isempty(b)
    foreach(i->push!(b, i), 1:3)
    @test length(b) == 3
    @test sort(content(b)) == [1, 2, 3]
    foreach(i->push!(b, i), 1:3)
    @test 1 ∈ b && 2 ∈ b && 3 ∈ b
    @test 4 ∉ b
    @test length(b) == 4
    empty!(b)
    @test isempty(b)
    @test eltype(b) == Int
end
# ~\~ end
