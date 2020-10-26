import * as vscode from "vscode-languageserver";
import * as path from 'path';
import { AspFile, AspInclude } from "../types/Interfaces";

const Patterns = {
    INCLUDE: /<!--\s*#include\s*(virtual|file)\s*=\s*\"(.*?)\"\s*-->/,
    CODE_OPEN: /<%(?!=)/,
    CODE_CLOSE: /(?<!<%=.*)%>/,
    METHOD_OPEN: /\b(function|sub)\s+/,
    FUNCTION: /\bfunction[ ]+([a-z]\w+)(\((.*?)\))?(.*?)\bend function/
}

export enum AspScope {
	HTML = 'HTML',
    CODE = 'CODE',
    METHOD = 'METHOD'
}

export class AspParser {
    
    private static wipFile: AspFile;
    private static isReady: PromiseLike<any> = Promise.resolve();
  
    public static initialise(): PromiseLike<any> { return this.isReady; }  //Placeholder in case we need to initialise onigasm here
 
    public static parseFile(fileUri: string, fileContent: string, deep: boolean = true) : AspFile {
        let line: string, lineWithoutComment: string, result: RegExpExecArray, chartStart: number;

        this.wipFile = {
            FileUri: fileUri,
            Lines: fileContent.split(/\r?\n/),
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

                    result = Patterns.CODE_OPEN.exec(line);
                    if (result) { scopeStack.push(AspScope.CODE); }

                case AspScope.CODE:
                    lineWithoutComment = this.removeComment(line);

                    result = Patterns.METHOD_OPEN.exec(lineWithoutComment);
                    if (result) {
                        
                    }

                    result = Patterns.CODE_CLOSE.exec(line); // note: not using lineWithoutComment here!
                    if (result) { scopeStack.pop(); }
            }


        }
        
        return this.wipFile;

    }

    static removeComment(line: string): string {

        let lastDouble=-1, lastSingle = -1;
        for (let i=0, max=line.length; i<max; i++) {
            if (line[i] == "'" && lastDouble == -1) { return line.substring(0, i); }
            if (line[i] == "'") { lastSingle = i; }
            if (line[i] == '"') { lastDouble = i; }
        }

        if (lastSingle == -1 || lastDouble > lastSingle ) return line;
        return line.substring(0, lastSingle);        
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