export type Span    = [number, number];
export type HasSpan = { span : Span };


/** @returns `true` if span `a` contains span `b` */
const contains = ([a1,a2]: Span, [b1,b2]: Span): boolean => {
  return (b1 >= a1 && b2 < a2);
}

////////////////////////////////////////////////////////////

export type Expr    = Var | Lit | LamExpr | LetExpr | BinExpr | IfExpr | App;

export type Var = HasSpan & { tag: "Var", name: string };
export type Lit   = HasSpan & { tag: "Lit", value: string };

export type BinExpr = HasSpan & { tag: "BinExpr", op: string, left: Expr, right: Expr }

export type LetExpr = HasSpan & {
  tag: "LetExpr",
  name: { name: string, span: Span },
  equal: Expr,
  in: Expr
}

export type LamExpr = HasSpan & {
  tag: "LamExpr",
  name: { name: string, span: Span },
  body: Expr,
}

export type App = HasSpan & {
  tag: "App",
  e1: Expr,
  e2: Expr
}

export type IfExpr = HasSpan & {
  tag: "IfExpr",
  econ: Expr,
  etru: Expr,
  efls: Expr
}

////////////////////////////////////////////////////////////

/** Given an expression, returns its nested subexpressions. */
const subExprs = (e: Expr): [Span, Expr][] => {
  if(e.tag === "BinExpr") {
    return [
      [e.left.span, e.left],
      [e.right.span, e.right],
    ];
  } else if(e.tag === "LetExpr") {
    return [
      /* TODO Name is not an expr, so return what? */
      [e.equal.span, e.equal],
      [e.in.span, e.in],
    ];
  } else if(e.tag === "LamExpr") {
    return [
      /* TODO Name is not an expr, so return what? */
      [e.body.span, e.body]
    ];
  } else if(e.tag === "IfExpr") {
    return [
      [e.econ.span, e.econ],
      [e.etru.span, e.etru],
      [e.efls.span, e.efls]
    ];
  } else if(e.tag === "App") {
    return [
      [e.e1.span, e.e1],
      [e.e2.span, e.e2]
    ];
  }
  return [];
}

/** Returns the smallest subexpression containing the given range. */ 
export const subexprAt = (query: [number,number], node: Expr): Expr => {
  for(let [nodeSpan, subNode] of subExprs(node)) {
    if(contains(nodeSpan, query)) {
      return subexprAt(query, subNode);
    }
  }

  // by default, return current node
  return node;
}