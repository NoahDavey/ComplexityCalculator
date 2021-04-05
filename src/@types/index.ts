import { Disposable } from "vscode";

export interface CodeLensInfo {
	lineNumber: number,
	codeLens: Disposable
}

export interface FunctionInfo {
	startLine: number,
	endLine: number,
	functionText: string
}

export interface HoverInfo {
	lineNumber: number, 
	hover: Disposable
}