import { expect } from 'chai';
import { describe, it, beforeEach, afterEach } from 'mocha';
import sinon from 'sinon';
import { Router } from './Router';
import { ROUTES } from './routes';
import AuthController from '../controllers/AuthController';
import { dom } from '../api/testsSetup';

describe('Тестируем роутер...', () => {
  let sandbox: sinon.SinonSandbox;
  let testRouter: Router;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    testRouter = new Router('#app');
    dom.window.history.replaceState({}, '', '/');

    sandbox.stub(AuthController, 'getUserInfo').resolves({
      id: 1,
      first_name: 'Test',
      second_name: 'User',
      display_name: 'TestUser',
      phone: '+79000000000',
      login: 'testuser',
      avatar: '',
      email: 'test@example.com',
    });
  });

  afterEach(() => {
    sandbox.restore();
    testRouter._resetRoutesForTesting();
    dom.window.history.pushState({}, '', '/');
  });

  it('должен менять историю и выполнять обработчик', async () => {
    const testHandler = sandbox.spy();
    const historySpy = sandbox.spy(dom.window.history, 'pushState');

    testRouter.addRoute(ROUTES.REGISTRATION, testHandler);
    await testRouter.navigate(ROUTES.REGISTRATION);

    expect(historySpy.calledWith({}, '', ROUTES.REGISTRATION)).to.be.true;
    expect(testHandler.calledOnce).to.be.true;
  });

  it('должен обрабатывать последовательные переходы', async () => {
    const historySpy = sandbox.spy(dom.window.history, 'pushState');

    const handlers = {
      reg: sandbox.spy(),
      main: sandbox.spy(),
    };

    testRouter.addRoute(ROUTES.REGISTRATION, handlers.reg);
    testRouter.addRoute(ROUTES.MAIN, handlers.main);

    await testRouter.navigate(ROUTES.REGISTRATION);
    await testRouter.navigate(ROUTES.MAIN);

    expect(historySpy.callCount).to.equal(2);
    expect(handlers.reg.calledOnce).to.be.true;
    expect(handlers.main.calledOnce).to.be.true;
  });

  it('должен обрабатывать переход назад по истории', async () => {
    const handlerMain = sandbox.spy();
    const handlerRegistration = sandbox.spy();

    testRouter.addRoute(ROUTES.MAIN, handlerMain);
    testRouter.addRoute(ROUTES.REGISTRATION, handlerRegistration);
    testRouter.init();

    await testRouter.navigate(ROUTES.REGISTRATION);
    await testRouter.navigate(ROUTES.MAIN);

    const popStatePromise = new Promise(resolve => {
      dom.window.addEventListener('popstate', resolve, { once: true });
    });

    dom.window.history.back();

    await popStatePromise;

    await new Promise(setImmediate);

    expect(window.location.pathname).to.equal(ROUTES.REGISTRATION);
    expect(handlerRegistration.callCount).to.equal(2);
  });
});
