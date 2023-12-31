
import { parser } from "./lang.grammar"
// import { parser } from "./lezer/binop.grammar"
import { foldNodeProp, foldInside, indentNodeProp } from "@codemirror/language"
import { styleTags, tags, Tag as T } from "@lezer/highlight"

import { LRLanguage, LanguageSupport, syntaxHighlighting, HighlightStyle } from "@codemirror/language"

////////////////////////////////////////////////////////////

const tagMetaVar = T.define(tags.meta);
const tagTypeVar = T.define(tags.typeName);
const tagTermVar = T.define(tags.variableName);
const tagConstraintOp = T.define(tags.compareOperator);

let parserWithMetadata = parser.configure({
  props: [
    styleTags({
      Identifier: tagTermVar,
      /* literals */
      BooleanLiteral: tags.bool,
      StringLiteral: tags.string,
      IntLiteral: tags.integer,
      /* commends */
      LineComment: tags.lineComment,
      /* operators */
      ArithOp: tags.arithmeticOperator,
      CmpOp: tags.compareOperator,
      /* keywords */
      "forall" : tags.keyword,
      "." : tags.keyword,
      "let": tags.keyword,
      "in": tags.keyword,
      "if": tags.keyword,
      "then": tags.keyword,
      "else": tags.keyword,
      "=": tags.keyword,
      "( )": tags.paren,
      Symbol: tags.punctuation,
      /* definitions */
      Lambda: tags.definitionKeyword,
      LambdaArrow: tags.definitionKeyword,
      /* types */
      MetaVar: tagMetaVar,
      TypeVar: tagTypeVar,
      TypeCon: tags.typeName,
      /* constraints */
      constraintOp: tagConstraintOp
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

export const exprLangSuport = () => {
  return new LanguageSupport(
    LRLanguage.define({
      parser: parserWithMetadata,
      languageData: {
        commentTokens: {line: "--"}
      }
    })
  )
}

export const typeLangSuport = () => {
  return new LanguageSupport(
    LRLanguage.define({
      parser: parserWithMetadata.configure({ top: "TypeLang" }),
      languageData: {
        commentTokens: {line: "--"}
      }
    })
  )
}

export const unifLangSuport = () => {
  return new LanguageSupport(
    LRLanguage.define({
      parser: parserWithMetadata.configure({ top: "UnifLang" }),
      languageData: {
        commentTokens: {line: "--"}
      }
    })
  )
}

/* ---- syntax highlighting ----------------------------- */

const colorPrimary = "#4B69C6";

const highlightStyle = HighlightStyle.define([
  {tag: tags.keyword, color: colorPrimary, fontWeight: "bold" },
  {tag: tags.definitionKeyword, color: "#72009e", fontWeight: "bold" },
  {tag: tags.comment, color: "#808080", fontStyle: "italic"},
  {tag: tags.punctuation, color: "#444", fontWeight: "bold"},
  // {tag: tagTermVar, color: "#f00", fontStyle: "italic"},
  {tag: tags.bool, color: "#088", fontStyle: "italic"},
  {tag: tags.string, color: "#080" },
  {tag: tags.integer, color: "#99006e" },
  {tag: tags.arithmeticOperator, color: colorPrimary },
  {tag: tags.compareOperator, color: colorPrimary },
  /* types */
  {tag: tags.typeName, color: "#a85800" },
  {tag: tagTypeVar },
  {tag: tagMetaVar, color: "#ff00d6" },
  /* constraints */
  {tag: tagConstraintOp, color: "#a500ff", fontWeight: "bold" }
]);

export const langHighlight = syntaxHighlighting(highlightStyle);