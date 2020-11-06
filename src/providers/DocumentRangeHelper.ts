import * as vscode from 'vscode';
import { RangeInput } from '../types/Interfaces';


export class DocumentRangeHelper {

    static create(document: vscode.TextDocument, input: RangeInput): vscode.Range {
        let start = document.positionAt(input.offset);
        return new vscode.Range(start, new vscode.Position(start.line, start.character + input.text.length));
    }
    
}
