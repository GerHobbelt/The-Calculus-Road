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

/*

class Expression() {
	public ast = [];
	public result: number = NaN;
	public status: number = 0;

	function add(term: Expression) {
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
 
	function addUpToLimit(upperLimit: number, seed: Expression) {
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
}

*/





// 
// ## Converting a floating point value to a fraction
// 
// ### The Stern–Brocot tree: Mediants and binary search (Wikipedia)
// 
// The Stern–Brocot tree forms an infinite binary search tree with respect to the usual ordering 
// of the rational numbers. The set of rational numbers descending from a node q is defined by the 
// open interval (Lq,Hq) where Lq is the ancestor of q that is smaller than q and closest to it 
// in the tree (or Lq = 0 if q has no smaller ancestor) while Hq is the ancestor of q that is 
// larger than q and closest to it in the tree (or Hq = +∞ if q has no larger ancestor).
// 
// The path from the root 1 to a number q in the Stern–Brocot tree may be found by a binary 
// search algorithm, which may be expressed in a simple way using mediants. Augment the 
// non-negative rational numbers to including a value 1/0 (representing +∞) that is by definition 
// greater than all other rationals. The binary search algorithm proceeds as follows:
// 
//     Initialize two values L and H to 0/1 and 1/0, respectively.
//     Until q is found, repeat the following steps:
//         Let L = a/b and H = c/d; compute the mediant M = (a + c)/(b + d).
//         If M is less than q, then q is in the open interval (M,H); replace L by M and continue.
//         If M is greater than q, then q is in the open interval (L,M); replace H by M and continue.
//         In the remaining case, q = M; terminate the search algorithm.
// 
// The sequence of values M computed by this search is exactly the sequence of values on the path 
// from the root to q in the Stern–Brocot tree. Each open interval (L,H) occurring at some step in 
// the search is the interval (LM,HM) representing the descendants of the mediant M. The parent of 
// q in the Stern–Brocot tree is the last mediant found that is not equal to q.
// 
// This binary search procedure can be used to convert floating-point numbers into rational numbers. 
// By stopping once the desired precision is reached, floating-point numbers can be approximated to 
// arbitrary precision.[3] If a real number x is approximated by any rational number a/b that is not 
// in the sequence of mediants found by the algorithm above, then the sequence of mediants contains 
// a closer approximation to x that has a denominator at most equal to b; in that sense, these 
// mediants form the best rational approximations to x.
// 
// The Stern–Brocot tree may itself be defined directly in terms of mediants: the left child of any 
// number q is the mediant of q with its closest smaller ancestor, and the right child of q is the 
// mediant of q with its closest larger ancestor. In this formula, q and its ancestor must both be 
// taken in lowest terms, and if there is no smaller or larger ancestor then 0/1 or 1/0 should be 
// used respectively. Again, using 7/5 as an example, its closest smaller ancestor is 4/3, so its 
// left child is (4 + 7)/(3 + 5) = 11/8, and its closest larger ancestor is 3/2, so its right child 
// is (7 + 3)/(5 + 2) = 10/7. 
// 

let totals = 0;

const power = 10;
const altPower = 1.3;		

