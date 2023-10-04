/* @refresh reload */
import { render } from 'solid-js/web'

import dedent from "dedent-js";

// lezer lang
import { CodeEditor, CodeEditorApi } from './components/CodeEditor/CodeEditor';

import { TypeFragment, typeSubExprs } from './syntax/Expr';
import { parseTreePlugin } from './editor/ParseInfoPlugin';
import { UpdaterResult, parseTreeUpdater } from './editor/parseTreeUpdater';
import { TypeInference } from './demos/TypeInference';

import * as TypeSafari from "./main"
import './shared.css'
import './index.css'

///////////////////////////////////////_current/////////////////////////////////////////

const root = document.getElementById('root');

const App = function () {
  return (<div class="demo column">
    <h1>type-safari</h1>

    <h2>Unification</h2>
    <Unification />

    <h2>Type Inference</h2>
    <TypeInference workerApi={TypeSafari.workerApi}>
    {String.raw`-- fails because lambda-bound variables are monomorphic under Hindley-Milner
    let const = (\v -> \x -> v) in
    let f = (\y -> if True then (y 1) else (y True)) in
    f const`}
    </TypeInference>
  </div>);
}

////////////////////////////////////////////////////////////

const Unification = () => {
  let codeEditorApi: CodeEditorApi;

  const { handleDocChanged, infoAt }
  = parseTreeUpdater(
      () => codeEditorApi,
      async (text: string): Promise<UpdaterResult<TypeFragment>> => {
        const result = await TypeSafari.workerApi.runParseType({ inputText: text });

        console.log(result);

        if(result.data.outputError) {
          return {
            tag: "error",
            error: result.data.outputError
          };
        } else if(result.data.outputTypeConcrete) {
          return {
            tag: "result",
            tree: {
              subTrees: typeSubExprs,
              tree: result.data.outputTypeConcrete
            }
          };
        } else {
          return {
            tag: "error",
            error: { tag: "OutputUnknownError", contents: "unknown error" }
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

window.onload = function() {
  TypeSafari.initWorker();

  render(() => <App />, root!);
}