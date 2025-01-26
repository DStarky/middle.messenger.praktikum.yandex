import { expect } from 'chai';
import { describe, it, beforeEach, afterEach } from 'mocha';
import sinon from 'sinon';
import { Router } from './Router';
import { ROUTES } from './routes';
import AuthController from '../controllers/AuthController';
import type { UserData } from '../types/AuthResponses';
import { dom } from '../api/testsSetup';

describe('Тестируем роутер...', () => {
  let sandbox: sinon.SinonSandbox;
  let testRouter: Router;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    testRouter = new Router('#app');
    dom.window.history.replaceState({}, '', '/');
  });

  afterEach(() => {
    sandbox.restore();
    testRouter._resetRoutesForTesting();
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
    const mockUser: UserData = {
      id: 1,
      first_name: 'Test',
      second_name: 'User',
      display_name: 'TestUser',
      phone: '+79000000000',
      login: 'testuser',
      avatar: '',
      email: 'test@example.com',
    };

    sandbox.stub(AuthController, 'getUserInfo').resolves(mockUser);
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
});
