'use strict';

const tt = require('acorn').tokTypes;

module.exports = function(Parser) {
  return class extends Parser {
    // based on the source code acorn
    parseImport(node, exports) {
      this.next();

      if (this.type === tt.string) {
        node.specifiers = [];
        node.source = super.parseExprAtom();
      } else {
        node.specifiers = super.parseImportSpecifiers();

        if (this.value === '=') {
          this.next();
          const expr = this.parseExpression();
          if (
            expr.type !== 'CallExpression' ||
            expr.arguments.length !== 1 ||
            expr.arguments[0].type !== 'Literal'
          ) {
            this.unexpected();
          }

          node.source = expr.arguments[0];
        } else {
          this.expectContextual('from');
          node.source =
            this.type === tt.string ? this.parseExprAtom() : this.unexpected();
        }
      }

      this.semicolon();
      return this.finishNode(node, 'ImportDeclaration');
    }
  };
};
