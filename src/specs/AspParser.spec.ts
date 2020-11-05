import { expect } from 'chai';
import { AspMethodBlock, MethodType } from '../types/Interfaces';
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


    describe(`#findMethods()`, () => {

        it(`can find function`, () => {
            let parser = new AspParser();
            let content = `<%
function test(myvar)
    response.write(myvar)
end function
%>`;

            let result = parser.findMethods(content);
            expect(result).to.be.an('array').with.length(1);
            let method = result![0];
            expect(method.methodType).eq(MethodType.function);
            expect(method.name).eq('test');
            expect(method.params!.length).eq(1);
            expect(method.params![0]).eq('myvar');
        });

        it(`can find sub`, () => {
            let parser = new AspParser();
            let content = `<%
sub who_are_you (myvar, other)
    response.write(myvar + other)
    ' some comment
end sub
%>`;

            let result = parser.findMethods(content);
            expect(result).to.be.an('array').with.length(1);
            let method = result![0];
            expect(method.methodType).eq(MethodType.sub);
            expect(method.name).eq('who_are_you');
            expect(method.params!.length).eq(2);
            expect(method.params![0]).eq('myvar');
            expect(method.params![1]).eq('other');
        });

        it(`can handle method without params #1`, () => {
            let parser = new AspParser();
            let content = `<%
sub without_params
    response.write('hi there')
end sub
%>`;

            let result = parser.findMethods(content);
            expect(result).to.be.an('array').with.length(1);
            let method = result![0];
            expect(method.methodType).eq(MethodType.sub);
            expect(method.name).eq('without_params');
            expect(method.params).undefined;
        });

        it(`can handle method without params #2`, () => {
            let parser = new AspParser();
            let content = `<%
sub without_params ( )
    response.write('hi there')
end sub
%>`;

            let result = parser.findMethods(content);
            expect(result).to.be.an('array').with.length(1);
            let method = result![0];
            expect(method.methodType).eq(MethodType.sub);
            expect(method.name).eq('without_params');
            expect(method.params).undefined;
        });

        it(`can handle method multiline params`, () => {
            let parser = new AspParser();
            let content = `<%
sub multiline_params(var1, _
        var2, _
        var3 )
    response.write('hi there')
end sub
%>`;

            let result = parser.findMethods(content);
            expect(result).to.be.an('array').with.length(1);
            let method = result![0];
            expect(method.methodType).eq(MethodType.sub);
            expect(method.name).eq('multiline_params');
            expect(method.params!).length(3);
            expect(method.params![0]).eq('var1');
            expect(method.params![1]).eq('var2');
            expect(method.params![2]).eq('var3');
        });

    });

    describe(`#findCode()`, () => {

        it(`should ignore HTML`, () => {

            let parser = new AspParser();
            let content = `<b>ignored</n>`;

            let result = parser.findCode(content);
            expect(result).length(0);
        });

        it(`should find code`, () => {

            let parser = new AspParser();
            let content = `<%dim myVar%>`;

            let result = parser.findCode(content);
            expect(result).eq("dim myVar");
        });

        it(`should find code between HTML`, () => {

            let parser = new AspParser();
            let content = `<html>
<%dim myVar%>
<html>`;

            let result = parser.findCode(content);
            expect(result).eq("dim myVar");
        });

        it(`should find multiple code blocks between HTML`, () => {

            let parser = new AspParser();
            let content = `<html>
<%dim myVar%>
<hr>
<%myVar = 123%>
<html>`;

            let result = parser.findCode(content);
            expect(result).eq("dim myVar\nmyVar = 123");
        });

    });

});