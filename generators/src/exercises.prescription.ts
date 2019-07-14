
import assert from "@gerhobbelt/power-assert";

// import Exercise from "exercise";

class Exercise {
	pages: number;
	columns: number;
	rows: number;
	lines: number;

	constructor() {

	}

	// Produce a total of 4 rows of 3 groups (columns) of 5 sums each (a single page):
	layout(pages: number, columns: number, rows: number, lines: number) {
		this.pages = pages;
		this.columns = columns;
		this.rows = rows;
		this.lines = lines;

		return this;
	}


	// now address only the top row (group)
	selectRow(row: number) {
		return this;
	}

	// select remaining rows
	selectUnconfiguredRows() {
		return this;
	}

	// As some slots may not contain valid sums 
	// (i.e. sums which failed one or more of the given criteria),
	// we wish to select those:
	selectFailedSlots() {
		return this;
	}


	// copy all criteria from row #1
	copyCriteria(spec) {
		return this;
	}


	// all sums should have 2 operands, not less, nor more
	//
	// and adjust this row's number of operands to 2 or 3, i.e. a random mix 
	// of sums like the ones in rows #1 and #2
	operandCount(minimumCount: number, maximumCount?: number) {
		return this;
	}

	// while the only acceptable operator in those sums is the ADD operator
	operators(...ops) {
		return this;
	}

	// all terms should be within the range [1..10]
	operandLimits(minimum: number, maximum: number) {
		return this;
	}

	// every sum should have a result value within the range [1..10]
	resultLimits(minimum: number, maximum: number) {
		return this;
	}

	// we don't accept duplicate sums in the set-to-be-generated
	noDuplicates() {
		return this;
	}


	// before generating the sums, we *may* "seed" the operands
	seedOperands() {
		return this;
	}

	// and reseed their operands
	reseedOperands() {
		return this;
	}

	// then we generate (and calculate) the sums
	generate() {
		return this;
	}

	// print the generated sums to output (string)
	print() {
		return "bugger!";
	}
}



// 
// language to describe the exercises to be generated:
// 
let e = new Exercise();

e
// Produce a total of 4 rows of 3 groups (columns) of 5 sums each (a single page):
.layout(1, 4, 3, 5)
// now address only the top row (group)
.selectRow(1)
// all sums should have 2 operands, not less, nor more
.operandCount(2)
// while the only acceptable operator in those sums is the ADD operator
.operators("+")
// all terms should be within the range [1..10]
.operandLimits(1, 10)
// every sum should have a result value within the range [1..10]
.resultLimits(1, 10)

e
// select row/group #2
.selectRow(2)
// copy all criteria from row #1
.copyCriteria({ row: 1 })
// and adjust this row's number of operands to 3
.operandCount(3)

e
// select remaining rows
.selectUnconfiguredRows()
// copy all criteria from row #1
.copyCriteria({ row: 1 })
// and adjust this row's number of operands to 2 or 3, i.e. a random mix 
// of sums like the ones in rows #1 and #2
.operandCount(2, 3)

e
// we don't accept duplicate sums in the set-to-be-generated
.noDuplicates()

e
// before generating the sums, we *may* "seed" the operands
.seedOperands()
// then we generate (and calculate) the sums
.generate()

e
// As some slots may not contain valid sums 
// (i.e. sums which failed one or more of the given criteria),
// we wish to select those:
.selectFailedSlots()
// and reseed their operands
.reseedOperands()
// then we generate (and calculate) the sums
.generate()

let output = e
// print the generated sums to output (string)
.print()

console.log(output);
