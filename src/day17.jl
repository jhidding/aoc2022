# ~\~ language=Julia filename=src/day17.jl
# ~\~ begin <<docs/src/day17.md|src/day17.jl>>[init]
module Day17

# Rotated a quarter turn
const blocks::Vector{Matrix{Int}} = [
    [ 1 1 1 1 ]',

    [ 0 1 0;
      1 1 1;
      0 1 0 ],

    [ 1 0 0;
      1 0 0;
      1 1 1 ],

    [ 1 1 1 1 ],

    [ 1 1;
      1 1 ] ]

read_input(inp::IO) =
    collect(readlines(inp)[1]) .|> c -> c == '<' ? -1 : 1

mutable struct State
    cave::Matrix{Int}
    jets::Vector{Int}
    jet_pos::Int
    shape::Int
    pos::CartesianIndex
    height::Int
    count::Int
    clock::Int
end

function step_tetris(st::State)
    rangecheck(p::CartesianIndex) = let b = blocks[st.shape]
        checkbounds(Bool, st.cave, p:p+CartesianIndex(size(b).-1))
    end
    prospect(p::CartesianIndex) = let b = blocks[st.shape]
        st.cave[p:p+CartesianIndex(size(b).-1)]
    end
    b = blocks[st.shape]
    # push
    pos = st.pos + CartesianIndex((1, 0)) * st.jets[st.jet_pos]
    st.jet_pos = mod1(st.jet_pos + 1, length(st.jets))
    if rangecheck(pos) && !any(prospect(pos) .+ b .> 1)
        st.pos = pos
    end
    # move down
    pos = st.pos + CartesianIndex((0, -1))
    if !rangecheck(pos) || any(prospect(pos) .+ b .> 1)
        st.cave[st.pos:st.pos+CartesianIndex(size(b).-1)] += b
        st.height = max(st.height, st.pos[2] + size(b)[2] - 1)
        # new block
        st.shape = mod1(st.shape + 1, length(blocks))
        st.pos = CartesianIndex((3, st.height+4))
        st.count += 1
    else
        st.pos = pos
    end
    st.clock += 1
end

function run_tetris_n_stones(st::State, n::Int; echo::Bool=false)
    while st.count < n
        step_tetris(st)
        echo && println(st)
    end
    st
end

function run_tetris_n_cycles(st::State, n::Int)
    for _ in 1:n
        step_tetris(st)
    end
    st
end

function Base.print(io::IO, st::State)
    offset = max(1, st.height - 10)
    b = blocks[st.shape]
    top = copy(st.cave[:,offset:offset+17])
    p = st.pos - CartesianIndex((0, offset-1))
    top[p:p+CartesianIndex(size(b).-1)] .= 2 * b

    println(io, "count: $(st.count), height: $(st.height)")
    for line in Iterators.reverse(eachcol(top))
        println(io, "|", join(line .|> i -> ".#o"[i+1]), "|")
    end
end

function main(inp::IO, out::IO)
    jets = read_input(inp)
    init = State(zeros(Int, (7, 6000)), jets, 1, 1, CartesianIndex((3,4)), 0, 0, 0)
    result = run_tetris_n_stones(init, 2022)
    println(out, "Part 1: $(result.height)")

    q = length(jets) * 5
    println(out, "checking cycle length $q")
    st= State(zeros(Int, (7, q*10)), jets, 1, 1, CartesianIndex((3,4)), 0, 0, 0)
    st1 = deepcopy(run_tetris_n_cycles(st, q))
    st2 = deepcopy(run_tetris_n_cycles(st, q))
    n_stones = st2.count - st1.count
    h_inc = st2.height - st1.height
    h = st1.height + (10^12 ÷ n_stones - 1) * h_inc
    remain = mod((10^12 % n_stones) - st1.count, n_stones)
    st3 = run_tetris_n_stones(st, st.count + remain)  # (n_stones - (10^12 - st1.count) % n_stones))
    h += st3.height - st2.height
    println(out, st1)
    println(out, st2)
    println(out, st3)
    println(out, "Part 2: $h")
end

end  # module
# ~\~ end
