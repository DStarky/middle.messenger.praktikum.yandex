import 'jsdom-global/register';
import { expect } from 'chai';
import sinon from 'sinon';

const appElement = document.createElement('div');
appElement.id = 'app';
document.body.appendChild(appElement);

declare global {
  interface Window {
    __TEST_ENV__: {
      expect: typeof expect;
      sinon: typeof sinon;
    };
  }
}

window.__TEST_ENV__ = {
  expect,
  sinon,
};
