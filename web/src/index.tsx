/* @refresh reload */
import { render } from 'solid-js/web'
import WasmWorker from "./worker/worker?url"

// codemirror
import { EditorView, basicSetup } from "codemirror"

import './index.css'
import { createSignal } from 'solid-js';
import { OpName, WorkerRequest, WorkerRequestData, WorkerResponse, WorkerResult } from './worker/workerApi';

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

  async runInferConcrete(inputText: string) {
    return callWorkerApi("runInferConcrete", { inputText });
  }
}

////////////////////////////////////////////////////////////////////////////////

const root = document.getElementById('root');

const TypeParse = () => {
  const [userText, setUserText]     = createSignal<string>("");
  const [resultType, setResultType] = createSignal<string>("");

  const handleChange = async (value: string) => {
    console.log("change");
    setUserText(value);
    const result = await workerApi.runParseType(value);
    setResultType(JSON.stringify(result.data.outputType || result.data.outputError));
  }

  return <div>
    <textarea onInput={(evt) => { console.log("foo") ; handleChange(evt.target.value)}} value={userText()}></textarea>
    <div>{resultType()}</div>
  </div>
}

const App = function () {
  const [userText, setUserText] = createSignal<string>("");
  const [resultExpr, setResultExpr] = createSignal<string>("");
  const [resultType, setResultType] = createSignal<string>("");
  const [resultSubst, setResultSubst] = createSignal<string>("");
  const [resultActions, setResultActions] = createSignal<string>("");
  const [resultConstraints, setResultConstraints] = createSignal<string[]>([]);

  const handleClick = async () => {
    const result = await workerApi.runInferAbstract(userText());

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

  return (<div class="demo">
    <h1>type-safari</h1>

    <div id="codeMirror"></div>
    <button onClick={() => { 
      const doc = codeMirror.state.doc.toString();
      console.log(doc)
      const pretty = printTree(parser.parse(doc), doc);
      console.log(pretty)
    }}>Show</button>

    <h2>Type Parsing</h2>

    <TypeParse />

    <h2>Type Inference</h2>
    <div class="top">
      <textarea class="userTextInput" onChange={(evt) => {setUserText(evt.target.value)}} value={userText()} />
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

    <h2>Constraints</h2>

    <div>
    {resultConstraints()}
    </div>

    <h2>Instantiation</h2>

  </div>);
}

////////////////////////////////////////////////////////////

import { parser } from "./lezer/simple.grammar"
import { foldNodeProp, foldInside, indentNodeProp } from "@codemirror/language"
import { styleTags, tags as t, Tag as T } from "@lezer/highlight"

const tagMetaVar = T.define(t.variableName);
const tagTypeVar = T.define(t.variableName);
const tagTermVar = T.define(t.variableName);

let parserWithMetadata = parser.configure({
  props: [
    styleTags({
      lexpr: t.docComment,
      Identifier: t.variableName,
      BooleanLiteral: t.bool,
      StringLiteral: t.string,
      LineComment: t.lineComment,
      "let": t.keyword,
      "in": t.keyword,
      "if": t.keyword,
      "then": t.keyword,
      "else": t.keyword,
      "=": t.keyword,
      "( )": t.paren,
      Symbol: t.punctuation,
      Lambda: t.definitionKeyword,
      LambdaArrow: t.definitionKeyword
    }),
    indentNodeProp.add({
      Application: context => context.column(context.node.from) + context.unit
    }),
    foldNodeProp.add({
      Application: foldInside
    })
  ]
})

import {tags} from "@lezer/highlight"
import { LRLanguage, LanguageSupport, syntaxHighlighting, HighlightStyle } from "@codemirror/language"
import { printTree } from './lezer/print-lezer-tree';

export const exampleLanguage = LRLanguage.define({
  parser: parserWithMetadata,
  languageData: {
    commentTokens: {line: ";"}
  }
})

export const example = () => {
  return new LanguageSupport(exampleLanguage)
}

const customHighlight = HighlightStyle.define([
  {tag: tags.keyword, color: "#4B69C6", fontWeight: "bold" },
  {tag: tags.definitionKeyword, color: "#72009e", fontWeight: "bold" },
  {tag: tags.comment, color: "#808080", fontStyle: "italic"},
  {tag: tags.punctuation, color: "#444", fontWeight: "bold"},
  // {tag: tags.variableName, color: "#f00", fontStyle: "italic"},"foo" :: _
  {tag: tags.bool, color: "#088", fontStyle: "italic"},
  {tag: tags.string, color: "#080" }
]);

let codeMirror: EditorView;

function makeCodeMirror() {
  codeMirror = new EditorView({
    doc: "-- compute |x|+1\nlet inc = (\\x -> x + 1) in\nlet abs = (\\x -> if x > 0 then x else -x) in\n(\\x -> inc (abs x))",
    extensions: [
      basicSetup,
      example(),
      syntaxHighlighting(customHighlight)
    ],
    parent: document.getElementById("codeMirror")!
  });
}

////////////////////////////////////////////////////////////

window.onload = function() {
  initWorker();

  render(() => <App />, root!);

  makeCodeMirror();
}