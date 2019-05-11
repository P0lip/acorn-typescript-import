// tests helpers taken from https://github.com/acornjs/acorn-export-ns-from
'use strict';

const assert = require('assert');

const acorn = require('acorn');
const exportNsFrom = require('../index');

const Parser = acorn.Parser.extend(exportNsFrom);

const parse = testCode =>
  Parser.parse(testCode, { ecmaVersion: 10, sourceType: 'module' });

function test(testCode, ast) {
  it(testCode, () => {
    const result = parse(testCode);
    assert.deepStrictEqual(result, ast);
  });
}

function testFail(text, expectedError) {
  it(text, function() {
    let failed = false;
    try {
      parse(text);
    } catch (e) {
      assert.strictEqual(e.message, expectedError);
      failed = true;
    }
    assert(failed);
  });
}

const newNode = props =>
  Object.assign(new acorn.Node({ options: {} }, props.start), props);

describe('acorn-ts-import', () => {
  test(
    "import ooo = require('test')",
    newNode({
      type: 'Program',
      start: 0,
      end: 28,
      body: [
        newNode({
          type: 'ImportDeclaration',
          start: 0,
          end: 28,
          specifiers: [
            newNode({
              end: 10,
              local: newNode({
                end: 10,
                name: 'ooo',
                start: 7,
                type: 'Identifier',
              }),
              start: 7,
              type: 'ImportDefaultSpecifier',
            }),
          ],
          source: newNode({
            end: 27,
            raw: "'test'",
            start: 21,
            type: 'Literal',
            value: 'test',
          }),
        }),
      ],
      sourceType: 'module',
    })
  );

  test(
    "import ooo, { foo } = require('test')",
    newNode({
      type: 'Program',
      start: 0,
      end: 37,
      body: [
        newNode({
          type: 'ImportDeclaration',
          start: 0,
          end: 37,
          specifiers: [
            newNode({
              end: 10,
              local: newNode({
                end: 10,
                name: 'ooo',
                start: 7,
                type: 'Identifier',
              }),
              start: 7,
              type: 'ImportDefaultSpecifier',
            }),
            newNode({
              end: 17,
              imported: newNode({
                end: 17,
                name: 'foo',
                start: 14,
                type: 'Identifier',
              }),
              local: newNode({
                end: 17,
                name: 'foo',
                start: 14,
                type: 'Identifier',
              }),
              start: 14,
              type: 'ImportSpecifier',
            }),
          ],
          source: newNode({
            end: 36,
            raw: "'test'",
            start: 30,
            type: 'Literal',
            value: 'test',
          }),
        }),
      ],
      sourceType: 'module',
    })
  );

  test(
    "import ooo from 'test'",
    newNode({
      type: 'Program',
      start: 0,
      end: 22,
      body: [
        newNode({
          type: 'ImportDeclaration',
          start: 0,
          end: 22,
          specifiers: [
            newNode({
              end: 10,
              local: newNode({
                end: 10,
                name: 'ooo',
                start: 7,
                type: 'Identifier',
              }),
              start: 7,
              type: 'ImportDefaultSpecifier',
            }),
          ],
          source: newNode({
            end: 22,
            raw: "'test'",
            start: 16,
            type: 'Literal',
            value: 'test',
          }),
        }),
      ],
      sourceType: 'module',
    })
  );

  testFail('import { foo } = foo()', 'Unexpected token (1:22)');
  testFail('import = foo()', 'Unexpected token (1:7)');
  testFail('import bar = require()', 'Unexpected token (1:22)');
  testFail("import bar = ''", 'Unexpected token (1:15)');
});
