days := $(patsubst src/day%.jl,day%,$(wildcard src/day*.jl))
indent := awk -e '{ print "  \033[34m┃\033[m " $$0 }'

.PHONY: all docs $(days)

all: $(days)

$(days):
	@echo -e "\033[1mRunning day $(@:day%=%)\033[m"
	@julia --project=. -e 'using AOC2022; @day $(@:day%=%)' | $(indent)

docs:
	julia --project=docs/ -e 'using Pkg; Pkg.develop(PackageSpec(path=pwd())); Pkg.instantiate()'
	julia --project=docs docs/make.jl