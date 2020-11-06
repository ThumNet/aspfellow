import * as vscode from 'vscode';
import * as path from "path";
import { AspCodeBlock, AspIncludeReference, AspMethod, AspMethodBlock, MethodType } from "../types/Interfaces";
import { AspMethodCreator } from './AspMethodCreator';

const PATTERNS = {
    include: /<!--(\s+)?#include(\s+)?(?<type>virtual|file)(\s+)?=(\s+)?\"(?<filename>.*?)\"(\s+)?-->/
};

export class AspDocumentScanner {
	document: vscode.TextDocument;
	constructor(document: vscode.TextDocument) {
		this.document = document;
	}

	readLinks(): AspIncludeReference[] {
		let links = [];

		for (var i = 0; i < this.document.lineCount; i++) {
            var line = this.document.lineAt(i).text;
            let ref = this.createReference(line, i);
            
            if (ref) { links.push(ref); }
        }

		return links;
	}
	
	readMethods() : AspMethod[] | null {

		let methods = [];
		let methodBlock, code;
		let i = 0, max = this.document.lineCount;
		while (i < max) {
			var line = this.document.lineAt(i).text;
			
			let startIndex = line.indexOf("<%");
			if (startIndex === -1 || startIndex === line.indexOf("<%=")) { i++; continue; }

			methodBlock = null;
			for (let j = i+1; j < max; j++) {
				line = this.document.lineAt(j).text;

				code = this.getCode(line);
				if (!code) { continue; }

				if (code.indexOf("%>") !== -1)
				{
					i = j;
					break;
				}

				if (code.startsWith("function ") || code.startsWith("sub "))
				{
					let start = code[0] === "f" ? line.indexOf("function ") : line.indexOf("sub ");
					methodBlock = <AspMethodBlock>{
						start: new vscode.Position(j, start),
						lines: [code],
					};
				} 
				else if (methodBlock) {
					methodBlock.lines.push(code);
					if (code === "end function" || code === "end sub") {
						methodBlock.end = new vscode.Position(j, line.indexOf(code) + code.length);
						
						methods.push(AspMethodCreator.create(methodBlock));
						methodBlock = null;
					}
				}
			}
		}
		console.debug(methods);
		return methods;
	}

	getCode(line: string) : string {
		let text = line.trim();
		let quoteIndex = text.indexOf("'");
		if (quoteIndex === -1) { return text; }
		return text.substring(0, quoteIndex).trim();
	}
    
    readLinkOnLine(lineNumber: number) : AspIncludeReference | null {
        var line = this.document.lineAt(lineNumber).text;
        return this.createReference(line, lineNumber);
    }

    private createReference(line: string, lineNumber: number) : AspIncludeReference | null {
        var match = PATTERNS.include.exec(line);
        if (!(match && match.groups)) { return null; }
        
        var includeUri = this.constructUri(this.document.uri, match.groups.type, match.groups.filename);
        if (!includeUri) { return null; }

        return {
            includeUri: includeUri,
            lineNumber: lineNumber,
            linkType: match.groups.type,
            filename: match.groups.filename,
            lineText: line,
            selectionRange: this.constructRange(lineNumber, line, match.groups.filename)
        };
    }

	private constructUri(uri: vscode.Uri, type: string, filename: string): vscode.Uri | null {
		if (type === "file") {
			return vscode.Uri.file(path.join(path.dirname(uri.path), filename));
		} else {
			var parent = uri.path;
			do {
				parent = path.dirname(parent);
			} while (!parent.endsWith("/src") && parent.length > 3);

			if (!parent.endsWith("/src")) { return null; }

			return vscode.Uri.file(path.join(parent, filename));
		}
	}

	private constructRange(lineNumber: number, text: string, filename: string): vscode.Range {
		let start = text.indexOf(filename);
		return new vscode.Range(
			new vscode.Position(lineNumber, start),
			new vscode.Position(lineNumber, start + filename.length));
	}
}
