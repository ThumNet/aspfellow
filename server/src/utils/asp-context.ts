import * as vscode from "vscode-languageserver";
import { DocumentLink } from "vscode-languageserver";
import { AspFile } from "../types/Interfaces";
import { AspConfig, AspSettings, logIt, LogLevel } from "./config";

export class AspContext {

    private static _files: AspFile[] = [];
    private static _fileLookup: { [fullTypeOrUri: string]: AspFile } = Object.create(null);

    public static async applySettings(settings: AspSettings) {
        AspConfig.LogLevel = settings.logLevel;
    }

    public static registerFile(file: AspFile) {
        if (this._fileLookup[file.FileUri]) {
            logIt({ level: LogLevel.WARNING, message: ['File already registered:', file.FileUri, '! Replacing previous...'] });
            this._files.splice(this._files.indexOf(this._fileLookup[file.FileUri]), 1, file);
        } else {
            this._files.push(file);
        }
        this._fileLookup[file.FileUri] = file;
    }

    public static async getDocumentLinks(documentLink: vscode.DocumentLinkParams): Promise<vscode.DocumentLink[]> {
        logIt({ level: LogLevel.VERBOSE, message: `Document links: ${JSON.stringify(documentLink)}` });
    
        let ambientFile = this._fileLookup[documentLink.textDocument.uri];
        if (! ambientFile) return null;
        
        return ambientFile.Includes.map(x => DocumentLink.create(x.LocationRange, x.FileUri));
    }
    
	public static async getDefinition(textDocumentPosition: vscode.TextDocumentPositionParams): Promise<vscode.Location> {
        
        logIt({ level: LogLevel.VERBOSE, message: `Get Definition: ${JSON.stringify(textDocumentPosition)}` });
        
        let ambientFile = this._fileLookup[textDocumentPosition.textDocument.uri];
        if (! ambientFile) return null;

        let link = ambientFile.Includes.find(x => x.LocationRange.start.line == textDocumentPosition.position.line
            && textDocumentPosition.position.character >= x.LocationRange.start.character
            && textDocumentPosition.position.character <= x.LocationRange.end.character);
        if (!link) return null;
        
        return { uri: link.FileUri, range: link.LocationRange };
	}


}