/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
import {
	createConnection,
	TextDocuments,
	Diagnostic,
	DiagnosticSeverity,
	ProposedFeatures,
	InitializeParams,
	DidChangeConfigurationNotification,
	CompletionItem,
	CompletionItemKind,
	TextDocumentPositionParams,
	TextDocumentSyncKind,
	InitializeResult,
	DocumentLinkParams,
	Location,
	combineConsoleFeatures,
	DocumentLink,
	LocationLink,
	Range
} from 'vscode-languageserver';

import { setConsole, logIt, LogLevel } from './utils/config';

import {
	TextDocument
} from 'vscode-languageserver-textdocument';
import { AspParser } from './utils/asp-parser';
import { AspContext } from './utils/asp-context';

// Create a connection for the server, using Node's IPC as a transport.
// Also include all preview / proposed LSP features.
let connection = createConnection(ProposedFeatures.all);
let documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);
setConsole(connection.console);
documents.listen(connection);

let workspaceFolder: string | null;

connection.onInitialize((params: InitializeParams) => {
	workspaceFolder = params.rootUri;
	logIt({ level: LogLevel.INFO, message: `[Server(${process.pid}) ${workspaceFolder}] Started and initialize received.` });
	return <InitializeResult> {
		capabilities: {
			textDocumentSync: TextDocumentSyncKind.Incremental,
			definitionProvider: true,
			documentLinkProvider: { resolveProvider: true }
		}
	};
});

connection.listen();
AspParser.initialise()
	.then(() => {
		documents.onDidOpen(evt => {
			let aspFile = AspParser.parseFile(evt.document, true);
			AspContext.registerFile(aspFile);
			logIt({ level: LogLevel.VERBOSE, message: JSON.stringify(aspFile) });
		});
		documents.onDidChangeContent(change => 
			AspContext.registerFile(AspParser.parseFile(change.document, true))
		);
		connection.onDocumentLinks(doc => AspContext.getDocumentLinks(doc));
		connection.onDefinition(docPos => AspContext.getDefinition(docPos));
	});
