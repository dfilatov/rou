test:
	node test/runner.js

RJS := ./node_modules/requirejs/bin/r.js

min:
	$(RJS) -convert lib build/lib
	$(RJS) -o build/build.js
	rm -rf build/lib

.PHONY: test min