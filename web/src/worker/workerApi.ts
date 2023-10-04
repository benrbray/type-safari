import { assert, _ } from "spec.ts";
import { Expr, Type } from "../syntax/Expr";

export type Tag<T extends string> = { tag: T };

export type KeyOf<T> = T extends T ? keyof T : never;

export type WorkerApi = {
  [Op in OpName] : (data: WorkerRequestData[Op]) => Promise<WorkerResult<Op>>
}


/* ---- request ----------------------------------------- */

export interface WorkerRequestData {
	"toUpper" : {
		value : string
	},
	"runParse"         : { inputText: string },
	"runParseType"     : { inputText: string },
	"runInferAbstract" : { inputText: string },
	"runUnify"         : { inputText: string }
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

export type OutputError
	= OutputParseError
	| OutputSyntaxError
	| OutputTypeError
	| OutputUnknownError

export type OutputParseError = {
	tag: "OutputParseError",
	contents: {
		errors: [{
			errorLine: number,
			errorCol: number,
			errorSource: string
		}, string][]
	}
}

export type OutputTypeError = {
	tag: "OutputTypeError"
	contents: string
}

export type OutputSyntaxError = {
	tag: "OutputSyntaxError"
	contents:
		{ tag: "UnboundVariable", contents: [[number, number], string] } |
		{ tag: "ExpectedMonoType", contents: [number, number] }
};

export type OutputUnknownError = {
	tag: "OutputUnknownError"
	contents: string
}

export interface WorkerResultData {
	"toUpper" : {
		result : string
	},
	"runParse" : {
		outputExpr?: Expr | undefined
		outputError?: OutputError|undefined
	},
	"runParseType" : {
		outputTypeConcrete?: Type |undefined
		outputTypeAbstract?: string |undefined
		outputError?: OutputError|undefined
	},
	"runInferAbstract" : {
		outputExpr?: Expr |undefined
		outputType?: string | undefined
		outputError?: OutputError|undefined
		outputConstraints?: string[],
		outputSubst?: { [typeVar:string] : string }|undefined
		outputActions?: string[] | undefined
	},
	"runUnify" : {
		outputSubst?: any |undefined
		outputError?: OutputError|undefined
	},
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
