import * as vscode from 'vscode-languageserver';

// export interface AspIncludeReference {
// 	IncludeUri: vscode.Uri;
// 	LinkType: string;
// 	Filename: string;
// 	LineNumber: number;
// 	LineText: string;
// 	SelectionRange: vscode.Range;
// }



export interface AspFile {
	FileUri: string;
	Lines: string[];
	Includes?: AspInclude[];
	Methods?: AspMethod[];
}

export interface AspInclude {
	FileUri: string;
	FileName: string;
	LocationRange: vscode.Range
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

