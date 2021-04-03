function calculateComplexity(func: Function): number {
	let complexity = 1; // Base complexity is 1
	const functionString = func.toString();
	// const totalBranchingStatements = (functionString.match(/else if|if|else/gm) || []).length;
	const regex = new RegExp(/else(?=( {|{))|else if(?=( \(|\())|if(?=(\(| \())/gm);
	const totalBranchingStatements = (functionString.match(regex) || []).length;

	complexity += totalBranchingStatements;

	return complexity;
}

export {
	calculateComplexity
};








