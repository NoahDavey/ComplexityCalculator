import * as vscode from 'vscode';
import { 
	addCodeLens, 
	addHover,
	getAllFunctionDeclarations, 
	getCurrentCodeLensPositions, 
	removeAllMovedCodeLenses,
	extractFunctions,
	removeAllHovers
} from './utils';
import { calculateComplexity } from './calculateComplexity';
import { CodeLensInfo, FunctionInfo, HoverInfo } from './@types';
import MyCodeLensProvider from './MyCodeLensProvider';
import ComplexityHoverProvider from './ComplexityHoverProvider';

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "ComplexityCalculator" is now active!');
	let activeEditor = vscode.window.activeTextEditor;
	let codeLensTracker: CodeLensInfo [] = [];
	let hoverTracker: HoverInfo [] = [];

	// TODO make use of document highlights?

	let disposable = vscode.commands.registerCommand('ComplexityCalculator.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		vscode.window.showInformationMessage('Hello World from Noah!!');
	});

	let calcComplexityDisposable = vscode.commands.registerCommand('ComplexityCalculator.calculateComplexity', () => {
		vscode.window.showInformationMessage('This func calculates complexity!');
	});

	vscode.window.onDidChangeActiveTextEditor(editor => {
		activeEditor = editor;
	}, null, context.subscriptions);

	// let previousFunctionDeclarations: number[] = [];
	vscode.workspace.onDidChangeTextDocument(event => {
		if(activeEditor && event.document === activeEditor.document) {	
			// For each edit, should remove existing hovers as these will have likely changed
			removeAllHovers(hoverTracker);

			// Based on current state of doc, identify line numbers of where functions are
			const currentFunctionDeclarations: number[] = getAllFunctionDeclarations(event.document);

			const extractedFunctions: FunctionInfo[] = 
				extractFunctions(currentFunctionDeclarations, event.document);

			// Add a codeLens/hover to each of the current function declarations
			for(const func of extractedFunctions) {
				addCodeLens(func.startLine, context, codeLensTracker);

				const functionComplexity = calculateComplexity(func.functionText);
				addHover(func.startLine, functionComplexity, context, hoverTracker);
			}
			
			// Identify the line position of current codeLenses in the file 
			const currentCodeLensPositions: number[] = getCurrentCodeLensPositions(codeLensTracker);
			
			// Dispose of any code lenses that should no longer be where they are
			removeAllMovedCodeLenses(currentFunctionDeclarations, currentCodeLensPositions, codeLensTracker);
			
		}
	});

	context.subscriptions.push(disposable);
	context.subscriptions.push(calcComplexityDisposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
