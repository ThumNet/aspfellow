// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from "path";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(vscode.languages.registerDocumentLinkProvider(
		{ language: "asp" }, new ASPDocumentLinkProvider()
	));
}

// this method is called when your extension is deactivated
export function deactivate() {}

const IncludeRegex = /<!--(\s+)?#include(\s+)?(?<type>virtual|file)(\s+)?=(\s+)?\"(?<filename>.*?)\"(\s+)?-->/;

class ASPDocumentLinkProvider implements vscode.DocumentLinkProvider {
	provideDocumentLinks(document: vscode.TextDocument, token: vscode.CancellationToken): vscode.ProviderResult<vscode.DocumentLink[]> {
		return new Promise((resolve, reject) => {
			var links = [];

			for (var i = 0; i < document.lineCount; i++) {
				var line = document.lineAt(i).text;
				var match = IncludeRegex.exec(line);
				
				if (match && match.groups) {
					var start = line.indexOf(match.groups.filename);
					var uri = document.uri;
					if (match.groups.type === "file") {
						uri = vscode.Uri.file(path.join(path.dirname(uri.path), match.groups.filename));
					} else {
						var parent = uri.path;						
						do {
							parent = path.dirname(parent);
						} while (!parent.endsWith("/src") && parent.length > 3)

						if (!parent.endsWith("/src")) continue;

						uri = vscode.Uri.file(path.join(parent, match.groups.filename));
					}
					links.push(new vscode.DocumentLink(
						new vscode.Range(new vscode.Position(i, start), new vscode.Position(i, start + match.groups.filename.length)),
						uri
					));
				}
			}

			resolve(links);
		});
	}

}