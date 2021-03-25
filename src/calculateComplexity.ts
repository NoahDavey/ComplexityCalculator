function calculateComplexity(func: Function): number {
    let complexity = 1; // Base complexity is 1
    const functionString = func.toString();
    // const totalBranchingStatements = (functionString.match(/else if|if|else/gm) || []).length;
    const regex = new RegExp(/else(?=( {|{))|else if(?=( \(|\())|if(?=(\(| \())/gm);
    const totalBranchingStatements = (functionString.match(regex) || []).length;

    complexity += totalBranchingStatements;

    return complexity;
}


function abc(something: number) {
    if(something) {
        return 1
    } else if (!something) {
        return 2
    } else {
        console.log('or else!');
        return 3
    }
}

console.log(calculateComplexity(abc));








