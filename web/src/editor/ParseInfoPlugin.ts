// codemirror
import { EditorView } from "codemirror";
import { ViewPlugin, Decoration, DecorationSet, ViewUpdate } from "@codemirror/view";
import { SelectionRange, EditorState } from "@codemirror/state";
import { HasSpan } from "../syntax/Expr";

////////////////////////////////////////////////////////////

const underlineMark = Decoration.mark({class: "cm-underline"});

export function parseTreePlugin(
  notifyDocChanged: () => void,
  infoAt: (selection: SelectionRange) => HasSpan | null
) {

  const plugin = ViewPlugin.fromClass(class {
    decorations: DecorationSet;

    constructor(_view: EditorView) {
      this.decorations = Decoration.set([]);

      // compute parse info for the first time
      notifyDocChanged();
    }

    updateInfo(state: EditorState): void {
      const info = infoAt(state.selection.main);
      if(info) {
        const [from,to] = info.span;
        this.decorations = Decoration.set([{ from, to, value: underlineMark }]);
      } else {
        this.decorations = Decoration.set([]);
      }
    }

    update(update: ViewUpdate) {
      // notify when document changed
      if(update.docChanged) {
        notifyDocChanged();
      }
      
      // display info for current selection
      if(update.selectionSet || update.docChanged) {
        this.updateInfo(update.state);
      }
    }
  }, {
    decorations: v => v.decorations
  });

  return [
    plugin
  ];
}
