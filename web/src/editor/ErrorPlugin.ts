// codemirror
import { StateField, StateEffect, Extension, ChangeSet, ChangeDesc} from "@codemirror/state";
import { linter, Diagnostic, lintGutter } from "@codemirror/lint";

////////////////////////////////////////////////////////////////////////////////

export const errorPlugin = (): Extension[] => {
  let parseErrorLinter = linter(view => {
    let errors = view.state.field(parseErrorField);
    
    return errors.map<Diagnostic>(error =>
      ({
        from: error.range.from,
        to: error.range.to,
        severity: "error",
        message: error.message,
        actions: []
      })
    );
  });
  
  return [
    parseErrorLinter,
    parseErrorField.init(() => []),
    lintGutter(),
  ];
}

/* ---- effects ------------------------------------------------------------- */

export const addError = StateEffect.define<ErrorInfo>({
  map: (error, change) => {
    return mapErrorInfo(change)(error);
  }
});

export const clearErrors = StateEffect.define();

////////////////////////////////////////////////////////////////////////////////

export type ErrorInfo = {
  type: "ParseError"
  message: string,
  range: { from: number, to: number }
}

const mapErrorInfo = (change: ChangeSet | ChangeDesc) => (error: ErrorInfo): ErrorInfo => {
  return {
    ...error,
    range: {
      from: change.mapPos(error.range.from), 
      to: change.mapPos(error.range.to)
    }
  }
}

export const parseErrorField = StateField.define<ErrorInfo[]>({
  create() { return []; },
  update(errors, tr) {
    errors = errors.map(mapErrorInfo(tr.changes));

    // change error set in response to effects
    for(let eff of tr.effects) {
      if(eff.is(addError)) {
        errors.push(eff.value);
      } else if(eff.is(clearErrors)) {
        errors = [];
      }
    }
    
    return errors;
  }
});