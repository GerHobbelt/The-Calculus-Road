"use strict";

//
// generate addition from 1 to 10, i.e. output is `a + b` format.
//
// instead of a full-blown AST, we output a Reverse Polish Notation Array to represent the generated AST:
// 
// ```
// [a, b, '+']
// ```
// 
// 
// STATUS bits:
// 0: failure: could not complete construction
// 1: failure: ...
// 
// A zero status value means the Expression is OK...
// 
class Expression {
  constructor() {
    this.ast = [];
    this.termSeeds = [];
    this.tweakedTerms = [];
    this.result = NaN;
    this.status = 0;
  }

}
//# sourceMappingURL=001-addition-1-to-10.js.map