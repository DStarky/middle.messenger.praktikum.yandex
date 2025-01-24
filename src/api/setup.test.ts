import { describe, it } from 'mocha';
import { expect } from 'chai';
import sinon from 'sinon';

describe('Проверка конфигурации тестов', () => {
  it('должен проверять работу spy', () => {
    const spy = sinon.spy();
    spy('test');
    expect(spy.calledWith('test')).to.be.true;
  });

  it('должен использовать глобальные утилиты через window', () => {
    const { expect: chaiExpect, sinon: sinonLib } = window.__TEST_ENV__;
    const stub = sinonLib.stub().returns(42);

    expect(stub()).to.equal(42);
    chaiExpect(stub.calledOnce).to.be.true;
  });
});
