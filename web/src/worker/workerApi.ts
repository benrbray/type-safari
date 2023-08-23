type Tag<T extends string> = { tag: T };

/* ---- request ----------------------------------------- */

type WorkerRequest = AddOne | ToUpper | Parse | Infer;

type AddOne  = Tag<"addOne">  & { value: number };
type ToUpper = Tag<"toUpper"> & { value: string };
type Parse = Tag<"runParse"> & { data: { inputText: string } };
type Infer = Tag<"runInfer"> & { data: { inputText: string } };

/* ---- response ---------------------------------------- */

type WorkerResponse
	= WorkerReady
	| WorkerSuccess
	| WorkerFailure
	| WorkerUnknownRequest
	| WorkerToUpperResult
	| WorkerParseResult
	| WorkerInferResult;

type WorkerReady = Tag<"workerReady">;
type WorkerSuccess = Tag<"workerSuccess">;
type WorkerFailure = Tag<"workerFailure">;
type WorkerUnknownRequest = Tag<"workerUnknownRequest">;

type WorkerToUpperResult = Tag<"workerToUpperResult"> & {
	result: string
};

type WorkerParseResult = Tag<"workerParseResult"> & {
	outputExpr?: any|undefined
	outputError?: string|undefined
};

type WorkerInferResult = Tag<"workerInferResult"> & {
	outputExpr?: any|undefined
	outputType?: any|undefined
	outputError?: string|undefined
};
