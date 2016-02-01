deact
===

[![NPM version][npm-image]][npm-url]
[![Build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![Downloads][downloads-image]][downloads-url]

[![Sauce Test Status][sauce-image]][sauce-url]


## Usage:

```js
import deact from 'deact';

const sayHi = () => console.log('hi');
const firstName = 'Moshe';
const lastName = 'Kolodny';
const todos = [ 'make todos list', 'something else?' ];

const domElement = deact`
  <div>
  <h1>Hello ${firstName} ${lastName}</h1>
    <span onClick=${ () => console.log('clicked!') }>span1</span>
    <span OncLiCK=${ sayHi }>span2</span>
    <ul>
      ${
        todos.map(todo => deact`<li>${todo}</li>`)
      }
    </ul>
  </div>
`;

document.body.appendChild(domElement);

```

#### [DEMO (may need reloading with devtools open)](http://kolodny.github.io/quick-gist/#https://gist.githubusercontent.com/kolodny/689484049e3f19718db1/raw/5732cfbfa5e853af8bd0945fac352b9fb72384c9/index.js) [source](https://gist.githubusercontent.com/kolodny/689484049e3f19718db1/raw/5732cfbfa5e853af8bd0945fac352b9fb72384c9/index.js)

## How it works

The basic idea behind this is to take
[Tagged template strings](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/template_strings#Tagged_template_strings)
and if the value is a function and it looks like an attribute then drop
a placeholder. After doing that for all the items, inject the result into
a div and replace each placeholder with it's corresponding real value

Note: since the template string must go through the browser's DOM engine,
attributes are case insensitive 

```js
onClick === ONCLICK === oNcLiCk
```

[npm-image]: https://img.shields.io/npm/v/deact.svg?style=flat-square
[npm-url]: https://npmjs.org/package/deact
[travis-image]: https://img.shields.io/travis/kolodny/deact.svg?style=flat-square
[travis-url]: https://travis-ci.org/kolodny/deact
[coveralls-image]: https://img.shields.io/coveralls/kolodny/deact.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/kolodny/deact
[downloads-image]: http://img.shields.io/npm/dm/deact.svg?style=flat-square
[downloads-url]: https://npmjs.org/package/deact

[sauce-image]: https://saucelabs.com/browser-matrix/kolodny-deact.svg
[sauce-url]: https://saucelabs.com/u/kolodny-deact
