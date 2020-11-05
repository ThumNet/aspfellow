import { expect } from 'chai';
import { AspParser } from '../utils/AspParser';

describe('AspParser', () => {

    describe(`#removeComment()`, () => {

        it(`should work`, () => {

            function doMatch(line: string, expected: string) {
                expect(AspParser.removeComment(line)).eq(expected);
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

            let parser = new AspParser();
            let content = `<b>ignored</n>`;

            let result = parser.findMethods(content);
            expect(result).length(0);
        });

        it(`should find code`, () => {

            let parser = new AspParser();
            let content = `<%dim myVar%>`;

            let result = parser.findMethods(content);
            expect(result).eq("dim myVar");
        });

        it(`should find code between HTML`, () => {

            let parser = new AspParser();
            let content = `<html>
<%dim myVar%>
<html>`;

            let result = parser.findMethods(content);
            expect(result).eq("dim myVar");
        });

        it(`should find multiple code blocks between HTML`, () => {

            let parser = new AspParser();
            let content = `<html>
<%dim myVar%>
<hr>
<%myVar = 123%>
<html>`;

            let result = parser.findMethods(content);
            expect(result).eq("dim myVar\nmyVar = 123");
        });

    });

});