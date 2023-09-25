export type Span    = [number, number];
export type HasSpan = { span : Span };


/** @returns `true` if span `a` contains span `b` */
const contains = ([a1,a2]: Span, [b1,b2]: Span): boolean => {
  return (b1 >= a1 && b2 < a2);
}

////////////////////////////////////////////////////////////

export type LocatedTree<T extends HasSpan> = {
  tree: T
  subTrees: (node: T) => T[]
}

/** Returns the smallest subexpression containing the given range. */ 
export const treeSpanQuery = <T extends HasSpan>(query: [number,number], tree: LocatedTree<T>): T => {
  const { tree: root, subTrees } = tree;

  function helper(query: [number,number], node: T): T {
    // check if any subexpr contains query
    for(let subNode of subTrees(node)) {
      if(contains(subNode.span, query)) {
        return helper(query, subNode);
      }
    }
    // otherwise return current node
    return node;
  }

  return helper(query, root);
}

////////////////////////////////////////////////////////////

export type Type = PolyType;

export type MonoType
  = TypeVar
  | TypeMetaVar
  | TypeCon
  | TypeArr

export type PolyType = HasSpan & {
  tag: "PolyType"
  tvs: string[]
  type: RhoType
}

export type RhoType
  = RhoMono
  | RhoArr

export type RhoMono = HasSpan & {
  tag: "RhoMono",
  type: MonoType
};

export type RhoArr = HasSpan & {
  tag: "RhoArr",
  t1: PolyType,
  t2: PolyType
};

export type TypeVar     = HasSpan & { tag: "TypeVar",     name: string };
export type TypeMetaVar = HasSpan & { tag: "TypeMetaVar", name: string };
export type TypeCon     = HasSpan & { tag: "TypeCon",     name: string };
export type TypeArr     = HasSpan & {
  tag: "TypeArr",
  t1: Type,
  t2: Type
};

export type TypeFragment = MonoType | RhoType | PolyType

export const typeSubExprs = (t: TypeFragment): TypeFragment[] => {
  if(t.tag === "PolyType") { return [t.type];     }
  if(t.tag === "RhoMono")  { return [t.type];     }
  if(t.tag === "RhoArr")   { return [t.t1, t.t2]; }
  if(t.tag === "TypeArr")  { return [t.t1, t.t2]; }
  else                     { return [];           }
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
export const exprSubTerms = (e: Expr): Expr[] => {
  if(e.tag === "BinExpr") {
    return [
      e.left,
      e.right,
    ];
  } else if(e.tag === "LetExpr") {
    return [
      /* TODO Name is not an expr, so return what? */
      e.equal,
      e.in,
    ];
  } else if(e.tag === "LamExpr") {
    return [
      /* TODO Name is not an expr, so return what? */
      e.body
    ];
  } else if(e.tag === "IfExpr") {
    return [
      e.econ,
      e.etru,
      e.efls
    ];
  } else if(e.tag === "App") {
    return [
      e.e1,
      e.e2
    ];
  }
  return [];
}