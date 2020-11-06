import { expect } from 'chai';
import { ParserHelper } from '../utils/ParserHelper';

describe('ParserHelper', () => {

    describe(`#removeComment()`, () => {

        it(`should work`, () => {

            function doMatch(line: string, expected: string) {
                expect(ParserHelper.removeComment(line)).eq(expected);
            }

            doMatch(`dim myvar`, `dim myvar`);
            doMatch(`dim 'test`, `dim `);
            doMatch(`Response.Write("'this' is not comment")`, `Response.Write("'this' is not comment")`);
            doMatch(`Response.Write("'this' is not comment") 'but this is`, `Response.Write("'this' is not comment") `);
            doMatch(`'"`, ``);
            doMatch(`"""'"`, `"""'"`);
            doMatch(`"'" ' tretert`, `"'" `);
        });
    });
    

    describe(`#findCode()`, () => {

        it(`should ignore HTML`, () => {

            let content = `<b>ignored</n>`;

            let result = ParserHelper.findCode(content);
            expect(result).length(0);
        });

        it(`should find code`, () => {

            let content = `<%dim myVar%>`;

            let result = ParserHelper.findCode(content);
            expect(result).eq("dim myVar");
        });

        it(`should find code between HTML`, () => {

            let content = `<html>
<%dim myVar%>
<html>`;

            let result = ParserHelper.findCode(content);
            expect(result).eq("dim myVar");
        });

        it(`should find multiple code blocks between HTML`, () => {

            let content = `<html>
<%dim myVar%>
<hr>
<%myVar = 123%>
<html>`;

            let result = ParserHelper.findCode(content);
            expect(result).eq("dim myVar\nmyVar = 123");
        });

    });

});