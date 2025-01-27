import { expect } from 'chai';
import { EventBus } from './EventBus';
import sinon from 'sinon';

describe('EventBus', () => {
  let eventBus: EventBus;
  const testEvent = 'testEvent';

  beforeEach(() => {
    eventBus = new EventBus();
  });

  it('должен подписываться на событие и вызывать обработчик', () => {
    const callback = sinon.spy();

    eventBus.on(testEvent, callback);
    eventBus.emit(testEvent);

    expect(callback.calledOnce).to.be.true;
  });

  it('должен отписывать обработчик от события', () => {
    const callback = sinon.spy();

    eventBus.on(testEvent, callback);
    eventBus.off(testEvent, callback);
    eventBus.emit(testEvent);

    expect(callback.notCalled).to.be.true;
  });

  it('должен вызывать все обработчики для события', () => {
    const callback1 = sinon.spy();
    const callback2 = sinon.spy();

    eventBus.on(testEvent, callback1);
    eventBus.on(testEvent, callback2);
    eventBus.emit(testEvent);

    expect(callback1.calledOnce).to.be.true;
    expect(callback2.calledOnce).to.be.true;
  });

  it('должен передавать аргументы в обработчики', () => {
    const callback = sinon.spy();
    const args = [123, 'test'];

    eventBus.on(testEvent, callback);
    eventBus.emit(testEvent, ...args);

    expect(callback.calledWith(...args)).to.be.true;
  });

  it('должен выбрасывать ошибку при отписке от несуществующего события', () => {
    const callback = sinon.spy();

    expect(() => eventBus.off('unknownEvent', callback)).to.throw(
      'Нет события: unknownEvent',
    );
  });

  it('должен удалять только указанный обработчик', () => {
    const callback1 = sinon.spy();
    const callback2 = sinon.spy();

    eventBus.on(testEvent, callback1);
    eventBus.on(testEvent, callback2);
    eventBus.off(testEvent, callback1);
    eventBus.emit(testEvent);

    expect(callback1.notCalled).to.be.true;
    expect(callback2.calledOnce).to.be.true;
  });

  it('не должен влиять на другие события', () => {
    const callback = sinon.spy();
    const otherEvent = 'otherEvent';

    eventBus.on(testEvent, callback);
    eventBus.emit(otherEvent);

    expect(callback.notCalled).to.be.true;
  });
});
