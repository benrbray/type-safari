// codemirror
import { EditorView } from "codemirror"
import { ViewPlugin, Decoration, DecorationSet, ViewUpdate } from "@codemirror/view"
import { SelectionRange } from "@codemirror/state"
import { Example } from "../worker/workerApi";

////////////////////////////////////////////////////////////

const underlineMark = Decoration.mark({class: "cm-underline"});

export function parseTreePlugin(
  notifyDocChanged: () => void,
  infoAt: (selection: SelectionRange) => Example.Expr|null
) {
  const plugin = ViewPlugin.fromClass(class {
    decorations: DecorationSet;

    constructor(view: EditorView) {
      this.decorations = Decoration.set([{ from: 0, to: 2, value: underlineMark }]);
    }

    update(update: ViewUpdate) {
      // notify when document changed
      if(update.docChanged) { notifyDocChanged(); }
      
      // display info for current selectoin
      if(update.selectionSet) {
        const info = infoAt(update.state.selection.main);
        if(info) {
          const [from,to] = info?.span;

          this.decorations = this.decorations.update({
            filter: () => false, // clear all previous
            add: [underlineMark.range(from, to)]
          });
          console.log("update", from, to);
        }
      }
    }
  }, {
    decorations: v => v.decorations
  });

  return [
    plugin
  ];
}
