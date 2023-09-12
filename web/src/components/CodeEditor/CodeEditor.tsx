import { langHighlight, langSupport } from '../../lezer/lang';
import { onMount } from 'solid-js';
import { EditorView, basicSetup } from "codemirror"

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