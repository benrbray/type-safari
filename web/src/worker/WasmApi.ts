export type Ptr = number;

/** An operation which takes an input C-string
 * and returns a pointer to a `StringWithLen`. */
export type StringOp = (ptr: Ptr, len: number) => Ptr;

/** A `StringOp` whose input and output strings are JSON. */
export type JsonOp = StringOp;

export type WasmApi = {
	// memory management
	malloc(n: number): Ptr;
	free(ptr: Ptr): void;
	// StringWithLen operations
	getString(ptr: Ptr): Ptr;
	getStringLen(ptr: Ptr): number;
	freeStringWithLen(ptr: Ptr): void;
	// examples
	runFibonacci(n: number): number;
	runToUpper: StringOp;
	// type-safari
  runParse: JsonOp;
  runParseType: JsonOp;
  runInferAbstract: JsonOp;
  runUnify: JsonOp;
}