import * as vscode from 'vscode';
import * as path from "path";
import { AspIncludeReference } from "./AspIncludeReference";

const IncludeRegex = /<!--(\s+)?#include(\s+)?(?<type>virtual|file)(\s+)?=(\s+)?\"(?<filename>.*?)\"(\s+)?-->/;

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
    
    readLinkOnLine(lineNumber: number) : AspIncludeReference | null {
        var line = this.document.lineAt(lineNumber).text;
        return this.createReference(line, lineNumber);
    }

    private createReference(line: string, lineNumber: number) : AspIncludeReference | null {
        var match = IncludeRegex.exec(line);
        if (!(match && match.groups)) return null;
        
        var includeUri = this.constructUri(this.document.uri, match.groups.type, match.groups.filename);
        if (!includeUri) return null;

        return {
            IncludeUri: includeUri,
            LineNumber: lineNumber,
            LinkType: match.groups.type,
            Filename: match.groups.filename,
            LineText: line,
            SelectionRange: this.constructRange(lineNumber, line, match.groups.filename)
        }
    }

	private constructUri(uri: vscode.Uri, type: string, filename: string): vscode.Uri | null {
		if (type === "file") {
			return vscode.Uri.file(path.join(path.dirname(uri.path), filename));
		} else {
			var parent = uri.path;
			do {
				parent = path.dirname(parent);
			} while (!parent.endsWith("/src") && parent.length > 3);

			if (!parent.endsWith("/src")) return null;

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