function convertFloatToFraction(value, largestDenominator) {
	// Only traverse the part of the Stern-Bocot tree that spans value range <0, 1>:
	// all the higher fractions can be reduced to this range by first extracting the
	// integer part of the value, hence the SB start value `d` has been adjusted 
	// accordingly from 0 to 1:
	let a = 0, b = 1, c = 1, d = 1;

	let integerPart = Math.round(value);
	// calc remainder:
	let fracValue = value - integerPart;

	largestDenominator = largestDenominator || Infinity;
	// Because we don't want to run into fruitless long inner loop runs (see further below),
	// where the `md` value *may* become extremely large (Infinity), we slightly tweak the
	// `largestDenominator` edge condition, so that we exit those inner loops once we hit 
	// an Infinite-sized denominator in there. For this purpose we must tweak the 
	// `largestDenominator` edge constant:
	largestDenominator++;

	console.log("Test FloatToFraction:", value, largestDenominator);

	// The achievable accuracy of the conversion is *not* 0.5/largestDenominator
	// as for any largestDenominator, we can legally test *any* denominator from
	// 1 .. largestDenominator, (possibly) many fraction values of which will lie between
	// a/largestDenominator and (a+1)/largestDenominator.
	// 
	// So what *is* our achievable accuracy then? That depends... Because the fractions
	// we may legally test don't distribute such that all distances are the same, we
	// need to reckon with a variable accuracy, which at least equals or surpasses 0.5/largestDenominator.
	// 
	// An example: largestDenominator=5, testing a value between 0 and 1, gives the
	// total set of testable fractions:
	// 0/1, 1/1 = 1, 1/2 = 0.5, 1/3 = 0.3/3/..., 2/3 = 0.6/6/..., 1/4 = 0.25, 3/4 = 0.75,
	// 1/5 = 0.2, 2/5 = 0.4, 3/5 = 0.6 and 4/5 = 0.8
	// 
	// Order these by value:
	// 0, 0.2, 0.25, 0.33..., 0.4, 0.5, 0.6, 0.66..., 0.75, 0.8, 1.0
	// and the varying gaps between these values is immediately obvious. Accuracy of the
	// conversion will vary accordingly:
	// 0.1, 0.025, 0.0415..., 0.033..., 0.05 (this sequence mirrors at value 0.5)
	// while accuracy estimate 0.5/largestDenominator = 0.5/5 = 0.1, which is shown here
	// to be the **upper limit** of the achievable accuracy for the conversion.
	// 
	// Thus the question then remains: will the Stern-Brocot binary search algorithm
	// above provide us with the **closest approximation**? If I read the theory pages
	// correctly, the answer is YES.
	//      

	let j = 0;
	
	let lCount = 0;
	let rCount = 0;
	let lMsg, rMsg;
	let IEEE754CalcPrecLimitReached = false;

	const loopLimit = 1e6;

	// use a 'ridiculous' loop limit, so that we **will** terminate in 
	// human-reasonable time (a minute at most), while we allow the 
	// SB tree walk with the run-length optimization (see further below)
	// to run its course till we hit IEEE754 64-bit FP precision limits.
	for (let i = 0; i < loopLimit; i++) {
		let medianNumerator = a + c;
		let medianDenominator = b + d;
		if (medianDenominator >= largestDenominator || IEEE754CalcPrecLimitReached) {
			let m1 = a / b;
			let m2 = c / d;
			// console.log("hitting denominator limits:", value - m1, m2 - value, (m2 + m1) / 2, (m2 + m1) / 2 - value);
			totals += i + j;
			if (value - m1 < m2 - value) {
				console.log(`APPROXIMATE match`, m1, value, `diff = ${m1 - value}`, `${a} / ${b}`, `rounds: outer = ${i}, inner = ${j}, total = ${i + j}`);
				return [m1, a, b];
			} else if (value - m1 > m2 - value) {
				console.log(`APPROXIMATE match`, m2, value, `diff = ${m2 - value}`, `${c} / ${d}`, `rounds: outer = ${i}, inner = ${j}, total = ${i + j}`);
				return [m2, c, d];
			} else if (b < d) {
				console.log(`=APPROXIMATE= match`, m1, value, `diff = ${m1 - value}`, `${a} / ${b}`, `rounds: outer = ${i}, inner = ${j}, total = ${i + j}`);
				return [m1, a, b];
			} else {
				console.log(`=APPROXIMATE= match`, m2, value, `diff = ${m2 - value}`, `${c} / ${d}`, `rounds: outer = ${i}, inner = ${j}, total = ${i + j}`);
				return [m2, c, d];
			}
		}
		let median = medianNumerator / medianDenominator;
		let diff = (median - value);
		// console.log(`iterator ${i}: diff: ${diff}, a: ${a}, b: ${b}, c: ${c}, d: ${d}`);

		if (median === value) {
			if (rCount) {
				console.log(`R^${rCount} --> fractions ${rMsg}`);
				rCount = 0;
			}
			else if (lCount) {
				console.log(`L^${lCount} --> fractions ${lMsg}`);
				lCount = 0;
			}

			totals += i + j;
			console.log(`match`, median, `${medianNumerator} / ${medianDenominator}`, `rounds: outer = ${i}, inner = ${j}, total = ${i + j}`);
			return [median, medianNumerator, medianDenominator];
		}
		else if (median < value) {
			if (lCount) {
				console.log(`L^${lCount} --> fractions ${lMsg}`);
				lCount = 0;
			}

			// Check if we're running into a series of R moves:
			// if we do, we might run the risk of running a *long* series
			// of those in the main loop, unless we speed it up here
			// by testing quickly approximately how many sequential R
			// moves we'll encounter here by exponentially growing the
			// number of additional R moves in `count`:  
			let count = 1;
			let mn = c + medianNumerator;
			let md = d + medianDenominator;
			let m2 = mn / md;
			console.log("R-branch start", a, b, c, d, mn, md, m2);
			if (m2 < value) {
				// To hit 'edge cases' such as 1e-100 and 1e+100 faster, we test multiple powers, exponentially
				// degrading the power (rather: multiplier) until we can do no more:
				let multiplier = 1e7 + randFloat2(1e6);
				for (let expectLastRound = loopLimit; expectLastRound !== 0; expectLastRound--) {
					let prevCount;
					
					do {
						j++;
						prevCount = count;
						count *= multiplier;
						let mult = Math.round(count);
						mn = mult * c + medianNumerator;
						md = mult * d + medianDenominator;
						m2 = mn / md;
						// console.log(`R-count`, count, multiplier, expectLastRound, m2 - value, mn - a, md - b);
					} while (m2 < value && md < largestDenominator);

					count = prevCount;

					multiplier /= power;
					if (multiplier < altPower && expectLastRound > 1) {
						multiplier = altPower;
						expectLastRound = 2; // will be decremented to 1 immediately by the for() loop
					}
				}

				let mult = Math.round(count);
				mn = mult * c + medianNumerator;
				md = mult * d + medianDenominator;

				console.log(`R^${count+1} --> fractions ${a} / ${b} --> ${mn} / ${md} <> ${c} / ${d}`);
				rCount += mult + 1;
				rMsg = `${mn} / ${md} <> ${c} / ${d}`;

				// Check if we hit the IEE754 calculus precision limits:
				if (a === mn && b === md) {
					console.log(`IEEE754 precision limits reached: fractions ${a} / ${b} --> ${mn} / ${md} <> ${c} / ${d}`);
					IEEE754CalcPrecLimitReached = true;
				}
				a = mn;
				b = md;
			} else {
				// console.log(`R^1 --> fractions ${medianNumerator} / ${medianDenominator} <> ${c} / ${d}`);
				rCount++;
				rMsg = `${medianNumerator} / ${medianDenominator} <> ${c} / ${d}`;

				a = medianNumerator;
				b = medianDenominator;
			}
		}
		else {
			if (rCount) {
				console.log(`R^${rCount} --> fractions ${rMsg}`);
				rCount = 0;
			}

			// Check if we're running into a series of L moves:
			// if we do, we might run the risk of running a *long* series
			// of those in the main loop, unless we speed it up here
			// by testing quickly approximately how many sequential L
			// moves we'll encounter here by exponentially growing the
			// number of additional L moves in `count`:  
			let count = 1;
			let mn = a + medianNumerator;
			let md = b + medianDenominator;
			let m2 = mn / md;
			console.log("L-branch start", a, b, c, d, mn, md, m2);
			if (m2 > value) {
				// To hit 'edge cases' such as 1e-100 and 1e+100 faster, we test multiple powers, exponentially
				// degrading the power (rather: multiplier) until we can do no more:
				let multiplier = 1e7 + randFloat2(1e6);
				for (let expectLastRound = loopLimit; expectLastRound !== 0; expectLastRound--) {
					let prevCount;
					
					do {
						j++;
						prevCount = count;
						count *= multiplier;
						let mult = Math.round(count);
						mn = mult * a + medianNumerator;
						md = mult * b + medianDenominator;
						m2 = mn / md;
						// console.log(`L-count`, count, multiplier, expectLastRound, m2 - value, mn - c, md - d);
					} while (m2 > value && md < largestDenominator);

					count = prevCount;

					multiplier /= power;
					if (multiplier < altPower && expectLastRound > 1) {
						multiplier = altPower;
						expectLastRound = 2; // will be decremented to 1 immediately by the for() loop
					}
				}

				let mult = Math.round(count);
				mn = mult * a + medianNumerator;
				md = mult * b + medianDenominator;

				console.log(`L^${count+1} --> fractions ${a} / ${b} <> ${mn} / ${md} <-- ${c} / ${d}`);
				lCount += mult + 1;
				lMsg = `${a} / ${b} <> ${mn} / ${md}`;

				// Check if we hit the IEE754 calculus precision limits:
				if (c === mn && d === md) {
					console.log(`IEEE754 precision limits reached: fractions ${a} / ${b} <> ${mn} / ${md} <-- ${c} / ${d}`);
					IEEE754CalcPrecLimitReached = true;
				}
				c = mn;
				d = md;
			} else {
				// console.log(`L^1 --> fractions ${a} / ${b} <> ${medianNumerator} / ${medianDenominator}`);
				lCount++;
				lMsg = `${a} / ${b} <> ${medianNumerator} / ${medianDenominator}`;

				c = medianNumerator;
				d = medianDenominator;
			}
		}
	}

	if (rCount) {
		console.log(`R^${rCount} --> fractions ${rMsg}`);
		rCount = 0;
	}
	else if (lCount) {
		console.log(`L^${lCount} --> fractions ${lMsg}`);
		lCount = 0;
	}

	totals += loopLimit + j;
	console.log(`LOOP/ALGO TERMINATION`, `${a} / ${b} <> ${c} / ${d}`, `rounds: outer = ${loopLimit}, inner = ${j}, total = ${loopLimit + j}`);
}




