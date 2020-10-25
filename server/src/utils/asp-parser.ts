import * as vscode from "vscode-languageserver";
import * as path from 'path';
import { TextDocument } from "vscode-languageserver-textdocument"
import { AspFile, AspInclude } from "../types/Interfaces";

const Patterns = {
    INCLUDE: /<!--\s*#include\s*(virtual|file)\s*=\s*\"(.*?)\"\s*-->/,
    CODE_OPEN: /<%(?!=)/,
    CODE_CLOSE: /(?<!<%=.*)%>/
}

export enum AspScope {
	HTML = 'HTML',
	CODE = 'CODE'
}

export class AspParser {
    
    private static wipFile: AspFile;
    private static isReady: PromiseLike<any> = Promise.resolve();
  
    public static initialise(): PromiseLike<any> { return this.isReady; }  //Placeholder in case we need to initialise onigasm here
 
    public static parseFile(textDocument: TextDocument, deep: boolean) : AspFile {
        let line: string, result: RegExpExecArray, chartStart: number;

        this.wipFile = {
            FileUri: textDocument.uri,
            Lines: textDocument.getText().split(/\r?\n/),
            Includes: []
        };

        let scopeStack: AspScope[] = [AspScope.HTML];
        for (let i = 0, l = this.wipFile.Lines.length; i < l; i++) {
            line = this.wipFile.Lines[i];
            switch (scopeStack[scopeStack.length-1]) {

                case AspScope.HTML:
                    // Check for includes
                    Patterns.INCLUDE.lastIndex = 0;
                    result = Patterns.INCLUDE.exec(line);
                    if (result) {
                        this.wipFile.Includes.push({
                            FileName: result[2],
                            FileUri: this.resolvePath(result[1], result[2]),
                            LocationRange: { 
                                start: { line: i, character: result.index },
                                end: { line: i, character: result.index + result[0].length }
                            }
                        });
                    }

                case AspScope.CODE:
            }


        }
        
        return this.wipFile;

    }
    
    static resolvePath(includeType: string, filePath: string): string {
        if (includeType === "file") {
			return path.join(path.dirname(this.wipFile.FileUri), filePath);
		} else {
			var parent = this.wipFile.FileUri;
			do {
				parent = path.dirname(parent);
			} while (!parent.endsWith("/src") && parent.length > 3);

			if (!parent.endsWith("/src")) return null;

			return path.join(parent, filePath);
		}
    }
}