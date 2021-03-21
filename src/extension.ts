// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import MyCodeLensProvider from './MyCodeLensProvider';

async function test () {
	console.log('This code lens thing worked');
	
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "ComplexityCalculator" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
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

	let codeLensProviderDisposable = vscode.languages.registerCodeLensProvider(docSelector, new MyCodeLensProvider())

	let hoverProviderDisposable = vscode.languages.registerHoverProvider('javascript', {
		provideHover(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken) {
			// const comentCommandUri = vscode.Uri.parse(`command:editor.action.addCommentLine`)
			const comentCommandUri = vscode.Uri.parse(`command:ComplexityCalculator.helloWorld`)
			const contents = new vscode.MarkdownString(`[Add comment](${comentCommandUri})`)
			
			contents.isTrusted = true

			return new vscode.Hover(contents)
		}
	})


	context.subscriptions.push(disposable);
	context.subscriptions.push(testDisposable);
	context.subscriptions.push(codeLensProviderDisposable);
	context.subscriptions.push(hoverProviderDisposable);


}

// this method is called when your extension is deactivated
export function deactivate() {}
