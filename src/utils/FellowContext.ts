import * as vscode from 'vscode';
import { TextDecoder } from 'util';

import { AspFile, AspInclude, AspIncludeBasic, AspMethodBasic, AspMethod } from "../types/Interfaces";
import { AspParser } from "./AspParser";
import { FellowLog } from "./FellowLog";
import { RangeHelper } from './RangeHelper';

export class FellowContext {
    
    private static _files: AspFile[] = [];
    private static  _fileLookup: { [filePath: string]: AspFile } = Object.create(null);
    private static _logger: FellowLog;

    public static initialize(logger: FellowLog) {
        this._logger = logger;
    }

    public static registerFile(file: AspFile) {
        if (this._fileLookup[file.filePath]) {
            //logIt({ level: LogLevel.WARNING, message: ['File already registered:', file.FileUri, '! Replacing previous...'] });
            this._files.splice(this._files.indexOf(this._fileLookup[file.filePath]), 1, file);
        } else {
            this._files.push(file);
        }
        this._fileLookup[file.filePath] = file;

        if (file.includes.length > 0) {
            file.includes.forEach(f => this.loadIncludeIfNeeded(f.includePath));
        }
    }

    static loadIncludeIfNeeded(includePath: string): void {
        if (this._fileLookup[includePath]) { return; }

        vscode.workspace.openTextDocument(includePath).then(
            document => this.getOrCreateFile(document),
            err=> this._logger.log(`ERROR: include file '${includePath}' not found\n${err}`)
        );
        // vscode.workspace.fs.readFile(vscode.Uri.file(includePath))
        //     .then(
        //         bytes => {
        //             const content = new TextDecoder('utf-8').decode(bytes);
        //             let file = AspParser.getFile(includePath, content, this._logger);
        //             this.registerFile(file);
        //         }, 
        //         err => this._logger.log(`ERROR: include file '${includePath}' not found\n${err}`)
        //     );
    }

    public static unregisterFile(filePaths: string[]) {

        filePaths.forEach(filePath => {
            if (this._fileLookup[filePath]) { 
                this._logger.log(`unregisterFile: ${filePath}`);

                const ix = this._files.indexOf(this._fileLookup[filePath]);
                delete this._fileLookup[filePath];
                this._files.splice(ix, 1);
            }
        });
    }

    static get(filePath: string) : AspFile | undefined {
        if (this._fileLookup[filePath]) { return this._fileLookup[filePath]; }
    }

    public static getOrCreateFile(document: vscode.TextDocument) : AspFile {
        const filePath = document.uri.path;

        if (this._fileLookup[filePath]) {
            return this._fileLookup[filePath];
        }

        function buildInclude(basic: AspIncludeBasic, document: vscode.TextDocument) : AspInclude {
            return <AspInclude> { 
                includePath: basic.includePath,
                filename: basic.filename,
                linkType: basic.linkType,
                rangeInput: basic.rangeInput,
                range: RangeHelper.create(document, basic.rangeInput)
            };
        }

        function buildMethod(basic: AspMethodBasic, document: vscode.TextDocument) : AspMethod {
            return <AspMethod> { 
                name: basic.name,
                methodType: basic.methodType,
                params: basic.params,
                rangeInput: basic.rangeInput,
                range: RangeHelper.create(document, basic.rangeInput),
                filePath: filePath
            };
        }

        const workspaceFolder = vscode.workspace.getWorkspaceFolder(document.uri);
        const workspacePath = workspaceFolder ? workspaceFolder.uri.path : '';

        let parser = new AspParser(filePath, document.getText(), workspacePath);
        this._logger.log(`Parsing file: ${filePath}`);
        const file: AspFile = {
            filePath: filePath,
            includes: parser.findIncludes().map(i => buildInclude(i, document)),
            methods: parser.findMethods().map(i => buildMethod(i, document))
        };
        this.registerFile(file);
        return file;
    }
}

