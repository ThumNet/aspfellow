// see: https://github.com/zxh0/vscode-proto3/blob/master/src/proto3ScopeGuesser.ts

export class AspParser {

    findMethods(content: string): string  {
        let code = this.removeComments(this.findCode(content));
        return code;
    }

    removeComments(code: string): string {
        return code;
    }

    findCode(content: string): string {
        const regex = /<%(?!=)(?<code>.*?)%>/gis
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