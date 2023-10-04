
import { render } from "solid-js/web";
import WasmWorker from "./worker/worker?worker&inline"
import { OpName, WorkerApi, WorkerRequest, WorkerRequestData, WorkerResponse, WorkerResult } from './worker/workerApi';
import { TypeInference } from "./demos/TypeInference";

import "./shared.css";

////////////////////////////////////////////////////////////////////////////////

export function log(s: string) {
  console.log(s);
}

export const workerApi: WorkerApi = {
  async toUpper(data: { value: string}) {
    return callWorkerApi("toUpper", data);
  },

  async runParse(data: { inputText: string}) {
    return callWorkerApi("runParse", data);
  },

  async runParseType(data: { inputText: string}) {
    return callWorkerApi("runParseType", data);
  },

  async runInferAbstract(data: { inputText: string}) {
    return callWorkerApi("runInferAbstract", data);
  },

  async runUnify(data: { inputText: string}) {
    return callWorkerApi("runUnify", data);
  },
}

export function makeTypeInferenceDemo(elt: HTMLDivElement, code: string) {
  render(() => <TypeInference workerApi={workerApi}>{code}</TypeInference>, elt);
}

////////////////////////////////////////////////////////////////////////////////

let _worker: Worker;
let _currentRequest: Promise<WorkerResponse<OpName>>;

/**
 * Communication with the web worker is based on `fourmolu-wasm` by Brandon Chinn.
 * https://github.com/fourmolu/fourmolu/blob/8aa2200fb38345d624d9682a051682094017bf8e/web/site/static/demo.js
 */
export function initWorker() {
  _worker = new WasmWorker();

  _currentRequest = new Promise((resolve) => {
    // wait for initial message indicating worker is ready
    _worker.onmessage = (evt) => {
      const response = evt.data as WorkerResponse<never>;
      if(response.tag !== "workerReady") { return; }

      console.log("worker is ready");

      // start allowing requests
      resolve(response);
    }
  });
}

/** 
  * All calls to the web worker should be made through `callWorker`,
  * which chains requests as promises to ensure synchronous access.
  */
function callWorker<Op extends keyof WorkerRequestData>(
  message: WorkerRequest<Op>
): Promise<WorkerResponse<Op>> {
  const promise: Promise<WorkerResponse<Op>> =
    _currentRequest.then(() =>
      new Promise((resolve) => {
        console.log("[main] sending request to worker", message);
        _worker.postMessage(message);
        _worker.onmessage = (event) => resolve(event.data);
      })
    );

  _currentRequest = promise;
  return promise;
}

function callWorkerApi<Op extends OpName>(
  op: Op,
  data: WorkerRequestData[Op]
): Promise<WorkerResult<Op>> {
  return new Promise<WorkerResult<Op>>(async (resolve, reject) => {
    // TODO (Ben @ 2023/08/23) eliminate this cast
    // https://stackoverflow.com/q/76962844/1444650
    const req = { tag: op, data } as WorkerRequest<Op>;

    const result = await callWorker<Op>(req);
    
    if(result.tag === "workerResult") {
      resolve(result);
    } else {
      console.error(`expected workerResult, received ${result.tag}`);
      reject();
    }
  });
}

////////////////////////////////////////////////////////////////////////////////

