import { Hover, HoverProvider, ProviderResult, Range } from "vscode";

class ComplexityHoverProvider implements HoverProvider {
    _startLine = 0;
    _startChar = 0;
    _endLine = 0;
    _endChar = 0;
    _complexity = 0;

    constructor(
    	startLine: number, 
    	startChar: number, 
    	endLine: number, 
    	endChar: number,
    	complexity: number
    ) {
    	this._startLine = startLine;
    	this._startChar = startChar;
    	this._endLine = endLine;
    	this._endChar = endChar;
    	this._complexity = complexity;
    }

    provideHover(): ProviderResult<Hover> {
    	let position = new Range(this._startLine, this._startChar, this._endLine, this._endChar);

    	return new Hover(`Cyclometric complexity: ${this._complexity}`, position);
    }
}

export default ComplexityHoverProvider;