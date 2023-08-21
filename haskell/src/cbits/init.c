// Including this since we need access to GHC's RTS API. And it
// transitively includes pretty much all of libc headers that we need.
#include <Rts.h>

// When GHC compiles the Test module with foreign export, it'll
// generate Test_stub.h that declares the prototypes for C functions
// that wrap the corresponding Haskell functions.
#include "TypeSafari/Wasm/Main_stub.h"

// The prototype of hs_init_with_rtsopts is "void
// hs_init_with_rtsopts(int *argc, char **argv[])" which is a bit
// cumbersome to work with, hence this convenience wrapper.
STATIC_INLINE void hs_init_with_rtsopts_(char *argv[]) {
  int argc;
  for (argc = 0; argv[argc] != NULL; ++argc) {
  }
  hs_init_with_rtsopts(&argc, &argv);
}

// Export this function as "wizer.initialize". wizer also accepts
// "--init-func <init-func>" if you dislike this export name, or
// prefer to pass -Wl,--export=my_init at link-time.
//
// By the time this function is called, the WASI reactor _initialize
// has already been called by wizer. The export entries of this
// function and _initialize will both be stripped by wizer.
__attribute__((export_name("wizer.initialize"))) void __wizer_initialize(void) {
  // The first argument is what you get in getProgName.
  //
  // --nonmoving-gc is recommended when compiling to WASI reactors,
  // since you're likely more concerned about GC pause time than the
  // overall throughput.
  //
  // -H64m sets the "suggested heap size" to 64MB and reserves so much
  // memory when doing GC for the first time. It's not a hard limit,
  // the RTS is perfectly capable of growing the heap beyond it, but
  // it's still recommended to reserve a reasonably sized heap in the
  // beginning. And it doesn't add 64MB to the wizer output, most of
  // the grown memory will be zero anyway!
  char *argv[] = {"type-safari.wasm", "+RTS", "--nonmoving-gc", "-H64m", "-RTS", NULL};

  // The WASI reactor _initialize function only takes care of
  // initializing the libc state. The GHC RTS needs to be initialized
  // using one of hs_init* functions before doing any Haskell
  // computation.
  hs_init_with_rtsopts_(argv);

  // Perform a major GC to clean up the heap. When using the nonmoving
  // garbage collector, it's necessary to call it twice to actually
  // free the unused segments.
  hs_perform_gc();
  hs_perform_gc();

  // Finally, zero out the unused RTS memory, to prevent the garbage
  // bytes from being snapshotted into the final wasm module.
  // Otherwise it wouldn't affect correctness, but the wasm module
  // size would bloat significantly. It's only safe to call this after
  // hs_perform_gc() has returned.
  rts_clearMemory();
}