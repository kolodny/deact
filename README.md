deact
===

## Usage:

```js
import deact from 'deact';

const sayHi = () => console.log('hi');

const domElement = deact`
  <div>
    <span onClick=${ () => console.log('clicked!') }>span1</span>
    <span OncLiCK=${ sayHi }>span2</span>
  </div>
`;

```

#### [DEMO (may need reloading with devtools open)](http://kolodny.github.io/quick-gist/#https://gist.githubusercontent.com/kolodny/689484049e3f19718db1/raw/314d9060e9c06006dee5eebb53819617425a99a7/index.js) [source](https://gist.githubusercontent.com/kolodny/689484049e3f19718db1/raw/314d9060e9c06006dee5eebb53819617425a99a7/index.js)

## How it works

The source is under 50 lines of code. The basic idea behind this is to take
[https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/template_strings#Tagged_template_strings](Tagged template strings)
and if the value is a function and it looks like an attribute then drop
a placeholder. After doing that for all the items, inject the result into
a div and replace each placeholder with it's corresponding real value

Note: since the template string must go through the browser's DOM engine,
attributes are case insensitive 

```js
onClick === ONCLICK === oNcLiCk
```
