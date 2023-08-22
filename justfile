set shell := ["bash", "-uc"]

build-wasm:
	cd haskell && ./build.sh
	cp ./haskell/build/type-safari.wasm ./web/public/type-safari.wasm

dev: build-wasm
	cd web && npm run dev