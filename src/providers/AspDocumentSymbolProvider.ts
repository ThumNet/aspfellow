import * as vscode from 'vscode';
import { FellowContext } from '../utils/FellowContext';

/**
 * Provides the Go to symbols `CTRL+Shift+O` or `CMD+Shift+O` for the current document
 */
export class AspDocumentSymbolProvider implements vscode.DocumentSymbolProvider {
    provideDocumentSymbols(document: vscode.TextDocument, token: vscode.CancellationToken): vscode.ProviderResult<vscode.SymbolInformation[] | vscode.DocumentSymbol[]> {
        return new Promise((resolve, reject) => {

            const file = FellowContext.getOrCreateFile(document);
            if (file.includes.length === 0 && file.methods.length === 0) {
                return reject();
            }

            let symbols: vscode.DocumentSymbol[] = [];

            file.includes.forEach(x => {
                symbols.push(
                    new vscode.DocumentSymbol(x.filename, x.linkType.toString(), vscode.SymbolKind.File, x.range, x.range)
                );
            });
            
            file.methods.forEach(x => {
                symbols.push(
                    new vscode.DocumentSymbol(x.name, x.methodType.toString(), vscode.SymbolKind.Method, x.range, x.range)
                );
            });

            return resolve(symbols);
        });
    }
}
