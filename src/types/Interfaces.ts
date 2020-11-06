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

export interface AspInclude {
    linkType: string;
    filename: string;
    includePath: string;
    rangeInput: RangeInput;
}

export interface AspMethod {
    name: string;
    methodType: MethodType;
    params?: string[];
    //codeBlock: AspMethodBlock;
    rangeInput: RangeInput;
}

export interface RangeInput {
    offset: number;
    text: string;
}

export interface AspMethodBlock {
    lines: string[];
    start: vscode.Position;
    end: vscode.Position;
}

