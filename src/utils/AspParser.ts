export class AspParser {
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