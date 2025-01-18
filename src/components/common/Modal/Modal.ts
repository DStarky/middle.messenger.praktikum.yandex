import Block from '../../../app/Block';
import type { Props } from '../../../app/Block';
import type { Events } from '../../../types/Events';

const template = `
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
  sizeClass?: 'small' | 'auto';
  events?: ModalEvents;
}

export class Modal<P extends ModalProps = ModalProps> extends Block<P> {
  constructor(props: P) {
    const sizeVariant = props.size || 'small';
    const sizeClass =
      sizeVariant === 'small' ? 'modal-content__small' : 'modal-content__auto';

    super({
      ...props,
      sizeClass,
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
    return template;
  }
}
