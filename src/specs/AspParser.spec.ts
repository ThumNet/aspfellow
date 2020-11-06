import { expect } from 'chai';
import { MethodType } from '../types/Interfaces';
import { AspParser } from '../utils/AspParser';

describe('AspParser', () => {

    const FILEPATH = '';

    
    describe(`#findMethods()`, () => {

        it(`can find function`, () => {
            let content = `<%
function test(myvar)
    response.write(myvar)
end function
%>`;
            let parser = new AspParser(FILEPATH, content);
            let result = parser.findMethods();
            expect(result).to.be.an('array').with.length(1);
            let method = result![0];
            expect(method.methodType).eq(MethodType.function);
            expect(method.name).eq('test');
            expect(method.params!.length).eq(1);
            expect(method.params![0]).eq('myvar');
        });

        it(`can find sub`, () => {
            let content = `<%
sub who_are_you (myvar, other)
    response.write(myvar + other)
    ' some comment
end sub
%>`;
            let parser = new AspParser(FILEPATH, content);
            let result = parser.findMethods();
            expect(result).to.be.an('array').with.length(1);
            let method = result![0];
            expect(method.methodType).eq(MethodType.sub);
            expect(method.name).eq('who_are_you');
            expect(method.params!.length).eq(2);
            expect(method.params![0]).eq('myvar');
            expect(method.params![1]).eq('other');
        });

        it(`can find multiple methods`, () => {
            let content = `<%
sub who_are_you (myvar, other)
    response.write(myvar + other)
    ' some comment
end sub

function ItsMe(mario)
    ItsMe = mario & mario
end function
%>`;
            let parser = new AspParser(FILEPATH, content);
            let result = parser.findMethods();
            expect(result).to.be.an('array').with.length(2);
            let method1 = result![0];
            expect(method1.methodType).eq(MethodType.sub);
            expect(method1.name).eq('who_are_you');
            expect(method1.params!.length).eq(2);
            expect(method1.params![0]).eq('myvar');
            expect(method1.params![1]).eq('other');
            let method2 = result![1];
            expect(method2.methodType).eq(MethodType.function);
            expect(method2.name).eq('ItsMe');
            expect(method2.params!).length(1);
            expect(method2.params![0]).eq('mario');
        });

        it(`can handle method without params #1`, () => {
            let content = `<%
sub without_params
    response.write('hi there')
end sub
%>`;

            let parser = new AspParser(FILEPATH, content);
            let result = parser.findMethods();
            expect(result).to.be.an('array').with.length(1);
            let method = result![0];
            expect(method.methodType).eq(MethodType.sub);
            expect(method.name).eq('without_params');
            expect(method.params).undefined;
        });

        it(`can handle method without params #2`, () => {
            let content = `<%
sub without_params ( )
    response.write('hi there')
end sub
%>`;
            let parser = new AspParser(FILEPATH, content);
            let result = parser.findMethods();
            expect(result).to.be.an('array').with.length(1);
            let method = result![0];
            expect(method.methodType).eq(MethodType.sub);
            expect(method.name).eq('without_params');
            expect(method.params).undefined;
        });

        it(`can handle method multiline params`, () => {
            let content = `<%
sub multiline_params(var1, _
        var2, _
        var3 )
    response.write('hi there')
end sub
%>`;
            let parser = new AspParser(FILEPATH, content);
            let result = parser.findMethods();
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

});