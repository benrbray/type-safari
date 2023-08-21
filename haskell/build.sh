#!/usr/bin/env bash

# adapted from fourmolu-wasm
# https://github.com/fourmolu/fourmolu/blob/8aa2200fb38345d624d9682a051682094017bf8e/web/fourmolu-wasm/build.sh

set -eux -o pipefail

HERE="$(builtin cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "${HERE}"

ARGS=("$@")

listbin() {
    # https://github.com/haskell/cabal/commit/ed407b17f371c5b9ce3d40db6c939b408ef9e093
    local BIN="$(wasm32-wasi-cabal list-bin -v0 "$@")"
    case "${BIN}" in
        (*.wasm) echo "${BIN}" ;;
        (*) echo "${BIN}.wasm" ;;
    esac
}

# can't do cabal install because it'll build fourmolu too
# https://github.com/haskell/cabal/issues/8614
wasm32-wasi-cabal v2-build exe:type-safari-wasm "${ARGS[@]}"

mkdir -p "${HERE}/build/"

# pre-initialize wasm
wizer \
    --allow-wasi --wasm-bulk-memory true \
    "$(listbin type-safari-wasm)" -o "${HERE}/build/type-safari.wasm"