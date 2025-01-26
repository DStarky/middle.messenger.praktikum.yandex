import { JSDOM } from 'jsdom';
import { expect } from 'chai';
import sinon from 'sinon';

const dom = new JSDOM(
  '<!DOCTYPE html><html><body><div id="app"></div></body></html>',
  {
    url: 'http://localhost/',
    pretendToBeVisual: true,
  },
);

Object.defineProperties(global, {
  window: {
    value: dom.window,
    configurable: true,
    writable: true,
  },
  document: {
    value: dom.window.document,
    configurable: true,
    writable: true,
  },
  HTMLElement: {
    value: dom.window.HTMLElement,
    configurable: true,
    writable: true,
  },
  XMLHttpRequest: {
    value: dom.window.XMLHttpRequest,
    configurable: true,
    writable: true,
  },
});

dom.window.HTMLElement.prototype.scrollIntoView = function () {};

if (!dom.window.document.getElementById('app')) {
  throw new Error('Root element #app не найден');
}

export { dom, expect, sinon };
