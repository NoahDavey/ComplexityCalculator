import { CodeLens, CodeLensProvider, Command, Range, TextDocument } from "vscode";

class MyCodeLensProvider implements CodeLensProvider {
    async provideCodeLenses(document: TextDocument): Promise<CodeLens[]> {
        let topOfDocument = new Range(100,50,25,0)

        let c: Command = {
            command: 'ComplexityCalculator.test',
            title: 'Test'
        }

        let codeLens = new CodeLens(topOfDocument, c)

        return [codeLens]
    }
}

export default MyCodeLensProvider;