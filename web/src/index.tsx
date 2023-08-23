/* @refresh reload */
import { render } from 'solid-js/web'
import WasmWorker from "./worker/worker?url"

import './index.css'
import { createSignal } from 'solid-js';

////////////////////////////////////////////////////////////////////////////////

let _worker: Worker;
let _currentRequest: Promise<WorkerResponse>;

/**
 * Communication with the web worker is based on `fourmolu-wasm` by Brandon Chinn.
 * https://github.com/fourmolu/fourmolu/blob/8aa2200fb38345d624d9682a051682094017bf8e/web/site/static/demo.js
 */
function initWorker() {
  _worker = new Worker(WasmWorker, { type: "module" });

  _currentRequest = new Promise((resolve) => {
    // wait for initial message indicating worker is ready
    _worker.onmessage = (evt) => {
      const response = evt.data as WorkerResponse;
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
function callWorker(message: WorkerRequest): Promise<WorkerResponse> {
  const promise: Promise<WorkerResponse> =
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

const workerApi = {
  async toUpper(s: string): Promise<string> {
    return new Promise(async (resolve, reject) => {
      const result = await callWorker({ tag: "toUpper", value: s });

      if(result.tag === "workerToUpperResult") {
        resolve(result.result);
      } else {
        reject();
      }
    });
  },

  async runParse(s: string): Promise<WorkerParseResult> {
    return new Promise(async (resolve, reject) => {
      const result = await callWorker({ tag: "runParse", data: { inputText: s } });

      if(result.tag === "workerParseResult") {
        resolve(result.outputExpr || result.outputError || "missing data");
      } else {
        reject();
      }
    });
  },

  async runInfer(s: string): Promise<WorkerInferResult> {
    return new Promise(async (resolve, reject) => {
      const result
        = await callWorker({
            tag: "runInfer",
            data: { inputText: s }
        }) as WorkerInferResult;

      if(result.tag === "workerInferResult") {
        resolve(result);
      } else {
        reject();
      }
    });
  }
}

////////////////////////////////////////////////////////////////////////////////

const root = document.getElementById('root')

const App = function () {
  const [userText, setUserText] = createSignal<string>("");
  const [resultExpr, setResultExpr] = createSignal<string>("");
  const [resultType, setResultType] = createSignal<string>("");

  const handleClick = async () => {
    const result = await workerApi.runInfer(userText());

    console.log("[main]", result);

    let expr = result.outputExpr ? JSON.stringify(result.outputExpr, undefined, 2) : result.outputError;
    let tp = result.outputType || result.outputError;

    setResultExpr(expr || "");
    setResultType(tp);
  }

  return (<div class="demo">
    <h1>type-safari</h1>
    <div class="top">
      <textarea class="userTextInput" onChange={(evt) => {setUserText(evt.target.value)}} value={userText()} />
    </div>
    <div class="controls">
      <button class="btn" onClick={handleClick}>Parse</button>
    </div>
    <div class="bottom">
      <pre class="resultExpr"><code>{resultExpr()}</code></pre>
      <pre class="resultType"><code>{resultType()}</code></pre>
    </div>
  </div>);
}

window.onload = function() {
  initWorker();

  render(() => <App />, root!);
}