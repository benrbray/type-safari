// codemirror
import { EditorView } from "codemirror"
import { ViewPlugin, Decoration, DecorationSet, ViewUpdate } from "@codemirror/view"
import { SelectionRange, StateField, StateEffect } from "@codemirror/state"
import { Example } from "../worker/workerApi";

////////////////////////////////////////////////////////////

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

  // const viewPlugin = ViewPlugin.define((view: EditorView) => ({
  //   update(update) {
  //     // notify when document changed
  //     if(update.docChanged) { notifyDocChanged(); }
      
  //     // display info for current selectoin
  //     if(update.selectionSet) {
  //       const info = infoAt(update.state.selection.main);
  //       if(info) {
  //         const [from,to] = info?.span;
  //         view.dispatch({ effects: [setUnderline.of({ from, to })] });
  //         console.log(info);
  //       }
  //     }
  //   }
  // }));

  return [
    plugin,
    //underlineField
  ];
}

////////////////////////////////////////////////////////////

const underlineMark = Decoration.mark({class: "cm-underline"})

export const setUnderline = StateEffect.define<{from: number, to: number}>({
  map: ({from, to}, change) => ({from: change.mapPos(from), to: change.mapPos(to)})
})

// export const underlineField = StateField.define<DecorationSet>({
//   create() {
//     return Decoration.none
//   },
//   update(underlines, tr) {
//     underlines = underlines.map(tr.changes)
//     for (let e of tr.effects) if (e.is(setUnderline)) {
//       underlines = underlines.update({
//         filter: () => false, // clear all previous
//         add: [underlineMark.range(e.value.from, e.value.to)]
//       });
//       console.log(underlines);
//     }
//     return underlines
//   },
//   provide: f => EditorView.decorations.from(f)
// })
