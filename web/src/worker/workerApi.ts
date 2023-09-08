import { assert, _ } from "spec.ts";

export type Tag<T extends string> = { tag: T };

export type KeyOf<T> = T extends T ? keyof T : never;

/* ---- request ----------------------------------------- */

export interface WorkerRequestData {
	"toUpper" : {
		value : string
	},
	"runParse" : {
		inputText: string
	},
	"runInferAbstract" : {
		inputText: string
	},
	"runInferConcrete" : {
		inputText: string
	}
}

export type OpName = keyof WorkerRequestData

// ternary operator is necessary as a hack here for distributive types, so that
//   if `OpName = A | B`
//   then `WorkerRequest<OpName> = WorkerRequest<A> | WorkerRequest<B>`
export type WorkerRequest<Op extends OpName> = Op extends OpName ? {
	tag: Op,
	data: WorkerRequestData[Op]
} : never;


/* ---- response ---------------------------------------- */

export interface WorkerResultData {
	"toUpper" : {
		result : string
	},
	"runParse" : {
		outputExpr?: any|undefined
		outputError?: string|undefined
	},
	"runInferAbstract" : {
		outputExpr?: any|undefined
		outputType?: any|undefined
		outputError?: string|undefined
		outputConstraints?: string[],
		outputSubst?: { [typeVar:string] : string }|undefined
		outputActions?: string[] | undefined
	},
	"runInferConcrete" : {
		outputExpr?: any|undefined
		outputType?: any|undefined
		outputError?: string|undefined
	}
}

export interface WorkerResult<Op extends OpName> {
	tag: "workerResult",
	data: WorkerResultData[Op]
}

/** Assert that there is a result type for every operation. */
assert(_ as keyof WorkerResultData, _ as OpName);

export type WorkerResponse<Op extends OpName>
	= WorkerReady
	| WorkerSuccess
	| WorkerFailure
	| WorkerUnknownRequest
	| WorkerResult<Op>;

export type WorkerReady = Tag<"workerReady">;
export type WorkerSuccess = Tag<"workerSuccess">;
export type WorkerFailure = Tag<"workerFailure">;
export type WorkerUnknownRequest = Tag<"workerUnknownRequest">;
