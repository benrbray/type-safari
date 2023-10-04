set shell := ["bash", "-uc"]

build-wasm:
	cd haskell && ./build.sh
	cp ./haskell/build/type-safari.wasm ./web/public/type-safari.wasm

dev: build-wasm
	cd web && npm run dev

deps-site: build-wasm
	cd web && npm run build
	cd blog && rm -rf lib
	cp -r web/dist blog/lib

build-site: deps-site
	cd blog && cabal run site -- clean
	cd blog && cabal run site -- build

watch-site: deps-site
	cd blog && rm -rf _site
	cd blog && rm -rf _cache
	cd blog && cabal run site -- watch
