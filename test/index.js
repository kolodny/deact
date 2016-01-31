import expect, { createSpy } from 'expect';
import deact, { escape } from '../';
import { jsdom } from 'jsdom';

var cachedDocument = global.document;
describe('deact', () => {
  beforeEach(() => {
    if (!global.document && jsdom) {
      global.document = jsdom().defaultView.document;
    }
  });
  afterEach(() => {
    if (!global.document && jsdom) {
      global.document = cachedDocument;
    }
  })

  it('renders basic markup', () => {
    const domElement = deact`<div>test</div>`;
    expect(domElement.outerHTML).toEqual('<div>test</div>');
  });

  it('renders interpolated markup', () => {
    const domElement = deact`<div>${'test'}</div>`;
    expect(domElement.outerHTML).toEqual('<div>test</div>');
  });

  it('handles inline events', () => {
    const spy = createSpy();
    const domElement = deact`<div onclick=${spy}></div>`;
    expect(spy).toNotHaveBeenCalled();
    domElement.click();
    expect(spy).toHaveBeenCalled();
  });

  it('handles inline events in nested elements', () => {
    const spy = createSpy();
    const domElement = deact`<div><span onclick=${spy}></span></div>`;
    expect(spy).toNotHaveBeenCalled();
    domElement.firstElementChild.click();
    expect(spy).toHaveBeenCalled();
  });

  it ("doesn't remove regular attributes", () => {
    const domElement = deact`<div foobar=${ 123 }></div>`;
    expect(domElement.getAttribute('foobar')).toEqual('123');
  });

  it ("doesn't remove regular function attributes", () => {
    const domElement = deact`<div foobar=${ () => {} }></div>`;
    expect(domElement.foobar).toBeA(Function);
  });

  it('removes inline event attributes', () => {
    const domElement = deact`<div onclick=${ () => {} }></div>`;
    expect(domElement.getAttribute('onclick')).toBeFalsy();
    expect(domElement.onclick).toBe(null);
  });

  it('handles a element child', () => {
    const childElement = deact`<span>${'foobar'}</span>`;
    const domElement = deact`<div>${childElement}</div>`;
    expect(domElement.outerHTML).toEqual('<div><span>foobar</span></div>')
  });

  it('handles a element child with events', () => {
    const spy = createSpy();
    const childElement = deact`<span onclick=${spy}></span>`;
    const domElement = deact`<div>${childElement}</div>`;
    expect(spy).toNotHaveBeenCalled();
    domElement.children[0].click();
    expect(spy).toHaveBeenCalled();
  });

  it('handles an empty array', () => {
    const domElement = deact`<div>foo${ [] }bar</div>`;
    expect(domElement.outerHTML).toEqual('<div>foobar</div>');
  });

  it('handles an array of child elements', () => {
    const domElement = deact`<ul>${ ['x', 'y'].map((c, index) => deact`<li>${c}</li>`) }</ul>`;
    expect(domElement.outerHTML).toEqual('<ul><li>x</li><li>y</li></ul>');
  });

  it('handles an array of child elements with events', () => {
    const spy = createSpy();
    const subElement = deact`<span onclick=${ spy }></span>`;
    const domElement = deact`<div>${ [ subElement ] }</div>`;

    expect(spy).toNotHaveBeenCalled();
    domElement.children[0].click();
    expect(spy).toHaveBeenCalled();
  });

  it('exports an `escape` function that can escape html', () => {
    const domElement = deact`<div>${escape('<br />')}</div>`;
    expect(domElement.outerHTML).toEqual('<div>&lt;br /&gt;</div>');
  });

  it('throws an error when there are adjacent element', () => {
    expect(() => deact`<div></div><div></div>`).toThrow();
  });

});
