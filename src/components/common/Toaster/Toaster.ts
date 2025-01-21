import type { Props } from '../../../app/Block';
import Block from '../../../app/Block';

const template = `
<div 
  class="toaster toaster_{{type}} {{#if show}}toaster-visible{{/if}}" 
  style="{{attr.style}}"
>
  <div class="toaster__content">
    {{#if icon}}
      <img src="{{icon}}" alt="toaster icon" class="toaster__icon"/>
    {{/if}}
    <span class="toaster__message">{{message}}</span>
  </div>
  <button class="toaster__close" data-action="close">&times;</button>
</div>
`;

interface ToasterProps extends Props {
  type: 'success' | 'error' | 'info';
  message: string;
  show: boolean;
  timeout?: number;
}

export class Toaster extends Block<ToasterProps> {
  private hideTimeout: number | null = null;
  private toasterElement: HTMLElement | null = null;

  constructor(props: ToasterProps) {
    super({
      ...props,
      show: false,
      attr: {
        style: 'display: none;',
      },
    });

    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
  }

  public show(): void {
    if (!this.toasterElement) {
      this.toasterElement = this.getContent() as HTMLElement;
    }

    this.toasterElement.style.display = 'flex';
    requestAnimationFrame(() => {
      this.toasterElement?.classList.add('toaster-visible');
    });

    this.startHideTimer();
  }

  public hide(): void {
    this.toasterElement?.classList.remove('toaster-visible');

    this.toasterElement?.addEventListener(
      'transitionend',
      () => {
        this.toasterElement!.style.display = 'none';
      },
      { once: true },
    );
  }

  private startHideTimer(): void {
    if (this.props.timeout) {
      this.hideTimeout = window.setTimeout(() => {
        this.hide();
      }, this.props.timeout);
    }
  }

  protected init(): void {
    this.setProps({
      events: {
        click: (e: Event) => {
          const target = e.target as HTMLElement;
          if (target.closest('[data-action="close"]')) {
            this.hide();
          }
        },
      },
    });
  }

  override render(): string {
    return template;
  }
}
