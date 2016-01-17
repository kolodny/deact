deact
===

## Usage:

```js
import deact from 'deact';

const sayHi = () => console.log('hi');

const domElement = deact`
  <div>
  	<span onClick=${ function() {console.log('clicked!') }}>span1</span>
  	<span OncLiCK=${ sayHi }}>span1</span>
  </div>
`;

```

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
