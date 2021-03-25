import * as vscode from 'vscode';
import { Disposable } from 'vscode';
import MyCodeLensProvider from './MyCodeLensProvider';

interface CodeLensInfo {
	lineNumber: number,
	codeLens: Disposable

}

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "ComplexityCalculator" is now active!');

	let activeEditor = vscode.window.activeTextEditor;
	let codeLensDisposables: CodeLensInfo [] = [];

	let disposable = vscode.commands.registerCommand('ComplexityCalculator.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		vscode.window.showInformationMessage('Hello World from Noah!!');
	});

	let docSelector = {
		language: 'javascript',
		scheme: 'file'
	};

	let codeLensProviderDisposable = vscode.languages.registerCodeLensProvider(docSelector, new MyCodeLensProvider(0, 0, 25, 25));

	let hoverProviderDisposable = vscode.languages.registerHoverProvider('javascript', {
		provideHover(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken) {
			// const comentCommandUri = vscode.Uri.parse(`command:editor.action.addCommentLine`)
			const comentCommandUri = vscode.Uri.parse(`command:ComplexityCalculator.helloWorld`);
			const contents = new vscode.MarkdownString(`[Add comment](${comentCommandUri})`);
			
			contents.isTrusted = true;

			return new vscode.Hover(contents);
		}
	});


	vscode.window.onDidChangeActiveTextEditor(editor => {
		activeEditor = editor;
	}, null, context.subscriptions);

	vscode.workspace.onDidChangeTextDocument(event => {
		if(activeEditor && event.document === activeEditor.document) {
			const [change] = event.contentChanges;
			const currentLineNumber = change.range.start.line;
			const currentLineText = event.document.lineAt(currentLineNumber).text;
			
			// Find out if there is an existing code lens on current line
			const existingCodeLens = codeLensDisposables.find(x => x.lineNumber === currentLineNumber);
			
			// Match normal and lambda functions with parameters
			const functionRegex = /function(?=( \w* ?\([A-z0-9, ]*\) ?{))|const \w*(?=( ?= ?\([A-z0-9, ]*\) ?=> ?{))/;
			// Should be true if function on current line, false if not
			const functionOnLine = functionRegex.test(currentLineText);

			if(functionOnLine && !existingCodeLens) {
				let codeLensProvider = vscode.languages.registerCodeLensProvider(
					docSelector, 
					new MyCodeLensProvider(currentLineNumber, 0, currentLineNumber, 25)
				);
				
				codeLensDisposables.push({lineNumber: currentLineNumber, codeLens: codeLensProvider});
				context.subscriptions.push(codeLensProvider);
			}	
			
			// If adding a new line 
			if(change.text === '\n') {
				for(const codeLensProvider of codeLensDisposables) {
					const functionChangedLines = !functionRegex.test(event.document.lineAt(codeLensProvider.lineNumber).text);
					if(functionChangedLines) {
						codeLensProvider.codeLens.dispose();
					}
				}
				
			}

			// If removing the word function
			if(change.text === '' && !functionOnLine) {
				if(existingCodeLens) {
					existingCodeLens.codeLens.dispose();
				}
			}
		}
	});

	context.subscriptions.push(disposable);
	context.subscriptions.push(codeLensProviderDisposable);
	context.subscriptions.push(hoverProviderDisposable);


}

// this method is called when your extension is deactivated
export function deactivate() {}
