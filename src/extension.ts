// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { AspDefinitionProvider } from './providers/AspDefinitionProvider';
import { AspDocumentLinkProvider } from './providers/AspDocumentLinkProvider';

const AspSelector = { language: "asp" };

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(vscode.languages.registerDocumentLinkProvider(
		AspSelector, new AspDocumentLinkProvider()
	));

	context.subscriptions.push(vscode.languages.registerDefinitionProvider(
		AspSelector, new AspDefinitionProvider()
	));
}

// this method is called when your extension is deactivated
export function deactivate() {}
