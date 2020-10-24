import { AspMethod, AspMethodBlock, MethodType } from "../types/Interfaces";

const MethodRegex = /(function|sub)\s+([a-z]\w+)\s*(\([^\)]*\)|\n)/

export class AspMethodCreator {

	static Create(block: AspMethodBlock): AspMethod {

		let methodText = block.Lines.join('\n');
		let match = MethodRegex.exec(methodText);
		if (!match) { throw new Error("This should never happen!") }

		return <AspMethod>{
			MethodType: match[1] == "function" ? MethodType.Function : MethodType.Sub,
			Name: match[2],
			Params: this.DetermineParams(match[3]),
			CodeBlock: block
		};

	}

	private static DetermineParams(paramstext: string): string[] | null {
        if (!paramstext || paramstext == "()") return null;
        
        return paramstext
            .replace("(", "")
            .replace(")", "")
            .replace("_\n", "")
            .replace("\n", "")
            .split(",")
            .map(p => p.trim())
            .filter(p => p != "");
	}
}
