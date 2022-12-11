days := $(patsubst src/day%.jl,day%,$(wildcard src/day*.jl))

.PHONY: all docs repl $(days)

all:
	julia --project=. -e 'using AOC2022; @runall'

$(days):
	@julia --project=. -e 'using AOC2022; @day $(@:day%=%)'

serve: sysimage.so
	julia --project=docs/ -Jsysimage.so -e 'using Pkg; Pkg.develop(PackageSpec(path=pwd())); Pkg.instantiate()'
	julia --project=docs/ -Jsysimage.so -ie 'using Revise; using AOC2022, LiveServer; servedocs()'

docs: sysimage.so
	julia --project=docs/ -Jsysimage.so -e 'using Pkg; Pkg.develop(PackageSpec(path=pwd())); Pkg.instantiate()'
	julia --project=docs/ -Jsysimage.so docs/make.jl

repl:
	julia --project=. -Jsysimage.so -i -e 'using Revise; using AOC2022'

