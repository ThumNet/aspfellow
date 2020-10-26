/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
import {
	createConnection,
	TextDocuments,
	ProposedFeatures,
	InitializeParams,
	TextDocumentSyncKind,
	InitializeResult,
} from 'vscode-languageserver';

import { setConsole, logIt, LogLevel } from './utils/config';

import {
	TextDocument
} from 'vscode-languageserver-textdocument';
import { AspParser } from './utils/asp-parser';
import { AspContext } from './utils/asp-context';
import { config } from 'process';

// Create a connection for the server, using Node's IPC as a transport.
// Also include all preview / proposed LSP features.
let connection = createConnection(ProposedFeatures.all);
let documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);
setConsole(connection.console);
documents.listen(connection);

let workspaceFolder: string | null;

let hasConfigurationCapability: boolean = false;


connection.onInitialize((params: InitializeParams) => {
	let capabilities = params.capabilities;
	hasConfigurationCapability = !!(
		capabilities.workspace && !!capabilities.workspace.configuration
	);

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

connection.onInitialized(() => {
	if (hasConfigurationCapability) {
		// Register for all configuration changes.
		// TODO why not working
		// connection.client.register(DidChangeConfigurationNotification.type, undefined);

		connection.workspace.getConfiguration("aspFellow")
			.then(settings => AspContext.applySettings(settings));
	}
});


connection.listen();
AspParser.initialise()
	.then(() => {
		documents.onDidOpen(evt => {
			let aspFile = AspParser.parseFile(evt.document.uri, evt.document.getText());
			AspContext.registerFile(aspFile);
			logIt({ level: LogLevel.VERBOSE, message: JSON.stringify(aspFile) });
		});
		documents.onDidChangeContent(change => 
			AspContext.registerFile(AspParser.parseFile(change.document.uri, change.document.getText()))
		);
		
		// TODO why not working
		// connection.onDidChangeConfiguration(change => {
		// 	console.log(change.settings);
		// 	AspContext.applySettings(change.settings);
		// });
		connection.onDocumentLinks(doc => AspContext.getDocumentLinks(doc));
		connection.onDefinition(docPos => AspContext.getDefinition(docPos));
	});
