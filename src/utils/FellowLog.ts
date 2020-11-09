
import * as vscode from 'vscode';

export class FellowLog {

    constructor(private output: vscode.OutputChannel){ }

    log(message: string) {
        this.output.appendLine(message);
    }
}
