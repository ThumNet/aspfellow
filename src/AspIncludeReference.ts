import * as vscode from 'vscode';

export interface AspIncludeReference {
	IncludeUri: vscode.Uri;
	LinkType: string;
	Filename: string;
	LineNumber: number;
	LineText: string;
	SelectionRange: vscode.Range;
}
