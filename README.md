# acorn-typescript-import

This is a plugin for [Acorn](http://marijnhaverbeke.nl/acorn/) - a tiny, fast JavaScript parser, written completely in JavaScript.

It implements support for a subset of TypeScript ESM-CJS like imports

```js
import get = require('lodash/get');
```

Note, the plugin does not support non-external module references, such as `import sth = foo.bar`;

## Usage

This module provides a plugin that can be used to extend the Acorn `Parser` class:

```javascript
const { Parser } = require('acorn');
const acornExportNsFrom = require('acorn-typescript-import');
Parser.extend(acornExportNsFrom).parse('import foo = require("bar")');
```

### Note

This plugin should be treated as a PoC. You should be always using ESM.

## Thanks

Readme and tests based on [acorn-export-ns-from](https://github.com/acornjs/acorn-export-ns-from).

## LICENSE

[MIT](https://github.com/P0lip/ts-import-equals-rewriter/blob/master/LICENSE)
