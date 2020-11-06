import { AspMethod, AspMethodBlock, MethodType } from "../types/Interfaces";

const METHOD_REGEX = /(function|sub)\s+([a-z]\w+)\s*(\([^\)]*\)|\n)/;

export class AspMethodCreator {

    static create(block: AspMethodBlock): AspMethod {

        let methodText = block.lines.join('\n');
        let match = METHOD_REGEX.exec(methodText);
        if (!match) { throw new Error("This should never happen!"); }

        return <AspMethod>{
            methodType: match[1] === "function" ? MethodType.function : MethodType.sub,
            name: match[2],
            params: this.determineParams(match[3]),
            //codeBlock: block
        };

    }

    private static determineParams(paramstext: string): string[] | null {
        if (!paramstext || paramstext === "()") { return null; }

        return paramstext
            .replace("(", "")
            .replace(")", "")
            .replace("_\n", "")
            .replace("\n", "")
            .split(",")
            .map(p => p.trim())
            .filter(p => p !== "");
    }
}
