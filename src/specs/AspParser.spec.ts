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

});