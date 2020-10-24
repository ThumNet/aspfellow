import * as vscode from 'vscode';
import { AspDocumentScanner } from '../utils/AspDocumentScanner';

/**
 * Provides the `CTRL+Click` links for Include files
 */
export class AspDocumentLinkProvider implements vscode.DocumentLinkProvider {
	provideDocumentLinks(document: vscode.TextDocument, token: vscode.CancellationToken): vscode.ProviderResult<vscode.DocumentLink[]> {
		return new Promise((resolve, reject) => {

			let scanner = new AspDocumentScanner(document);
			let includes = scanner.readLinks();
			// TODO scanner.readMethods();

			let links = includes.map(x => new vscode.DocumentLink(x.SelectionRange, x.IncludeUri));

			resolve(links);
		});
	}
}
