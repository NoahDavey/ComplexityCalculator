function calculateComplexity(func: string): number {
	let complexity = 1; // Base complexity is 1
	const regex = new RegExp(/else(?=( ?{))|(else if|if)(?=( ?\([A-z !=%0-9()]*\) ?{))/gm);
	const totalBranchingStatements = (func.match(regex) || []).length;

	complexity += totalBranchingStatements;

	return complexity;
}

export {
	calculateComplexity
};








