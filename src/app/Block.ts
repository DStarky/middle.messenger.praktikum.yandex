import { EventBus } from './EventBus';
import Handlebars from 'handlebars';
import { v4 as makeUUID } from 'uuid';

export interface Props {
  events?: Record<string, EventListener>;
  [key: string]: unknown;
}

interface Children {
  [key: string]: Block<Props> | Block<Props>[];
}

type PropsWithChildren<T extends Props = Props> = T & { children?: Children };

export default abstract class Block<T extends Props = Props> {
  static EVENTS = {
    INIT: 'init',
    FLOW_CDM: 'flow:component-did-mount',
    FLOW_CDU: 'flow:component-did-update',
    FLOW_RENDER: 'flow:render',
  } as const;

  private _element: HTMLElement | null = null;
  private _id: string = makeUUID();
  props: T;
  children: Children;
  name: string;
  private eventBusInstance: EventBus;

  constructor(
    propsWithChildren: PropsWithChildren<T> = {} as PropsWithChildren<T>,
  ) {
    this.eventBusInstance = new EventBus();
    const { props, children } = this._getChildrenAndProps(propsWithChildren);
    this.props = this._makePropsProxy({ ...props }) as T;
    this.children = children;
    this.name = '';

    this._registerEvents(this.eventBusInstance);

    this.eventBusInstance.emit(Block.EVENTS.INIT);
  }

  private _addEvents(): void {
    const { events = {} } = this.props;

    Object.keys(events).forEach((eventName: string) => {
      if (this._element) {
        this._element.addEventListener(eventName, events[eventName]);
      }
    });
  }

  private _removeEvents(): void {
    const { events = {} } = this.props;

    Object.keys(events).forEach((eventName: string) => {
      if (this._element) {
        this._element.removeEventListener(eventName, events[eventName]);
      }
    });
  }

  setPropsForChildren(
    children: Block<Props> | Block<Props>[],
    newProps: Partial<T>,
  ): void {
    if (Array.isArray(children)) {
      children.forEach(child => {
        if (child instanceof Block) {
          child.setProps(newProps);
        }
      });
    } else if (children instanceof Block) {
      children.setProps(newProps);
    }
  }

  private _registerEvents(eventBus: EventBus): void {
    eventBus.on(Block.EVENTS.INIT, this._init.bind(this));
    eventBus.on(Block.EVENTS.FLOW_CDM, this._componentDidMount.bind(this));
    eventBus.on(Block.EVENTS.FLOW_CDU, this._componentDidUpdate.bind(this));
    eventBus.on(Block.EVENTS.FLOW_RENDER, this._render.bind(this));
  }

  private _init(): void {
    this.init();
    this.eventBusInstance.emit(Block.EVENTS.FLOW_RENDER);
  }

  protected init(): void {}

  private _componentDidMount(): void {
    this.componentDidMount();
  }

  protected componentDidMount(): void {}

  dispatchComponentDidMount(): void {
    this.eventBusInstance.emit(Block.EVENTS.FLOW_CDM);
  }

  private _componentDidUpdate(...args: unknown[]): void {
    if (args.length < 2) {
      console.error('Недостаточно аргументов для componentDidUpdate');
      return;
    }

    const [oldProps, newProps] = args as [T, T];

    const shouldUpdate = this.componentDidUpdate(oldProps, newProps);
    if (shouldUpdate) {
      this._render();
    }
  }

  protected componentDidUpdate(oldProps: T, newProps: T): boolean {
    return oldProps !== newProps;
  }

  private _getChildrenAndProps(propsAndChildren: PropsWithChildren<T>): {
    props: T;
    children: Children;
  } {
    const children: Children = {};
    const props: Partial<T> = {};

    const processValue = (value: unknown, key: string) => {
      if (Array.isArray(value)) {
        if (value.every(item => item instanceof Block)) {
          children[key] = value as Block<Props>[];
        } else {
          props[key as keyof T] = value as T[keyof T];
        }
      } else if (value instanceof Block) {
        children[key] = value;
      } else {
        props[key as keyof T] = value as T[keyof T];
      }
    };

    Object.entries(propsAndChildren).forEach(([key, value]) => {
      processValue(value, key);
    });

    return { props: props as T, children };
  }

