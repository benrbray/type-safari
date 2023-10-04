import { createSignal } from 'solid-js';
import { WorkerApi } from '../worker/workerApi';
import { CodeEditor, CodeEditorApi } from '../components/CodeEditor/CodeEditor';
// import { printTree } from '../lezer/print-lezer-tree';
import { UpdaterResult, parseTreeUpdater } from '../editor/parseTreeUpdater';
import { Expr, exprSubTerms } from '../syntax/Expr';
// import AnsiColor from "ansi-to-html";
import { parseTreePlugin } from '../editor/ParseInfoPlugin';
import dedent from 'dedent-js';
// import { parser } from "../lezer/lang.grammar"

////////////////////////////////////////////////////////////

export const TypeInference = (props: {
  workerApi: WorkerApi,
  children: string
}) => {
  const [resultExpr, _setResultExpr] = createSignal<string>("");
  const [resultType, _setResultType] = createSignal<string>("");
  const [resultSubst, _setResultSubst] = createSignal<string>("");
  const [resultActions, _setResultActions] = createSignal<string>("");
  // const [resultConstraints, setResultConstraints] = createSignal<string[]>([]);

  // const [foo, setFoo] = createSignal<string>("");

  // solidJS only renders once, so an ordinary closure is
  // enough to keep a mutable reference (with no reactivity)
  let codeEditorApi: CodeEditorApi|null = null;

  // const handleClick = async () => {
  //   if(!codeEditorApi) { return; }

  //   const text = codeEditorApi.getCurrentText();
  //   const pretty = printTree(parser.parse(text), text);
  //   console.log(pretty);
  //   setFoo(pretty);
  
  //   const result = await props.workerApi.runInferAbstract({ inputText: text });

  //   console.log("[main]", result);

  //   let expr =
  //     result.data.outputExpr ?
  //     JSON.stringify(result.data.outputExpr, undefined, 2) :
  //     JSON.stringify(result.data.outputError, undefined, 2);
  //   let tp = result.data.outputType;

  //   setResultExpr(expr || "");
  //   setResultType(tp || "");
  //   setResultSubst(JSON.stringify(result.data.outputSubst, undefined, 2));
  //   setResultActions(result.data.outputActions?.join("\n") || "");
  //   setResultConstraints(result.data.outputConstraints || []);
  // }

  const { handleDocChanged, infoAt }
    = parseTreeUpdater(
        () => codeEditorApi,
        async (text: string): Promise<UpdaterResult<Expr>> => {
          const result = await props.workerApi.runInferAbstract({ inputText: text });
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

  // const ansiColor = new AnsiColor({ fg: "#000", newline: true });

  return (<>
    <div class="top">
    <CodeEditor
        onReady={(api) => { codeEditorApi = api }}
        extensions={[parseTreePlugin(handleDocChanged, infoAt)]}
      >
        {dedent(props.children)}
      </CodeEditor>
    </div>
    {/* <div class="controls">
      <button class="btn" onClick={handleClick}>Parse</button>
    </div> */}
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
    {/* <div style={{ "font-family": "monospace"}} innerHTML={ansiColor.toHtml(foo())}></div> */}
  </>);
}