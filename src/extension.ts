// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { AspDefinitionProvider } from './providers/AspDefinitionProvider';
import { AspDocumentLinkProvider } from './providers/AspDocumentLinkProvider';
import { AspDocumentSymbolProvider } from './providers/AspDocumentSymbolProvider';
import { FellowContext } from './utils/FellowContext';
import { FellowLog } from './utils/FellowLog';

const FELLOW_SELECTORS = Array<vscode.DocumentFilter>(
    {
        language: "asp",
        scheme: "file",
        pattern: "**/*.{asp,inc}"
    },
    {
        language: "vbs",
        scheme: "file",
        pattern: "**/*.{asp,inc}"
    }
);


// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    
    const logger = new FellowLog(vscode.window.createOutputChannel('aspFellow'));
    FellowContext.initialize(logger);

    function register(doc: vscode.TextDocument) {
        if (FELLOW_SELECTORS.find(s => s.language === doc.languageId) === undefined) { return; }
        
        FellowContext.getOrCreateFile(doc);
    }

    // this triggers the loading to offten! NOT NEEDED due to the Providers
    // vscode.workspace.onDidOpenTextDocument(register);
    vscode.workspace.onDidChangeTextDocument(evt => register(evt.document));
    vscode.workspace.onDidDeleteFiles(evt => FellowContext.unregisterFile(evt.files.map(u => u.path)));

    context.subscriptions.push(vscode.languages.registerDocumentLinkProvider(
        FELLOW_SELECTORS, new AspDocumentLinkProvider()
    ));

    context.subscriptions.push(vscode.languages.registerDefinitionProvider(
        FELLOW_SELECTORS, new AspDefinitionProvider(logger)
    ));

    context.subscriptions.push(vscode.languages.registerDocumentSymbolProvider(
        FELLOW_SELECTORS, new AspDocumentSymbolProvider()
    ));
    
}

// this method is called when your extension is deactivated
export function deactivate() { }
