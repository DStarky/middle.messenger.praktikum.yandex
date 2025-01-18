import Block from '../../../app/Block';
import Handlebars from 'handlebars';
import type { Props } from '../../../app/Block';
import type { Events } from '../../../types/Events';

const modalTemplate = `
  <div class="modal-overlay" data-modal>
    <div class="modal-content {{sizeClass}}">
      {{{children}}}
    </div>
  </div>
`;

interface ModalEvents extends Events {
  close?: () => void;
}

interface ModalProps extends Props {
  size?: 'small' | 'auto';
  events?: ModalEvents;
}

export class Modal<P extends ModalProps = ModalProps> extends Block<P> {
  constructor(props: P) {
    super({
      ...props,
      size: props.size || 'small',
      events: {
        ...props.events,
        click: (e: Event) => this.handleOverlayClick(e),
      },
    });
  }

  private handleOverlayClick(e: Event): void {
    const target = e.target as HTMLElement;
    if (target.dataset.modal !== undefined) {
      this.close();
    }
  }

  private handleEsc = (e: KeyboardEvent): void => {
    if (e.key === 'Escape') {
      this.close();
    }
  };

  protected init(): void {
    document.addEventListener('keydown', this.handleEsc);
  }

  protected componentWillUnmount(): void {
    document.removeEventListener('keydown', this.handleEsc);
  }

  public close(): void {
    this.hide();
    this.destroy();
    if (this.props.events?.close) {
      this.props.events.close();
    }
  }

  protected override render(): string {
    const sizeClass =
      this.props.size === 'auto' ? 'modal-content_auto' : 'modal-content_small';

    const childrenHTML = Object.values(this.children)
      .map(child =>
        child instanceof Block ? child.getContent()!.outerHTML : '',
      )
      .join('');

    return Handlebars.compile(modalTemplate)({
      sizeClass,
      children: childrenHTML,
    });
  }
}
