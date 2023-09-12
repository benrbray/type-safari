
import { parser } from "./lang.grammar"
// import { parser } from "./lezer/binop.grammar"
import { foldNodeProp, foldInside, indentNodeProp } from "@codemirror/language"
import { styleTags, tags as t, Tag as T } from "@lezer/highlight"
import {tags} from "@lezer/highlight"

import { LRLanguage, LanguageSupport, syntaxHighlighting, HighlightStyle } from "@codemirror/language"

////////////////////////////////////////////////////////////

const tagMetaVar = T.define(t.variableName);
const tagTypeVar = T.define(t.variableName);
const tagTermVar = T.define(t.variableName);

let parserWithMetadata = parser.configure({
  props: [
    styleTags({
      Identifier: t.variableName,
      /* literals */
      BooleanLiteral: t.bool,
      StringLiteral: t.string,
      IntLiteral: t.integer,
      /* commends */
      LineComment: t.lineComment,
      /* operators */
      ArithOp: t.arithmeticOperator,
      CmpOp: t.compareOperator,
      /* keywords */
      "forall" : t.keyword,
      "." : t.keyword,
      "let": t.keyword,
      "in": t.keyword,
      "if": t.keyword,
      "then": t.keyword,
      "else": t.keyword,
      "=": t.keyword,
      "( )": t.paren,
      Symbol: t.punctuation,
      /* definitions */
      Lambda: t.definitionKeyword,
      LambdaArrow: t.definitionKeyword,
      /* types */
      TypeCon: t.typeName,
    }),
    indentNodeProp.add({
      // TODO (Ben @ 2023/09/12) handle indentatoin
      Application: context => context.column(context.node.from) + context.unit
    }),
    foldNodeProp.add({
      // TODO (Ben @ 2023/09/12) handle folding
      Application: foldInside
    })
  ]
})

/* ---- language support -------------------------------- */

const exampleLanguage = LRLanguage.define({
  parser: parserWithMetadata,
  languageData: {
    commentTokens: {line: ";"}
  }
})

export const langSupport = () => {
  return new LanguageSupport(exampleLanguage)
}

/* ---- syntax highlighting ----------------------------- */

const colorPrimary = "#4B69C6";

const highlightStyle = HighlightStyle.define([
  {tag: tags.keyword, color: colorPrimary, fontWeight: "bold" },
  {tag: tags.definitionKeyword, color: "#72009e", fontWeight: "bold" },
  {tag: tags.comment, color: "#808080", fontStyle: "italic"},
  {tag: tags.punctuation, color: "#444", fontWeight: "bold"},
  // {tag: tags.variableName, color: "#f00", fontStyle: "italic"},
  {tag: tags.bool, color: "#088", fontStyle: "italic"},
  {tag: tags.string, color: "#080" },
  {tag: tags.integer, color: "#99006e" },
  {tag: tags.arithmeticOperator, color: colorPrimary },
  {tag: tags.compareOperator, color: colorPrimary },
  /* types */
  {tag: tags.typeName, color: "#a85800" },
]);

export const langHighlight = syntaxHighlighting(highlightStyle);