// https://stackoverflow.com/questions/1640258/need-a-fast-random-generator-for-c
// http://www.cse.yorku.ca/~oz/marsaglia-rng.html
// 
// set the initial seed to whatever you like
let randSeed = 42;

// direct implementation of fastrand()
function randFloat2(amplitude) {  
	randSeed = (randSeed * 214013 + 2531011) & 0xFFFFFFFF;
	return randSeed * amplitude / 0x7FFFFFFF;
}  

// fast rand float, using full 32bit precision
function fastRandFloat(amplitude) {
    randSeed = (randSeed * 16807) & 0xFFFFFFFF;
	return randSeed * amplitude / 0x7FFFFFFF;
}

function randVAX(amplitude) {
	randSeed = (randSeed * 69069 + 1234567) & 0xFFFFFFFF;
	return randSeed * amplitude / 0x7FFFFFFF;
}

if (1) {
	// examples from https://planetmath.org/SternBrocotTree
	// Note the logged L/R powers are the repeating fraction coefficients (last one - 1)
	convertFloatToFraction(5/3);                 // RLR
	convertFloatToFraction(4/11);                // LLRLL
	// from https://en.wikipedia.org/wiki/Stern-Brocot_tree
	// Note the logged L/R powers are the repeating fraction coefficients (last one - 1)
	convertFloatToFraction(23/16);				 // RL2R3L ~ [1,2,3,2=1+1]
	convertFloatToFraction(13/9);				 // RL2R3 ~ [1,2,4=3+1]

	// more tests...
	// Test the 'inifinite' denominator limit, i.e. test whether we're stable while 
	// we run towards and into the IEEE754 double precision calculation precision limitations.
	convertFloatToFraction(Math.PI);
	convertFloatToFraction(Math.E);
	convertFloatToFraction(1.0000000001);
	// Testing a mantissa edge case:
	convertFloatToFraction(1.000000000000001);
	// More tests...
	convertFloatToFraction(0.20001);

	// test APPROXIMATE: close enough...
	convertFloatToFraction(0.20001, 1e3);
	convertFloatToFraction(1.987654321987654321, 1e9);
	convertFloatToFraction(1.23456789123456789123456789, 87654321); // test edge of denominator limit value
	convertFloatToFraction(1.23456789123456789123456789, 87654320); // test edge of denominator limit value
	convertFloatToFraction(1.23456789123456789123456789, 87654319); // test edge of denominator limit value
	convertFloatToFraction(Math.log(Math.PI * 100), 7505); // test edge of denominator limit value
	convertFloatToFraction(3.456789, 1e3);

	// test =APPROXIMATE=: smack dab in the middle:
	convertFloatToFraction(4.012779683161849, 1e2);

	// test faulty and edge-case inputs for stability/termination of the run:
	convertFloatToFraction(1e-300);
	convertFloatToFraction(1e300);
	convertFloatToFraction(Infinity);
	convertFloatToFraction(NaN);

	console.log("totals", totals, power, altPower);
	// console.log((randFloat2(1e6)+1e6)|0);
}
