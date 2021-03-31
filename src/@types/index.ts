import { Disposable } from "vscode";


export interface CodeLensInfo {
	lineNumber: number,
	codeLens: Disposable
}