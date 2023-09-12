// solid
import { onMount } from 'solid-js';

// codemirror
import { langHighlight, langSupport } from '../../lezer/lang';
import { EditorView, basicSetup } from "codemirror"
import {showPanel, Panel} from "@codemirror/view"
import { EditorState, StateField, StateEffect } from "@codemirror/state"

// project
import "./CodeEditor.css"

////////////////////////////////////////////////////////////

export interface CodeEditorProps {
  onReady: (api: CodeEditorApi) => void,
  children: string, // editor contents
}

export interface CodeEditorApi {
  getCurrentText: () => string 
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
        selectionPanelPlugin()
      ],
      parent: editorElt!
    });

    props.onReady({
      getCurrentText: () => editor.state.doc.toString()
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