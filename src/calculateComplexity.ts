function calculateComplexity(func: string): number {
	let complexity = 1; // Base complexity is 1
	const regex = new RegExp(/else(?=( {|{))|else if(?=( \(|\())|if(?=(\(| \())/gm);
	const totalBranchingStatements = (func.match(regex) || []).length;

	complexity += totalBranchingStatements;

	return complexity;
}

export {
	calculateComplexity
};








