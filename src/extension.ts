// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { AspDefinitionProvider } from './providers/AspDefinitionProvider';
import { AspDocumentLinkProvider } from './providers/AspDocumentLinkProvider';

const ASP_SELECTOR = <vscode.DocumentFilter>{
    language: "asp",
    scheme: "file",
    pattern: "**/*.{asp,inc}"
};

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(vscode.languages.registerDocumentLinkProvider(
        ASP_SELECTOR, new AspDocumentLinkProvider()
    ));

    context.subscriptions.push(vscode.languages.registerDefinitionProvider(
        ASP_SELECTOR, new AspDefinitionProvider()
    ));
}

// this method is called when your extension is deactivated
export function deactivate() { }
