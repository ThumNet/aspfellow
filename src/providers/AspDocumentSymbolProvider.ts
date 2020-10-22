import * as vscode from 'vscode';
import { AspDocumentScanner } from '../AspDocumentScanner';

export class AspDocumentSymbolProvider implements vscode.DocumentSymbolProvider {
	provideDocumentSymbols(document: vscode.TextDocument, token: vscode.CancellationToken): vscode.ProviderResult<vscode.SymbolInformation[] | vscode.DocumentSymbol[]> {
		return new Promise((resolve, reject) => {

			let scanner = new AspDocumentScanner(document);
			let includes = scanner.readLinks();
			let links = includes.map(x => new vscode.DocumentSymbol(x.Filename, x.Filename,
				vscode.SymbolKind.File, x.SelectionRange, x.SelectionRange));

			resolve(links);
		});
	}
}
