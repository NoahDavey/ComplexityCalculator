import { CodeLens, CodeLensProvider, Command, Range, TextDocument } from "vscode";

class MyCodeLensProvider implements CodeLensProvider {
    _startLine = 0;
    _startChar = 0;
    _endLine = 0;
    _endChar = 0;
	_functionName = '';

	constructor(startLine: number, startChar: number, endLine: number, endChar: number, functionName: string) {
    	this._startLine = startLine;
    	this._startChar = startChar;
    	this._endLine = endLine;
    	this._endChar = endChar;
		this._functionName = functionName;
	}

	async provideCodeLenses(document: TextDocument): Promise<CodeLens[]> {
    	let position = new Range(this._startLine, this._startChar, this._endLine, this._endChar);

    	let c: Command = {
    		command: 'ComplexityCalculator.calculateComplexity',
    		title: `Function Complexity: ${this._functionName}`
    	};

    	let codeLens = new CodeLens(position, c);

    	return [codeLens];
	}
}

export default MyCodeLensProvider;