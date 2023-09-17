// codemirror
import { EditorView } from "codemirror";
import { ViewPlugin, Decoration, DecorationSet, ViewUpdate } from "@codemirror/view";
import { SelectionRange } from "@codemirror/state";
import { Expr } from "../syntax/Expr";

////////////////////////////////////////////////////////////

const underlineMark = Decoration.mark({class: "cm-underline"});

export function parseTreePlugin(
  notifyDocChanged: () => void,
  infoAt: (selection: SelectionRange) => Expr | null
) {
  const plugin = ViewPlugin.fromClass(class {
    decorations: DecorationSet;

    constructor(view: EditorView) {
      this.decorations = Decoration.set([]);
    }

    update(update: ViewUpdate) {
      // notify when document changed
      if(update.docChanged) {
        notifyDocChanged();
      }
      
      // display info for current selectoin
      if(update.selectionSet || update.docChanged) {
        const info = infoAt(update.state.selection.main);
        if(info) {
          const [from,to] = info.span;
          this.decorations = Decoration.set([{ from, to, value: underlineMark }]);
        } else {
          this.decorations = Decoration.set([]);
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
