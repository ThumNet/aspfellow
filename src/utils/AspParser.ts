// see: https://github.com/zxh0/vscode-proto3/blob/master/src/proto3ScopeGuesser.ts

import { stringify } from "querystring";
import { AspMethod, MethodType } from "../types/Interfaces";

export class AspParser {

    findMethods(content: string): AspMethod[] | undefined {
        let code = this.stripCommentsAndWhitelines(this.findCode(content));
        const regex = /(?<type>function|sub)\s+(?<name>[a-z_]\w+)\s*(\((?<params>.*?)\))?.*?end\s+(function|sub)/gis;
        let m, methods: AspMethod[] = [];
        while ((m = regex.exec(code)) !== null && m.groups) {
            methods.push({
                methodType: m.groups.type.toLowerCase() === 'function' ? MethodType.function : MethodType.sub,
                name: m.groups.name,
                params: this.determineParams(m.groups.params),
            });
        }
        return methods;
    }

    determineParams(paramsText: string): string[] | undefined {
        if (!paramsText) { return; }

        let params = paramsText
            .split(' ')
            .map(p => p.trim().replace(',', ''))
            .filter(p => p && '_' !== p);
        
        return params.length === 0 ? undefined : params;
    }

    stripCommentsAndWhitelines(code: string): string {
        let lines: string[] = [], lineWithoutComment = '';

        code
            .split('\n')
            .forEach(line => {
                if (!line) { return; }
                lineWithoutComment = AspParser.removeComment(line).trimEnd();
                if (lineWithoutComment) {
                    lines.push(lineWithoutComment);
                }
            });
        return lines.join('\n');
    }

    findCode(content: string): string {
        const regex = /<%(?!=)(?<code>.*?)%>/gis;
        let blocks = [], m;
        while ((m = regex.exec(content)) !== null) {
            blocks.push(m.groups?.code);
        }
        return blocks.join('\n');
    }

    static removeComment(line: string): string {
        let lastDouble = -1, lastSingle = -1;
        for (let i = 0, max = line.length; i < max; i++) {
            if (line[i] === "'" && lastDouble === -1) { return line.substring(0, i); }
            if (line[i] === "'") { lastSingle = i; }
            if (line[i] === '"') { lastDouble = i; }
        }

        if (lastSingle === -1 || lastDouble > lastSingle) { return line; }
        return line.substring(0, lastSingle);
    }
}