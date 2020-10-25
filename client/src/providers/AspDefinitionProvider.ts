import * as vscode from 'vscode';
import { AspDocumentScanner } from '../utils/AspDocumentScanner';

/**
 * Provides `F12` Go to Definition for Include files
 */
export class AspDefinitionProvider implements vscode.DefinitionProvider {
	provideDefinition(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): vscode.ProviderResult<vscode.Location | vscode.Location[] | vscode.LocationLink[]> {
		return new Promise((resolve, reject) => {

			let scanner = new AspDocumentScanner(document);
            let link = scanner.readLinkOnLine(position.line);
            
            if (!link) { reject(); }
            else {
                resolve(new vscode.Location(link.IncludeUri, link.SelectionRange));
            }
        });
	}
}
