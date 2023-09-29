/* @refresh reload */
import { render } from 'solid-js/web'
import WasmWorker from "./worker/worker?url"

import './index.css'
import { createSignal } from 'solid-js';
import { OpName, OutputError, WorkerRequest, WorkerRequestData, WorkerResponse, WorkerResult } from './worker/workerApi';

// codemirror
import { SelectionRange } from "@codemirror/state";

// lezer lang
import { printTree } from './lezer/print-lezer-tree';
import { parser } from "./lezer/lang.grammar"
import { CodeEditor, CodeEditorApi } from './components/CodeEditor/CodeEditor';

import AnsiColor from "ansi-to-html";
import dedent from "dedent-js";
import { parseTreePlugin } from './editor/ParseInfoPlugin';
import { Expr, HasSpan, LocatedTree, TypeFragment, exprSubTerms, treeSpanQuery, typeSubExprs } from './syntax/Expr';

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

  async runUnify(inputText: string) {
    return callWorkerApi("runUnify", { inputText });
  },
}

////////////////////////////////////////////////////////////////////////////////

const root = document.getElementById('root');

const App = function () {
  return (<div class="demo column">
    <h1>type-safari</h1>

    <h2>Unification</h2>
    <Unification />

    <h2>Type Inference</h2>
    <TypeInference />
  </div>);
}

////////////////////////////////////////////////////////////

const debounce = (delay: number, func: () => void): (() => void) => {
  let timerId: number;
  const debounced = () => {
      clearTimeout(timerId);
      timerId = setTimeout(() => { func(); }, delay);
  };
  return debounced;
}

type UpdaterResult<T extends HasSpan>
  = { tag: "error", error: OutputError }
  | { tag: "result", tree: LocatedTree<T>
}

function parseTreeUpdater<T extends HasSpan>(
  getCodeEditorApi: () => CodeEditorApi|null,
  updater: (text: string) => Promise<UpdaterResult<T>>
) {
  // closures to capture state between calls
  // TODO (Ben @ 2023/09/23)
  let parseTree: LocatedTree<T> | null = null;

  /**
   * Schedule an update of the parse tree.
   */
  const requestUpdateParseTree = debounce(400, async () => {
    const codeEditorApi = getCodeEditorApi();
    if(!codeEditorApi) { return; }

    const text = codeEditorApi.getCurrentText();
    const result = await updater(text);

    // clear errors
    codeEditorApi.clearErrors();

    if(result.tag === "result") {
      parseTree = result.tree;
    } else {
      // invalidate the current parse tree
      parseTree = null;

      const error = result.error;
      console.warn(error);

      if(error.tag === "OutputParseError") {
        for(let err of error.contents.errors) {
          const errorStart = codeEditorApi.lineColToPos(err[0].errorLine, err[0].errorCol);
          
          if(errorStart !== null) {
            codeEditorApi.addError({
              type: "ParseError",
              message: err[1],
              range: { from: Math.max(0, errorStart-1), to: errorStart }
            });
          } else {
            console.error("bad line/col", error);
          }

        }
  
      }
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

  const infoAt = (selection: SelectionRange): T|null => {
    if(parseTree === null) { return null; }
    const { from, to } = selection;
    return treeSpanQuery([from,to], parseTree);
  }

  return {
    handleDocChanged,
    infoAt
  };
}

const Unification = () => {
  let codeEditorApi: CodeEditorApi;

  const { handleDocChanged, infoAt }
  = parseTreeUpdater(
      () => codeEditorApi,
      async (text: string): Promise<UpdaterResult<TypeFragment>> => {
        const result = await workerApi.runUnify(text);

        if(result.data.outputSubst) {
          console.log(result.data.outputSubst);
          return {
            tag: "result",
            tree: {
              subTrees: typeSubExprs,
              tree: result.data.outputSubst
            }
          };
        } else {
          return {
            tag: "error",
            error: result.data.outputError!
          };
        }
      }
  );

  return <div>
    <CodeEditor
      lang="unification"
      onReady={(api) => { codeEditorApi = api }}
      extensions={[parseTreePlugin(handleDocChanged, infoAt)]}
    >
      {dedent(String.raw`
        forall r. (forall a. a -> r) -> r
      `)}
    </CodeEditor>
  </div>;
}

////////////////////////////////////////////////////////////

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
      JSON.stringify(result.data.outputError, undefined, 2);
    let tp = result.data.outputType;

    setResultExpr(expr || "");
    setResultType(tp || "");
    setResultSubst(JSON.stringify(result.data.outputSubst, undefined, 2));
    setResultActions(result.data.outputActions?.join("\n") || "");
    setResultConstraints(result.data.outputConstraints || []);
  }

  const { handleDocChanged, infoAt }
    = parseTreeUpdater(
        () => codeEditorApi,
        async (text: string): Promise<UpdaterResult<Expr>> => {
          const result = await workerApi.runInferAbstract(text);
          if(result.data.outputExpr) {
            return {
              tag: "result",
              tree: {
                subTrees: exprSubTerms,
                tree: result.data.outputExpr
              }
            };
          } else {
            return {
              tag: "error",
              error: result.data.outputError!
            };
          }
        }
    );

  const ansiColor = new AnsiColor({ fg: "#000", newline: true });

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