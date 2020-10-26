import * as path from 'path';
import * as fse from 'fs-extra';
import { AspParser } from '../utils/asp-parser';

const fixturePath = path.resolve(__dirname, './__fixtures__/');

test(`Can resolve fixture path`, () => {
    expect(fixturePath).toBeTruthy();
});

test(`No includes`, () => {
    let content = fse.readFileSync(path.join(fixturePath, 'no-includes.asp')).toString();
    let sut = AspParser.parseFile('', content);

    expect(sut).toBeTruthy();
    expect(sut.Includes).toHaveLength(0);
});

test(`Simple include`, () => {
    let content = fse.readFileSync(path.join(fixturePath, 'simple.asp')).toString();
    let sut = AspParser.parseFile('', content);

    expect(sut).toBeTruthy();
    expect(sut.Includes).toHaveLength(1);
    expect(sut.Includes[0].FileName).toBe('functions.inc');
});

test(`removeComment() works`, () => {

    function doMatch(line: string, expected: string) {
        expect(AspParser.removeComment(line)).toEqual(expected);
    }

    doMatch(`dim myvar`, `dim myvar`);
    doMatch(`dim 'test`, `dim `);
    doMatch(`Response.Write("'this' is not comment")`, `Response.Write("'this' is not comment")`);
    doMatch(`Response.Write("'this' is not comment") 'but this is`, `Response.Write("'this' is not comment") `);  
    doMatch(`'"`, ``);
    doMatch(`"""'"`, `"""'"`);
    doMatch(`"'" ' tretert`, `"'" `)

});