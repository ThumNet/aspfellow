import * as vscode from 'vscode';
import { AspParser } from '../utils/AspParser';
import { DocumentRangeHelper } from './DocumentRangeHelper';

/**
 * Provides the Go to symbols `CTRL+Shift+O` or `CMD+Shift+O` for the current document
 */
export class AspDocumentSymbolProvider implements vscode.DocumentSymbolProvider {
    provideDocumentSymbols(document: vscode.TextDocument, token: vscode.CancellationToken): vscode.ProviderResult<vscode.SymbolInformation[] | vscode.DocumentSymbol[]> {
        return new Promise((resolve, reject) => {

            let parser = new AspParser(document.uri.fsPath, document.getText());
            let symbols: vscode.DocumentSymbol[] = [];

            parser.findIncludes().forEach(x => {
                const range = DocumentRangeHelper.create(document, x.rangeInput);
                symbols.push(
                    new vscode.DocumentSymbol(x.filename, x.filename, vscode.SymbolKind.File, range, range)
                );
            });
            
            parser.findMethods().forEach(x => {
                const range = DocumentRangeHelper.create(document, x.rangeInput);
                symbols.push(
                    new vscode.DocumentSymbol(x.name, 'detail', vscode.SymbolKind.Method, range, range)
                );
            });

            resolve(symbols);
        });
    }
}
