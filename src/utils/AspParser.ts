// see: https://github.com/zxh0/vscode-proto3/blob/master/src/proto3ScopeGuesser.ts
import * as path from "path";

import { AspIncludeBasic, AspMethodBasic, MethodType } from "../types/Interfaces";
import { ParserHelper } from './ParserHelper';

export class AspParser {
    
    constructor(
        private filePath: string,
        private content: string,
        private workspacePath: string) { }

    findIncludes(): AspIncludeBasic[] {
        const regex = /<!--(\s+)?#include(\s+)?(?<type>virtual|file)(\s+)?=(\s+)?\"(?<filename>.*?)\"(\s+)?-->/gis;
        let m, text = '', includePath, includes: AspIncludeBasic[] = [];
        while ((m = regex.exec(this.content)) !== null && m.groups) {
            text = m[0];
            includePath = this.determineIncludePath(m.groups.type, m.groups.filename);
            if (!includePath) { continue; }
            includes.push({
                linkType: m.groups.type,
                filename: m.groups.filename,
                includePath: includePath.replace(/\\/g, '/'),
                rangeInput: {
                    offset: this.content.indexOf(text),
                    text: text,
                }
            });
        }
        return includes;
    }

    findMethods(): AspMethodBasic[] {
        let code = ParserHelper.stripCommentsAndWhitelines(ParserHelper.findCode(this.content));
        const regex = /(?<type>function|sub)\s+(?<name>[a-z_]\w+)\s*(\((?<params>.*?)\))?.*?end\s+(function|sub)/gis;

        let m, text = '', methods: AspMethodBasic[] = [];
        while ((m = regex.exec(code)) !== null && m.groups) {
            text = ParserHelper.firstLine(m[0]);
            methods.push({
                methodType: m.groups.type.toLowerCase() === 'function' ? MethodType.function : MethodType.sub,
                name: m.groups.name,
                params: ParserHelper.determineParams(m.groups.params),
                rangeInput: {
                    offset: this.content.indexOf(text),
                    text: text,
                }
            });
        }
        return methods;
    }

    determineIncludePath(type: string, filename: string): string | undefined {
        if (type === "file") {
			return path.join(path.dirname(this.filePath), filename);
		} else {
            if (filename.startsWith('/')) {
                return path.join(this.workspacePath, filename);
            }

			var parent = this.filePath;
			do {
				parent = path.dirname(parent);
			} while (!parent.endsWith("/src") && parent.length > 3);

			if (!parent.endsWith("/src")) { return; }

			return path.join(parent, filename);
		}
    }
    
}
