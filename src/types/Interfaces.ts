import * as vscode from 'vscode';

export interface AspIncludeReference {
    includeUri: vscode.Uri;
    linkType: string;
    filename: string;
    lineNumber: number;
    lineText: string;
    selectionRange: vscode.Range;
}

export interface AspFile {
    includes?: AspIncludeReference[];
    methods?: AspMethod[];
}

export interface AspCodeBlock {
    lines: string[];
    start: vscode.Position;
    end?: vscode.Position;
}

export enum MethodType {
    function,
    sub
}

export interface AspMethod {
    name: string;
    methodType: MethodType;
    params?: string[];
    //codeBlock: AspMethodBlock;
}

export interface AspMethodBlock {
    lines: string[];
    start: vscode.Position;
    end: vscode.Position;
}

