// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { Disposable } from 'vscode';
import MyCodeLensProvider from './MyCodeLensProvider';

async function test () {
	console.log('This code lens thing worked');
	
}

interface CodeLensInfo {
	lineNumber: number,
	codeLens: Disposable

}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "ComplexityCalculator" is now active!');

	let activeEditor = vscode.window.activeTextEditor;
	let codeLensDisposables: CodeLensInfo [] = []

	let disposable = vscode.commands.registerCommand('ComplexityCalculator.helloWorld', () => {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from Noah!!');
	});
	let testDisposable = vscode.commands.registerCommand('ComplexityCalculator.test', test);

	let docSelector = {
		language: 'javascript',
		scheme: 'file'
	}

	let codeLensProviderDisposable = vscode.languages.registerCodeLensProvider(docSelector, new MyCodeLensProvider(0, 0, 25, 25))

	let hoverProviderDisposable = vscode.languages.registerHoverProvider('javascript', {
		provideHover(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken) {
			// const comentCommandUri = vscode.Uri.parse(`command:editor.action.addCommentLine`)
			const comentCommandUri = vscode.Uri.parse(`command:ComplexityCalculator.helloWorld`)
			const contents = new vscode.MarkdownString(`[Add comment](${comentCommandUri})`)
			
			contents.isTrusted = true

			return new vscode.Hover(contents)
		}
	})


	vscode.window.onDidChangeActiveTextEditor(editor => {
		activeEditor = editor
	}, null, context.subscriptions)

	vscode.workspace.onDidChangeTextDocument(event => {
		if(activeEditor && event.document === activeEditor.document) {
			const [change] = event.contentChanges
			const currentLineNumber = change.range.start.line
			const currentLineText = event.document.lineAt(currentLineNumber).text

			if(currentLineText.includes('function')) {
				const existingCodeLens = codeLensDisposables.find(x => x.lineNumber === currentLineNumber)

				if(!existingCodeLens) {
					let codeLensProvider = vscode.languages.registerCodeLensProvider(docSelector, new MyCodeLensProvider(currentLineNumber, 0, currentLineNumber, 25))
					
					codeLensDisposables.push({lineNumber: currentLineNumber, codeLens: codeLensProvider})
					context.subscriptions.push(codeLensProvider)			
				}

			}				
		}
	})

	context.subscriptions.push(disposable);
	context.subscriptions.push(testDisposable);
	context.subscriptions.push(codeLensProviderDisposable);
	context.subscriptions.push(hoverProviderDisposable);


}

// this method is called when your extension is deactivated
export function deactivate() {}
