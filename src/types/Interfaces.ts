import * as vscode from 'vscode';

export interface AspIncludeReference {
	IncludeUri: vscode.Uri;
	LinkType: string;
	Filename: string;
	LineNumber: number;
	LineText: string;
	SelectionRange: vscode.Range;
}

export interface AspFile {
	Includes?: AspIncludeReference[];
	Methods?: AspMethod[];
}

export interface AspCodeBlock {
	Lines: string[];
	Start: vscode.Position;
	End?: vscode.Position;
}

export enum MethodType {
	Function,
	Sub
}

export interface AspMethod {
	Name: string;
	MethodType: MethodType;
	Params?: string[];
	CodeBlock: AspMethodBlock;
}

export interface AspMethodBlock {
	Lines: string[];
	Start: vscode.Position;
	End: vscode.Position;
}

