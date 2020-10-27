import * as assert from 'assert';
import { AspParser } from '../../utils/AspParser';

suite('AspParser', () => {

    test(`removeComment() works`, () => {

        function doMatch(line: string, expected: string) {
            assert.strictEqual(AspParser.removeComment(line), expected);
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