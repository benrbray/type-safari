// based on fourmolu-wasm by Brandon Chinn
// https://github.com/fourmolu/fourmolu/blob/8aa2200fb38345d624d9682a051682094017bf8e/web/worker/index.js

import { Fd, OpenFile, WASI, File } from '@bjorn3/browser_wasi_shim';
import "./workerApi";
import { WasmApi, Ptr, JsonOp } from './WasmApi';
import { WorkerRequest, WorkerResponse, OpName, WorkerRequestData } from './workerApi';
import { PickByType } from '../util/types';

////////////////////////////////////////////////////////////////////////////////

const defaultConsoleLog = console.log;
console.log = function(...args: unknown[]) {
	defaultConsoleLog(`%c[worker]`, "color: green", ...args);
}

const encoder = new TextEncoder();
const decoder = new TextDecoder();

const stdin  = new OpenFile(new File([]));
const stdout = new OpenFile(new File([]));
const stderr = new OpenFile(new File([]));

////////////////////////////////////////////////////////////////////////////////

type Haskell = WasmApi & WebAssembly.Exports & { memory: WebAssembly.Memory };

/**
 * Encodes a JavaScript `Uint8Array` as a Haskell `StringWithLen`.
 */
const withBytesPtr = (
	haskell: Haskell,
	bytes: Uint8Array,
	callback: (inputPtr: Ptr, inputLen: number) => void
) => {
	const len = bytes.byteLength
	const ptr = haskell.malloc(len)
	try {
		const memory = haskell.memory as WebAssembly.Memory
		new Uint8Array(memory.buffer, ptr, len).set(bytes)
		callback(ptr, len)
	} finally {
		haskell.free(ptr)
	}
}


async function main() {
	const wasmPath = "/type-safari.wasm";
	const wasm = await initWebAssembly(fetch(wasmPath));
	const haskell = wasm.instance.exports as Haskell;

	console.log(haskell);

	onmessage = (evt) => {
		const req = evt.data as WorkerRequest<OpName>;

		console.log("received request from main", req);

		     if(req.tag === "toUpper")  { runToUpper(haskell, req.data);            }
		else if(req.tag === "runParse") { runJsonOp(haskell, "runParse", req.data); }
		else if(req.tag === "runParseType") {
			runJsonOp(haskell, "runParseType", req.data);
		} else if(req.tag === "runInferAbstract")
			{ runJsonOp(haskell, "runInferAbstract", req.data); }
		else if(req.tag === "runInferConcrete")
			{ runJsonOp(haskell, "runInferConcrete", req.data); }
		else { respondUnknown(); }
	};

	// send initial message indicating worker is ready
	respondReady();
}

function decodeStringWithLen(haskell: Haskell, ptr: Ptr): string {
	try {
		const outputPtr = haskell.getString(ptr);
		const outputLen = haskell.getStringLen(ptr);
		const outputBytes = new Uint8Array(haskell.memory.buffer, outputPtr, outputLen);
		const output = decoder.decode(outputBytes);

		return output;
	} finally {
		haskell.freeStringWithLen(ptr);
	}
}

function runToUpper(
	haskell: Haskell,
	request: WorkerRequestData["toUpper"]
) {
	const inputBytes = encoder.encode(request.value);
	let result: null | string = null;

	withBytesPtr(haskell, inputBytes, (inputPtr, inputLen) => {
		const resultPtr = haskell.runToUpper(inputPtr, inputLen);
		const resultStr = decodeStringWithLen(haskell, resultPtr);
		console.log(`result: ${resultStr}`);
		result = resultStr;
	});

	if(result !== null) {
		respond({ tag: "workerResult", data: { result: result } });
	} else {
		respondFailure();
	}

	return;
}

/**
 * Note: Since the `Ptr` type is just an alias for `number`,
 * `OpName` may include some non-JSON operations.  Be careful!
 */
function runJsonOp<JsonIn, OpName extends keyof PickByType<WasmApi, JsonOp>>(
	haskell: Haskell,
	jsonOp: OpName,
	inputJson: JsonIn
): void {
	// serialize input json
	const inputBytes = encoder.encode(JSON.stringify(inputJson));

	// call wasm webworker
	let resultJson: string|null = null;
	withBytesPtr(haskell, inputBytes, (inputPtr, inputLen) => {
		const runOp = (haskell as WasmApi)[jsonOp];
		const resultPtr = runOp(inputPtr, inputLen);
		const resultStr = decodeStringWithLen(haskell, resultPtr);
		console.log(`result: ${resultStr}`);
		resultJson = resultStr;
	});

	if(resultJson !== null) {
		/* TODO (Ben @ 2023/08/23) eliminate this `any`? */
		const result: any = JSON.parse(resultJson);
		respond({ tag : "workerResult", data: result });
	} else {
		respondFailure();
	}
}

////////////////////////////////////////////////////////////////////////////////

function respond(response: WorkerResponse<OpName>): void {
	console.log("posting response", response);
	postMessage(response);
}

function respondSuccess(): void { respond({ tag: "workerSuccess" });        }
function respondReady(): void   { respond({ tag: "workerReady" });          }
function respondUnknown(): void { respond({ tag: "workerUnknownRequest" }); }
function respondFailure(): void { respond({ tag: "workerFailure" });        }

////////////////////////////////////////////////////////////////////////////////

async function initWebAssembly(source: Promise<Response>) {
	const args: string[] = [];
	const env: string[]  = [];
	const fds: Fd[] = [stdin, stdout, stderr];
	
	const wasi = new WASI(args, env, fds);

	const wasm = await WebAssembly.instantiateStreaming(source, {
		wasi_snapshot_preview1: wasi.wasiImport,
	});

	wasi.inst = wasm.instance as any;
	return wasm;
}

main();