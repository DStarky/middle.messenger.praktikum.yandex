import { expect } from 'chai';
import { describe, it } from 'mocha';
import { dom } from './testsSetup';
import sinon from 'sinon';

describe('Проверка тестового окружения', () => {
  it('должен быть доступен глобальный объект window', () => {
    expect(window).to.exist;
    expect(window).to.be.instanceof(dom.window.constructor);
  });

  it('должен быть инициализирован DOM с корневым элементом', () => {
    const appElement = document.getElementById('app');
    expect(appElement).to.exist;
    expect(appElement!.id).to.equal('app');
  });

  it('должен корректно эмулировать базовые API браузера', () => {
    const div = document.createElement('div');
    div.id = 'test-element';
    document.body.appendChild(div);

    const foundElement = document.getElementById('test-element');
    expect(foundElement).to.exist;
    expect(foundElement!.id).to.equal('test-element');
  });

  it('должен иметь правильный базовый URL', () => {
    expect(window.location.href).to.equal('http://localhost/');
  });

  it('должен поддерживать History API', () => {
    const historySpy = sinon.spy(window.history, 'pushState');
    window.history.pushState({}, '', '/test');

    expect(historySpy.calledWith({}, '', '/test')).to.be.true;
    expect(window.location.pathname).to.equal('/test');

    historySpy.restore();
  });

  it('должен иметь необходимые полифиллы', () => {
    const element = document.createElement('div');
    expect(element.scrollIntoView).to.be.a('function');
  });

  it('должен экспортировать необходимые утилиты', () => {
    expect(dom).to.exist;
    expect(expect).to.exist;
    expect(sinon).to.exist;
  });

  it('должен поддерживать работу с событиями', done => {
    const button = document.createElement('button');
    button.addEventListener('click', () => done());
    button.click();
  });
});
