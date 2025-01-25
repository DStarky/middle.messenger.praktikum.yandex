import { expect } from 'chai';
import { describe, it } from 'mocha';
import sinon from 'sinon';
import { router } from './Router';
import { ROUTES } from './routes';

describe('Тестируем роутер...', () => {
  it('должен менять историю и выполнять обработчик для маршрута', () => {
    const testHandler = sinon.spy();
    const historyStub = sinon.stub(window.history, 'pushState');

    router.addRoute(ROUTES.REGISTRATION, testHandler);
    router.navigate(ROUTES.REGISTRATION);

    expect(historyStub.calledWith({}, '', ROUTES.REGISTRATION)).to.be.true;
    expect(testHandler.calledOnce).to.be.true;
  });
});
