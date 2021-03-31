import * as vscode from 'vscode';
import { addCodeLens, functionOnLine } from './utils';
import { CodeLensInfo } from './@types';
import MyCodeLensProvider from './MyCodeLensProvider';

export function getAllIndexes(arr: string[], funcRegex: RegExp) {
	let indexes = [];
	for (let i = 0; i < arr.length; i++) {
		if(funcRegex.test(arr[i])) {
			indexes.push(i);
		};		
	}
	return indexes;
}

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "ComplexityCalculator" is now active!');
	let activeEditor = vscode.window.activeTextEditor;
	let codeLensTracker: CodeLensInfo [] = [];


	let disposable = vscode.commands.registerCommand('ComplexityCalculator.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		vscode.window.showInformationMessage('Hello World from Noah!!');
	});


	// let hoverProviderDisposable = vscode.languages.registerHoverProvider('javascript', {
	// 	provideHover(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken) {
	// 		// const comentCommandUri = vscode.Uri.parse(`command:editor.action.addCommentLine`)
	// 		const comentCommandUri = vscode.Uri.parse(`command:ComplexityCalculator.helloWorld`);
	// 		const contents = new vscode.MarkdownString(`[Add comment](${comentCommandUri})`);
			
	// 		contents.isTrusted = true;

	// 		return new vscode.Hover(contents);
	// 	}
	// });


	vscode.window.onDidChangeActiveTextEditor(editor => {
		activeEditor = editor;
	}, null, context.subscriptions);

	let previousFunctionDeclarations: number[] = [];
	vscode.workspace.onDidChangeTextDocument(event => {
		if(activeEditor && event.document === activeEditor.document) {
			const [change] = event.contentChanges;
			const currentLineNumber = change.range.start.line;
			const currentLineText = event.document.lineAt(currentLineNumber).text;

			
			// Find out if there is an existing code lens on current line
			const existingCodeLens = codeLensTracker.find(x => x.lineNumber === currentLineNumber);
			
			// Should be true if function on current line, false if not
			const isFunctionOnLine = functionOnLine(currentLineText);

			const documentArr: string[] = event.document.getText().split('\n');
			// const currentFunctionDeclarations = getAllIndexes(documentArr, functionRegex);
			const currentFunctionDeclarations = [1];
			
			const changedFunctionDeclarations = JSON.stringify(currentFunctionDeclarations) !== JSON.stringify(previousFunctionDeclarations);

			if(isFunctionOnLine && !existingCodeLens) {
				addCodeLens(currentLineNumber, context, codeLensTracker);
			} else if (changedFunctionDeclarations) {
				// console.log('currentFunctionDeclarations', currentFunctionDeclarations);
				console.log('previousFunctionDeclarations', previousFunctionDeclarations);
				

				// for (const codeLensProvider of codeLensTracker) {
				// 	if(!currentFunctionDeclarations.includes(codeLensProvider.lineNumber)) {
				// 		codeLensProvider.codeLens.dispose();
				// 		codeLensProvider = undefined;
				// 	}
				// }

				// for(const functionDeclaration of currentFunctionDeclarations) {
				// 	const newFunction = codeLensTracker.find(element => element.lineNumber === functionDeclaration);
				// 	if(newFunction) {
				// 		let codeLensProvider = vscode.languages.registerCodeLensProvider(
				// 			docSelector, 
				// 			new MyCodeLensProvider(currentLineNumber, 0, currentLineNumber, 25)
				// 		);
				// 		codeLensTracker.push({lineNumber: currentLineNumber, codeLens: codeLensProvider});
				// 		context.subscriptions.push(codeLensProvider);
				// 	}
				// }
				console.log('Moved a func def!');
			}

			// // If adding a new line 
			// if(change.text === '\n') {
				
			// 	for(const codeLensProvider of codeLensTracker) {
			// 		const functionChangedLines = !functionRegex.test(event.document.lineAt(codeLensProvider.lineNumber).text);
			// 		if(functionChangedLines) {
			// 			codeLensProvider.codeLens.dispose();
			// 		}
			// 	}
				
			// }

			// If removing the word function
			// if(change.text === '' && !functionOnLine) {
			// 	if(existingCodeLens) {
			// 		existingCodeLens.codeLens.dispose();
			// 	}
			// }
			previousFunctionDeclarations = currentFunctionDeclarations;
		}
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
