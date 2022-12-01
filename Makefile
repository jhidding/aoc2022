days := $(patsubst src/day%.jl,day%,$(wildcard src/day*.jl))
indent := awk -e '{ print "    " $$0 }'

.PHONY: all docs $(days)

all: $(days)

$(days):
	@echo "Running day $(@:day%=%)"
	@julia --project=. -e 'using AOC2022; @day $(@:day%=%)' | $(indent)

docs:
	julia --project=docs/ -e 'using Pkg; Pkg.develop(PackageSpec(path=pwd())); Pkg.instantiate()'
	julia --project=docs docs/make.jl
