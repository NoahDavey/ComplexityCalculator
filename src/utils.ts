import * as vscode from 'vscode';
import { CodeLensInfo } from './@types';
import MyCodeLensProvider from './MyCodeLensProvider';


function functionOnLine(currentLineText: string): Boolean {
	// Match normal and lambda functions with parameters
	const functionRegex: RegExp = /function(?=( \w* ?\([A-z0-9, ]*\) ?{))|const \w*(?=( ?= ?\([A-z0-9, ]*\) ?=> ?{))/;

	// Should be true if function on current line, false if not
	return functionRegex.test(currentLineText);
}

const docSelector = { language: 'javascript', scheme: 'file' };
function addCodeLens(lineNumber: number, context: vscode.ExtensionContext, codeLensTracker: CodeLensInfo []) {
	let codeLensProvider = vscode.languages.registerCodeLensProvider(
		docSelector, 
		new MyCodeLensProvider(lineNumber, 0, lineNumber, 25)
	);
    
	context.subscriptions.push(codeLensProvider);
	codeLensTracker;
}

function getAllFunctionDeclarations (document: vscode.TextDocument): number [] {
	const documentArr: string[] = document.getText().split('\n');
    
	let declarations: number[] = [];
	for (const [index, line] of documentArr.entries()) {
		if(functionOnLine(line)) {
			declarations.push(index);
		};
	}
	return declarations;
}

export {
	functionOnLine,
	addCodeLens,
	getAllFunctionDeclarations
};