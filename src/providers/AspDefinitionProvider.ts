import * as vscode from 'vscode';
import { AspFile, AspMethod } from '../types/Interfaces';
import { FellowContext } from '../utils/FellowContext';
import { FellowLog } from '../utils/FellowLog';

/**
 * Provides `F12` Go to Definition for Include files
 */
export class AspDefinitionProvider implements vscode.DefinitionProvider {

    constructor(private logger: FellowLog) {
    }

    provideDefinition(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): vscode.ProviderResult<vscode.Location | vscode.Location[] | vscode.LocationLink[]> {
        return new Promise((resolve, reject) => {

            let wordRange = document.getWordRangeAtPosition(position);
            let word = document.getText(wordRange);
            this.logger.log(`Finding definition for '${word}'`);

            const file = FellowContext.getOrCreateFile(document);

            const method = this.findMethodRecursive(file, word);
            if (method) {
                return resolve(new vscode.Location(
                    vscode.Uri.file(method.filePath), method.range));
            }

            const link = file.includes.find(i => i.range.start.line === position.line);
            if (!link) { return reject(); }

            resolve(new vscode.Location(
                vscode.Uri.file(link.includePath), link.range));
        });
    }

    findMethodRecursive(file: AspFile, word: string): AspMethod | undefined {
        console.log('findMethod in ', file.filePath);
        let method = file.methods.find(x => word === x.name);
        if (method) {
            return method;
        }

        for (let i = 0; i < file.includes.length; i++) {
            const incFile = FellowContext.get(file.includes[i].includePath);
            if (incFile) {
                method = this.findMethodRecursive(incFile, word);
                if (method) { return method; }
            }
        }
    }
}

// function findRecursive<T>(
//     array: [], 
//     predicate: (value: T, index: number, obj: T[]) => unknown, thisArg?: any, 
//     childrenPropertyName: string) : T | undefined {

//     if(!childrenPropertyName){
//         throw "findRecursive requires parameter `childrenPropertyName`";
//     }
//     let initialFind =  array.find(predicate);
//     let elementsWithChildren  = array.filter(x=>x[childrenPropertyName]);
//     if(initialFind){
//         return initialFind;
//     }else if(elementsWithChildren.length){
//         let childElements: T[] = [];
//         elementsWithChildren.forEach(x=>{
//             childElements.push(...x[childrenPropertyName]);
//         });
//         return findRecursive(childElements, predicate, childrenPropertyName);
//     }else{
//         return undefined;
//     }
// }
