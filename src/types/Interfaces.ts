import * as vscode from 'vscode';

export interface AspFile {
    filePath: string;
    includes: AspInclude[];
    methods: AspMethod[];
}

export enum MethodType {
    function,
    sub
}

export interface AspInclude extends AspIncludeBasic {
    range: vscode.Range;
}

export interface AspIncludeBasic {
    linkType: string;
    filename: string;
    includePath: string;   
    rangeInput: RangeInput;
}

export interface AspMethod extends AspMethodBasic {
    range: vscode.Range;
    filePath: string;
}

export interface AspMethodBasic {
    name: string;
    methodType: MethodType;
    params?: string[];
    rangeInput: RangeInput;
}

export interface RangeInput {
    offset: number;
    text: string;
}
