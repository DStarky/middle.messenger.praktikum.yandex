import { expect } from 'chai';
import type { Props } from './Block';
import Block from './Block';
import { sinon } from '../api/testsSetup';

describe('Block', () => {
  class TestBlock extends Block {
    render() {
      return '<div>Test Content</div>';
    }

    public getProps(): Props {
      return this.props;
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

  it('должен обновлять пропсы через setProps', () => {
    const block = new TestBlock({ text: 'Old' });
    block.setProps({ text: 'New' });
    expect(block.getProps().text).to.equal('New');
  });

  it('должен вызывать componentDidMount при монтировании', () => {
    class TestComponent extends TestBlock {
      public componentDidMount() {
        super.componentDidMount();
      }
    }

    const spy = sinon.spy(TestComponent.prototype, 'componentDidMount');
    const instance = new TestComponent();
    instance.dispatchComponentDidMount();

    expect(spy.calledOnce).to.be.true;
  });

  it('должен обновлять DOM при изменении пропсов', () => {
    class RenderTrackerBlock extends TestBlock {
      private renderCount = 0;

      render() {
        this.renderCount++;
        return super.render();
      }

      getRenderCount() {
        return this.renderCount;
      }
    }

    const block = new RenderTrackerBlock({ text: 'Old' });
    const initialRenders = block.getRenderCount();

    block.setProps({ text: 'New' });

    expect(block.getRenderCount()).to.be.greaterThan(initialRenders);
  });

  it('должен показывать и скрывать элемент', () => {
    const block = new TestBlock();
    const initialDisplay = block.getContent()?.style.display;

    block.show();
    expect(block.getContent()?.style.display).to.equal('block');

    block.hide();
    expect(block.getContent()?.style.display).to.equal('none');

    block.getContent()!.style.display = initialDisplay || '';
  });
});