  setProps(nextProps: Partial<T>): void {
    if (!nextProps) {
      return;
    }

    Object.assign(this.props, nextProps);
  }

  get element(): HTMLElement | null {
    return this._element;
  }

  private _compile(): HTMLElement {
    const propsAndStubs: Record<string, string | string[]> = {};

    for (const key in this.props) {
      const value = this.props[key];
      if (typeof value === 'string' || Array.isArray(value)) {
        propsAndStubs[key] = value as string | string[];
      }
    }

    Object.entries(this.children).forEach(([key, child]) => {
      if (Array.isArray(child)) {
        propsAndStubs[key] = child
          .map(component => `<div data-id="${component.getId()}"></div>`)
          .join('');
      } else {
        propsAndStubs[key] = `<div data-id="${child.getId()}"></div>`;
      }
    });

    const template = Handlebars.compile(this.render());
    const htmlString = template(propsAndStubs);

    const fragment = this._createDocumentElement(
      'template',
    ) as HTMLTemplateElement;
    fragment.innerHTML = htmlString;
    const newElement = fragment.content.firstElementChild as HTMLElement;

    Object.values(this.children).forEach(child => {
      if (Array.isArray(child)) {
        child.forEach((component: Block<Props>) => {
          const stub = fragment.content.querySelector(
            `[data-id="${component.getId()}"]`,
          );
          if (stub) {
            const content = component.getContent();
            if (content) {
              stub.replaceWith(content);
            } else {
              stub.replaceWith(document.createTextNode(''));
            }
          }
        });
      } else {
        if (typeof child.getContent === 'function') {
          const stub = fragment.content.querySelector(
            `[data-id="${child.getId()}"]`,
          );
          const childContent = child.getContent();

          if (stub) {
            stub.replaceWith(childContent || document.createTextNode(''));
          }
        } else {
          console.error(`Для ${child} метод getContent() не является функцией`);
        }
      }
    });

    return newElement;
  }

  private _render(): void {
    this._removeEvents();
    const newElement = this._compile();

    if (this._element) {
      this._element.replaceWith(newElement);
    }

    this._element = newElement;

    this._addEvents();
  }

  protected abstract render(): string;

  getContent(): HTMLElement | null {
    if (this.element?.parentNode?.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
      setTimeout(() => {
        if (
          this.element?.parentNode?.nodeType !== Node.DOCUMENT_FRAGMENT_NODE
        ) {
          this.dispatchComponentDidMount();
        }
      }, 100);
    }

    return this._element;
  }

  private _makePropsProxy(props: Record<keyof T, unknown>): T {
    const self = this;

    return new Proxy(props, {
      get(target, prop: string | symbol, receiver: unknown): unknown {
        if (typeof prop === 'symbol') {
          return Reflect.get(target, prop, receiver);
        }

        if (typeof prop === 'string' && prop in target) {
          const value = target[prop as keyof T];
          return typeof value === 'function' ? value.bind(target) : value;
        }

        return undefined;
      },
      set(
        target,
        prop: string | symbol,
        value: unknown,
        receiver: unknown,
      ): boolean {
        if (typeof prop === 'symbol') {
          return Reflect.set(target, prop, value, receiver);
        }

        if (typeof prop === 'string' && prop in target) {
          const oldTarget = { ...target };
          target[prop as keyof T] = value;

          self.eventBusInstance.emit(Block.EVENTS.FLOW_CDU, oldTarget, target);
          return true;
        }

        return false;
      },
      deleteProperty(): boolean {
        throw new Error('Нет доступа');
      },
    }) as T;
  }

  private _createDocumentElement(tagName: string): HTMLElement {
    return document.createElement(tagName);
  }

  show(): void {
    const content = this.getContent();
    if (content) {
      content.style.display = 'block';
    }
  }

  hide(): void {
    const content = this.getContent();
    if (content) {
      content.style.display = 'none';
    }
  }

  getId(): string {
    return this._id;
  }
}
