/* @refresh reload */
import { render } from 'solid-js/web'
import WasmWorker from "./worker/worker?url"

import './index.css'
import { createSignal } from 'solid-js';
import { OpName, WorkerRequest, WorkerRequestData, WorkerResponse, WorkerResult } from './worker/workerApi';

// codemirror
import { SelectionRange, StateField } from "@codemirror/state";
import { linter, Diagnostic } from "@codemirror/lint";

// lezer lang
import { printTree } from './lezer/print-lezer-tree';
import { parser } from "./lezer/lang.grammar"
import { CodeEditor, CodeEditorApi } from './components/CodeEditor/CodeEditor';

import AnsiColor from "ansi-to-html";
import dedent from "dedent-js";
import { parseTreePlugin } from './editor/ParseInfoPlugin';
import { Expr, subexprAt } from './syntax/Expr';

////////////////////////////////////////////////////////////////////////////////

let _worker: Worker;
let _currentRequest: Promise<WorkerResponse<OpName>>;

/**
 * Communication with the web worker is based on `fourmolu-wasm` by Brandon Chinn.
 * https://github.com/fourmolu/fourmolu/blob/8aa2200fb38345d624d9682a051682094017bf8e/web/site/static/demo.js
 */
function initWorker() {
  _worker = new Worker(WasmWorker, { type: "module" });

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

const workerApi = {
  async toUpper(value: string) {
    return callWorkerApi("toUpper", { value });
  },

  async runParse(inputText: string) {
    return callWorkerApi("runParse", { inputText });
  },

  async runParseType(inputText: string) {
    return callWorkerApi("runParseType", { inputText });
  },

  async runInferAbstract(inputText: string) {
    return callWorkerApi("runInferAbstract", { inputText });
  },
}

////////////////////////////////////////////////////////////////////////////////

const root = document.getElementById('root');

// const TypeParse = () => {
//   const [userText, setUserText]     = createSignal<string>("");
//   const [resultType, setResultType] = createSignal<string>("");

//   const handleChange = async (value: string) => {
//     console.log("change");
//     setUserText(value);
//     const result = await workerApi.runParseType(value);
//     setResultType(JSON.stringify(result.data.outputType || result.data.outputError));
//   }

//   return <div>
//     <textarea onInput={(evt) => { console.log("foo") ; handleChange(evt.target.value)}} value={userText()}></textarea>
//     <div>{resultType()}</div>
//   </div>
// }

const App = function () {
  return (<div class="demo">
    <h1>type-safari</h1>

    <h2>Type Inference</h2>
    <TypeInference />
  </div>);
}

////////////////////////////////////////////////////////////

// let parseErrors = StateField.define({
//   create() { return 0; },
//   update(value, tr) {
//     return tr.docChanged ? value + 1 : value;
//   }
// });

// let foo = linter(view => {
//   return [];
// });

const TypeInference = () => {
  const [resultExpr, setResultExpr] = createSignal<string>("");
  const [resultType, setResultType] = createSignal<string>("");
  const [resultSubst, setResultSubst] = createSignal<string>("");
  const [resultActions, setResultActions] = createSignal<string>("");
  const [resultConstraints, setResultConstraints] = createSignal<string[]>([]);

  const [foo, setFoo] = createSignal<string>("");

  // solidJS only renders once, so an ordinary closure is
  // enough to keep a mutable reference (with no reactivity)
  let codeEditorApi: CodeEditorApi|null = null;

  const ansiColor = new AnsiColor({ fg: "#000", newline: true });

  const handleClick = async () => {
    if(!codeEditorApi) { return; }

    const text = codeEditorApi.getCurrentText();
    const pretty = printTree(parser.parse(text), text);
    console.log(pretty);
    setFoo(pretty);
  
    const result = await workerApi.runInferAbstract(text);

    console.log("[main]", result);

    let expr =
      result.data.outputExpr ?
      JSON.stringify(result.data.outputExpr, undefined, 2) :
      result.data.outputError;
    let tp = result.data.outputType || result.data.outputError;

    setResultExpr(expr || "");
    setResultType(tp);
    setResultSubst(JSON.stringify(result.data.outputSubst, undefined, 2));
    setResultActions(result.data.outputActions?.join("\n") || "");
    setResultConstraints(result.data.outputConstraints || []);
  }

  let parseTree: Expr | null = null;

  const debounce = (delay: number, func: () => void): (() => void) => {
    let timerId: number;
    const debounced = () => {
        clearTimeout(timerId);
        timerId = setTimeout(() => { func(); }, delay);
    };
    return debounced;
  }

  /**
   * Schedule an update of the parse tree.
   */
  const requestUpdateParseTree = debounce(400, async () => {
    if(!codeEditorApi) { return; }

    const text = codeEditorApi.getCurrentText();
    const result = await workerApi.runInferAbstract(text);

    if(result.data.outputExpr) {
      parseTree = result.data.outputExpr;
    } else {
      console.error(result.data.outputError);
      parseTree = null;
    }
  });

  const handleDocChanged = () => {
    // invalidate parse tree after a change, as the
    // position annotatoins are no longer valid, and
    // using them for decorations will cause errors
    parseTree = null;

    // TODO (Ben @ 2023/09/16) while waiting for a parse update,
    // map old position annotations through the doc changes
    requestUpdateParseTree();
  }

  const infoAt = (selection: SelectionRange): Expr|null => {
    console.log("infoAt", parseTree === null);
    if(parseTree === null) { return null; }

    const { from, to } = selection;
    return subexprAt([from,to], parseTree);
  }

  return (<>
    <div class="top">
      <CodeEditor
        onReady={(api) => { codeEditorApi = api }}
        extensions={[parseTreePlugin(handleDocChanged, infoAt)]}
      >
        {dedent(String.raw`
          -- fails because lambda-bound variables are monomorphic under Hindley-Milner
          let const = (\v -> \x -> v) in
          let f = (\y -> if True then (y 1) else (y True)) in
          f const
        `)}
      </CodeEditor>
    </div>
    <div class="controls">
      <button class="btn" onClick={handleClick}>Parse</button>
    </div>
    <div class="bottom">
      <pre class="resultType"><code>{resultType()}</code></pre>
      <div class="bottom-split">
        <div class="bottom-split-left">
          <pre class="resultExpr"><code>{resultExpr()}</code></pre>
        </div>
        <div class="bottom-split-right">
          <pre class="resultSubst"><code>{resultSubst()}</code></pre>
          <pre class="resultActions"><code>{resultActions()}</code></pre>
        </div>
      </div>
    </div>

    <div style={{ "font-family": "monospace"}} innerHTML={ansiColor.toHtml(foo())}></div>

    <h2>Constraints</h2>

    <div>
    {resultConstraints()}
    </div>
  </>);
}

////////////////////////////////////////////////////////////

window.onload = function() {
  initWorker();

  render(() => <App />, root!);
}