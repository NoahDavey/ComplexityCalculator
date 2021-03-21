import { CodeLens, CodeLensProvider, Command, Range, TextDocument } from "vscode";

class MyCodeLensProvider implements CodeLensProvider {
    async provideCodeLenses(document: TextDocument): Promise<CodeLens[]> {
        let topOfDocument = new Range(100,50,0,0)
        let topOfDocument2 = new Range(100,50,25,0)

        let c: Command = {
            command: 'ComplexityCalculator.test',
            title: 'Test'
        }

        let codeLens = new CodeLens(topOfDocument, c)
        let codeLens2 = new CodeLens(topOfDocument2, c)

        return [codeLens, codeLens2]
    }
}

export default MyCodeLensProvider;