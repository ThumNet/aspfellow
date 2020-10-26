import * as path from 'path';

var fixturePath = path.resolve(__dirname, './__fixtures__/');

test(`Can resolve fixture path`, () => {
    expect(fixturePath).toBeTruthy();
});