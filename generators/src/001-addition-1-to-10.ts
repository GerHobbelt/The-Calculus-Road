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
	public ast = [];

	public termSeeds = [];
	public tweakedTerms = [];

	public result: number = NaN;
	public status: number = 0;

	constructor() {

	}

/*

  	add(term: Expression) {
		if (seed != null) {
			// seed is an AST: use it
			let seedValue = seed.result;
			let seedStatus = seed.status;
			
			if (seedStatus !== 0) {
				let newResult = result + seedValue;

				result += seedValue;
				status = Math.max(status, seedStatus);	
				term = seed_result;
			} else {
				term = this.produceValue(1, 10);
			}
		}
	}

// 8 * 7 + 35      ? <= 100     Y
// 8 * 7 + 6 * 9   ? <= 100     N
 
	addUpToLimit(upperLimit: number, seed: Expression) {
		if (seed != null) {
			// seed is an AST: use it
			let seedValue = seed.result;
			let seedStatus = seed.status;
			
			if (seedStatus !== 0) {
				let newResult = result + seedValue;

				result += seedValue;
				status = Math.max(status, seedStatus);	
				term = seed_result;
			} else {
				term = this.produceValue(1, 10)
			}
		}
	}
*/
}




