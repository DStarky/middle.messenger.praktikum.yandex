import { expect } from 'chai';
import Block from './Block';
import { sinon } from '../api/testsSetup';

describe('Block', () => {
  class TestBlock extends Block {
    render() {
      return '<div>Test Content</div>';
    }
  }

  it('должен создавать DOM-элемент при инициализации', () => {
    const block = new TestBlock();
    const element = block.getContent();

    expect(element).to.not.be.null;
    expect(element?.tagName).to.equal('DIV');
    expect(element?.textContent).to.equal('Test Content');
  });

  it('должен добавлять атрибуты из props.attr', () => {
    const block = new TestBlock({
      attr: {
        id: 'testId',
        class: 'testClass',
      },
    });

    const element = block.getContent();
    expect(element?.getAttribute('id')).to.equal('testId');
    expect(element?.getAttribute('class')).to.equal('testClass');
  });

  it('должен добавлять обработчики событий из props.events', () => {
    const clickSpy = sinon.spy();
    const block = new TestBlock({
      events: {
        click: clickSpy,
      },
    });

    const element = block.getContent();
    expect(element).to.not.be.null;

    const event = new window.MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    });

    element!.dispatchEvent(event);
    expect(clickSpy.calledOnce).to.be.true;
  });
});
