import { SelectionRange } from "@codemirror/state";
import { CodeEditorApi } from '../components/CodeEditor/CodeEditor';
import { HasSpan, LocatedTree, treeSpanQuery } from '../syntax/Expr';
import { OutputError } from '../worker/workerApi';


////////////////////////////////////////////////////////////

const debounce = (delay: number, func: () => void): (() => void) => {
  let timerId: number;
  const debounced = () => {
      clearTimeout(timerId);
      timerId = setTimeout(() => { func(); }, delay);
  };
  return debounced;
}

export type UpdaterResult<T extends HasSpan>
  = { tag: "error", error: OutputError }
  | { tag: "result", tree: LocatedTree<T>
}

export function parseTreeUpdater<T extends HasSpan>(
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

    console.log(result);

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
      } else if(error.tag === "OutputSyntaxError") {
        if(error.contents.tag === "UnboundVariable") {
          const [[from,to], name] = error.contents.contents;
          codeEditorApi.addError({
            type: "SyntaxError",
            message: `unbound variable '${name}'`,
            range: { from, to }
          });
        } else if(error.contents.tag === "ExpectedMonoType") {
          const [from,to] = error.contents.contents;
          codeEditorApi.addError({
            type: "SyntaxError",
            message: "Expected monotype, found polytype instead.  Hindley-Milner only supports universal quantification at the top-level.",
            range: { from , to }
          });
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