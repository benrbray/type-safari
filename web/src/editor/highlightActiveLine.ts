import { Extension } from "@codemirror/state"
import { EditorView, Decoration, DecorationSet, ViewPlugin, ViewUpdate } from "@codemirror/view"

// adapted from @codemirror/view
// https://github.com/codemirror/view/blob/88dafff90c6bad145ce0f339a503ee5194cd8cbc/src/active-line.ts#L9

/**
 * Mark lines that have a cursor on them with the `"cm-activeLine"` DOM class.
 */
export function highlightActiveLine(): Extension {
  return activeLineHighlighter
}

const lineDeco = Decoration.line({class: "cm-activeLine"})

const activeLineHighlighter = ViewPlugin.fromClass(class {
  decorations: DecorationSet

  constructor(view: EditorView) {
    this.decorations = this.getDeco(view)
  }

  update(update: ViewUpdate) {
    if (update.docChanged || update.selectionSet || update.focusChanged) this.decorations = this.getDeco(update.view)
  }

  getDeco(view: EditorView) {
    let lastLineStart = -1, deco = [];
    
    if(view.hasFocus) {
      for (let r of view.state.selection.ranges) {
        let line = view.lineBlockAt(r.head)
        if (line.from > lastLineStart) {
          deco.push(lineDeco.range(line.from))
          lastLineStart = line.from
        }
      }
    }

    return Decoration.set(deco)
  }
}, {
  decorations: v => v.decorations
})