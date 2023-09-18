// solid
import { onMount } from 'solid-js';

// codemirror
import { langHighlight, langSupport } from '../../lezer/lang';
import { EditorView, basicSetup } from "codemirror"
import {showPanel, Panel} from "@codemirror/view"
import { EditorState, Extension } from "@codemirror/state"

// project
import "./CodeEditor.css"
import { ErrorInfo, errorPlugin, clearErrors, addError } from '../../editor/ErrorPlugin';

////////////////////////////////////////////////////////////

export interface CodeEditorProps {
  onReady: (api: CodeEditorApi) => void,
  children: string, // editor contents
  extensions?: Extension[]
}

export interface CodeEditorApi {
  getCurrentText: () => string,
  clearErrors: () => void,
  addError: (error: ErrorInfo) => void
  lineColToPos: (line: number, col: number) => number|null
}

export const CodeEditor = (props: CodeEditorProps) => {
  // thanks to SolidJS, we can just assign JSX to a variable!
  let editorElt: HTMLDivElement|undefined;

  onMount(() => {
    if(!editorElt) { throw Error("editorElt not defined"); }
    
    const editor = new EditorView({
      doc: props.children,
      extensions: [
        basicSetup,
        langSupport(),
        langHighlight,
        selectionPanelPlugin(),
        errorPlugin(),
        ...(props.extensions || [])
      ],
      parent: editorElt!
    });

    props.onReady({
      getCurrentText: () => editor.state.doc.toString(),
      clearErrors: () => {
        editor.dispatch({ effects: [ clearErrors.of(null) ]});
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
    });
  })

  return (<div ref={editorElt}></div>);
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