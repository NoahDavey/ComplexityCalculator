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

			// Add a codeLens to each of the current function declarations
			for(const functionDeclaration of currentFunctionDeclarations) {
				addCodeLens(functionDeclaration, context, codeLensTracker);
			}
			
			// Identify the line position of current codeLenses in the file 
			const currentCodeLensPositions: number[] = getCurrentCodeLensPositions(codeLensTracker);
			
			// Dispose of any code lenses that should no longer be where they are
			removeAllMovedCodeLenses(currentFunctionDeclarations, currentCodeLensPositions, codeLensTracker);
		}
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
