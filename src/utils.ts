import * as vscode from 'vscode';
import { CodeLensInfo } from './@types';
import MyCodeLensProvider from './MyCodeLensProvider';

const docSelector = { language: 'javascript', scheme: 'file' };
function addCodeLens(lineNumber: number, context: vscode.ExtensionContext, codeLensTracker: CodeLensInfo []) {
	const existingCodeLens = codeLensTracker.find(codeLens => codeLens.lineNumber === lineNumber);
	if(!existingCodeLens) {
		let codeLensProvider = vscode.languages.registerCodeLensProvider(
			docSelector, 
			new MyCodeLensProvider(lineNumber, 0, lineNumber, 25)
		);
        
		context.subscriptions.push(codeLensProvider);
		codeLensTracker.push({codeLens: codeLensProvider, lineNumber: lineNumber});
	}
}

function functionOnLine(currentLineText: string): Boolean {
	// Match normal and lambda functions with parameters
	const functionRegex: RegExp = /function(?=( \w* ?\([A-z0-9, ]*\) ?{))|const \w*(?=( ?= ?\([A-z0-9, ]*\) ?=> ?{))/;

	// Should be true if function on current line, false if not
	return functionRegex.test(currentLineText);
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

function getCurrentCodeLensPositions(codeLensTracker: CodeLensInfo []): number[] {
	return codeLensTracker.map(codeLens => codeLens.lineNumber);
}


function removeAllMovedCodeLenses(
	currentFunctionDeclarations: number[], 
	currentCodeLensPositions: number[], 
	codeLensTracker: CodeLensInfo[]
) {
	// Get an array containing line numbers of any codeLenses which have been moved/deleted 
	//(i.e. they are in code lens arr, but not function declartions)
	const linesToDelete: number[] = 
        currentCodeLensPositions.filter(idx => !currentFunctionDeclarations.includes(idx));

	// Get an array containing indexs in the codeLens tracker array to dispose of
	const codeLensesToDelete: number[] = 
        linesToDelete.map(lineNumber => codeLensTracker.findIndex(lens => lens.lineNumber === lineNumber)).reverse();

	// Loop through lenses we want to delete and dispose/remove them from codeLensTracker array
	for(const lensToDelete of codeLensesToDelete) {
		codeLensTracker[lensToDelete].codeLens.dispose();
		codeLensTracker.splice(lensToDelete, 1);
	}
}

// Given a startLine, endLine and docmentArray, returns function as a concatenated string 
function getFunctionText(startLine: number, endLine: number, documentArr: string[]): string {
	let concatenatedFunction: string = '';
	for(let line = startLine; line <= endLine; line++) {
		concatenatedFunction += documentArr[line];
	}
	
	return concatenatedFunction;
}


function extractFunctions(
	currentFunctionDeclarations: number[], 
	document: vscode.TextDocument
): string[] {
	const extractedFunctions: string[] = [];
	if(currentFunctionDeclarations) {
		// A line by line array of the current document state
		const documentArr: string[] = document.getText().split('\n');

		// For each known function declaration
		for(let i = 0; i < currentFunctionDeclarations.length; i++) {
			const currentDeclaration = currentFunctionDeclarations[i];
			const nextDeclaration = currentFunctionDeclarations[i+1] || documentArr.length - 1;
            
			// For the lines between this known declaration and the next known declaration
			let bracesCounter = 0;
			let closingBracket = undefined;
			for(let line = currentDeclaration; currentDeclaration < nextDeclaration; line++) {
				// Count the open/closed braces in each line
				const openBraces = (documentArr[line].match(/\(|{/g) || []).length; 
				const closedBraces = (documentArr[line].match(/\)|}/g) || []).length;
                
				bracesCounter += openBraces;
				bracesCounter -= closedBraces;
				// If braces counter has returned to 0, found a valid function declaration, record closing bracket line
				if(bracesCounter === 0) {
					closingBracket = line;
					break;
				}
			}

			// If we have identified a valid function, concatenate into a string and add to extractedFunctions
			if(closingBracket) {
				const funcText: string = 
					getFunctionText(currentDeclaration, closingBracket, documentArr);
				extractedFunctions.push(funcText);
			}

		}
        
	}
	return extractedFunctions;
}


export {
	functionOnLine,
	addCodeLens,
	getAllFunctionDeclarations,
	getCurrentCodeLensPositions,
	removeAllMovedCodeLenses,
	extractFunctions
};