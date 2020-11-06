
export class ParserHelper {
    static firstLine(input: string): string {
        return input.split('\n', 1)[0];
    }

    static determineParams(paramsText: string): string[] | undefined {
        if (!paramsText) { return; }

        let params = paramsText
            .split(' ')
            .map(p => p.trim().replace(',', ''))
            .filter(p => p && '_' !== p);

        return params.length === 0 ? undefined : params;
    }

    static stripCommentsAndWhitelines(code: string): string {
        let lines: string[] = [], lineWithoutComment = '';

        code
            .split('\n')
            .forEach(line => {
                if (!line) { return; }
                lineWithoutComment = this.removeComment(line).trimEnd();
                if (lineWithoutComment) {
                    lines.push(lineWithoutComment);
                }
            });
        return lines.join('\n');
    }

    static findCode(content: string): string {
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
