// solid
import { onMount } from 'solid-js';

// codemirror
import { langHighlight, exprLangSuport, typeLangSuport, unifLangSuport } from '../../lezer/lang';
import { EditorView, basicSetup } from "codemirror"
import {showPanel, Panel} from "@codemirror/view"
import { EditorState, Extension } from "@codemirror/state"

// project
import "./CodeEditor.css"
import { ErrorInfo, errorPlugin, clearErrors, addError } from '../../editor/ErrorPlugin';
import { printTree } from '../../lezer/print-lezer-tree';

////////////////////////////////////////////////////////////

export interface CodeEditorProps {
  onReady: (api: CodeEditorApi) => void,
  children: string, // editor contents
  extensions?: Extension[],
  lang?: "expr"|"type"|"unification"
}

export interface CodeEditorApi {
  getCurrentText: () => string,
  getPrettyAst: () => string,
  clearErrors: () => void,
  addError: (error: ErrorInfo) => void
  lineColToPos: (line: number, col: number) => number|null
}

const selectLangSupport = (lang: "expr"|"type"|"unification"|undefined) => {
  if(lang === "type")        { return typeLangSuport(); }
  if(lang === "expr")        { return exprLangSuport(); }
  if(lang === "unification") { return unifLangSuport(); }

  return exprLangSuport();
}

export const CodeEditor = (props: CodeEditorProps) => {
  // select language
  const langSupport = selectLangSupport(props.lang);

  // print AST
  const printLezerAst = () => {
    if(!codeEditorApi) { return; }

    const text = codeEditorApi.getCurrentText();
    const parsed = langSupport.language.parser.parse(text);
    const pretty = printTree(parsed, text);
    console.log(pretty);
  }

  // thanks to SolidJS, we can just assign JSX to a variable!
  let editorElt: HTMLDivElement|undefined;
  let codeEditorApi: CodeEditorApi|null = null;

  onMount(() => {
    if(!editorElt) { throw Error("editorElt not defined"); }

    const editor = new EditorView({
      doc: props.children,
      extensions: [
        basicSetup,
        langSupport,
        langHighlight,
        selectionPanelPlugin(),
        errorPlugin(),
        ...(props.extensions || [])
      ],
      parent: editorElt!
    });

    const getCurrentText = () => editor.state.doc.toString();

    codeEditorApi = {
      getCurrentText,
      clearErrors: () => {
        editor.dispatch({ effects: [ clearErrors.of(null) ]});
      },
      getPrettyAst: () => {
        const text = getCurrentText();
        const parsed = langSupport.language.parser.parse(text);
        return printTree(parsed, text);
      },
      addError: (error) => {
        editor.dispatch({ effects: [ addError.of(error) ]});
      },
      lineColToPos: (line, col) => {
        let { from, to } = editor.state.doc.line(line);
        let len = to - from;

        if(col - 1 <= len) { return from + (col - 1); }
        else               { return null;             }
      }
    };

    props.onReady(codeEditorApi);
  })

  return (<div>
    <div ref={editorElt}></div>
    <div>
      <button onClick={printLezerAst}>Lezer AST</button>
    </div>
  </div>);
}

////////////////////////////////////////////////////////////

function dispSelection(state: EditorState): string {
  const { from, to } = state.selection.main;
  return `(${from}, ${to})`;
}

function selectionPanel(view: EditorView): Panel {
  let dom = document.createElement("div");
  dom.textContent = dispSelection(view.state);

  return {
    dom,
    update(update) {
      if (update.selectionSet) {
        dom.textContent = dispSelection(update.state)
      }
    }
  }
}

function selectionPanelPlugin() {
  return showPanel.of(selectionPanel);
}