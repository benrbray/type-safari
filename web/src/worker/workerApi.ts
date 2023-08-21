type Tag<T extends string> = { tag: T };

/* ---- request ----------------------------------------- */

type WorkerRequest = AddOne | ToUpper | Parse

type AddOne  = Tag<"addOne">  & { value: number };
type ToUpper = Tag<"toUpper"> & { value: string };
type Parse = Tag<"runParse"> & { data: { inputText: string } };

/* ---- response ---------------------------------------- */

type WorkerResponse
	= WorkerReady
	| WorkerSuccess
	| WorkerFailure
	| WorkerUnknownRequest
	| WorkerToUpperResult
	| WorkerParseResult;

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
