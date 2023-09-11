import { langHighlight, langSupport } from '../../lezer/lang';
import { onMount } from 'solid-js';
import { EditorView, basicSetup } from "codemirror"

import "./CodeEditor.css"

////////////////////////////////////////////////////////////

export interface CodeEditorProps {
  onReady: (api: CodeEditorApi) => void 
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
      doc: "-- compute |x|+1\nlet inc = (\\x -> x + 1) in\nlet abs = (\\x -> if x > 0 then x else -x) in\n(\\x -> inc (abs x))",
      extensions: [
        basicSetup,
        langSupport(),
        langHighlight
      ],
      parent: editorElt!
    });

    props.onReady({
      getCurrentText: () => editor.state.doc.toString()
    });
  })

  return (<div ref={editorElt}></div>);
}