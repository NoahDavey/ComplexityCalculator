import * as vscode from 'vscode';
import { addCodeLens, getAllFunctionDeclarations, getCurrentCodeLensPositions, removeAllMovedCodeLenses } from './utils';
import { CodeLensInfo } from './@types';
import MyCodeLensProvider from './MyCodeLensProvider';

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

	// let previousFunctionDeclarations: number[] = [];
	vscode.workspace.onDidChangeTextDocument(event => {
		if(activeEditor && event.document === activeEditor.document) {
			// For each change to the text doc
			
			// Based on current state of doc, identify line numbers of where functions are
			const currentFunctionDeclarations: number[] = getAllFunctionDeclarations(event.document);

			for(const functionDeclaration of currentFunctionDeclarations) {
				addCodeLens(functionDeclaration, context, codeLensTracker);
			}
			
			const currentCodeLensPositions: number[] = getCurrentCodeLensPositions(codeLensTracker);
			
			// identify matching indexes in both lists and dispose of all other lens's
			removeAllMovedCodeLenses(currentFunctionDeclarations, currentCodeLensPositions, codeLensTracker);

			// Compare the identified location of keywords to an array of previous keywords

			// Leave unchanged ones alone
			// Any changed ones, delete old code lens and create new one
			
			// const [change] = event.contentChanges;
			
			// const currentLineNumber = change.range.start.line;
			// const currentLineText = event.document.lineAt(currentLineNumber).text;

			
			// // Find out if there is an existing code lens on current line
			// const existingCodeLens = codeLensTracker.find(x => x.lineNumber === currentLineNumber);
			
			// // Should be true if function on current line, false if not
			// const isFunctionOnLine = functionOnLine(currentLineText);

			// const documentArr: string[] = event.document.getText().split('\n');
			// // const currentFunctionDeclarations = getAllIndexes(documentArr, functionRegex);
			// previousFunctionDeclarations = [...currentFunctionDeclarations];
		}
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
