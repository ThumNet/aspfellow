import * as vscode from 'vscode';
import { RangeInput } from '../types/Interfaces';
import { AspParser } from '../utils/AspParser';
import { DocumentRangeHelper } from './DocumentRangeHelper';

/**
 * Provides the `CTRL+Click` links for Include files
 */
export class AspDocumentLinkProvider implements vscode.DocumentLinkProvider {
    provideDocumentLinks(document: vscode.TextDocument, token: vscode.CancellationToken): vscode.ProviderResult<vscode.DocumentLink[]> {
        return new Promise((resolve, reject) => {

            let parser = new AspParser(document.uri.fsPath, document.getText());
            let includes = parser.findIncludes();
            if (includes.length === 0) { 
                return reject(); 
            }

            let links = includes.map(x => 
                new vscode.DocumentLink(
                    DocumentRangeHelper.create(document, x.rangeInput), 
                    vscode.Uri.file(x.includePath)
                ));

            resolve(links);
        });
    }
}

export class DocumentRangeCreator {
    static get(document: vscode.TextDocument, input: RangeInput, ) : vscode.Range {
        let start = document.positionAt(input.offset);
        return new vscode.Range(start, new vscode.Position(start.line, start.character + input.text.length));
    }
}
