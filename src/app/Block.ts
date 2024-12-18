import { EventBus } from './EventBus';
import Handlebars from 'handlebars';
import { v4 as makeUUID } from 'uuid';
import type { Events } from '../types/Events';

export interface Props {
  events?: Events;
  attr?: Record<string, string>;
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
  protected props: T;
  protected children: Children;
  protected lists: Record<string, unknown[]>;
  name: string;
  private eventBusInstance: EventBus;

  constructor(
    propsWithChildren: PropsWithChildren<T> = {} as PropsWithChildren<T>,
  ) {
    this.eventBusInstance = new EventBus();

    const { props, children, lists } =
      this._getChildrenPropsAndProps(propsWithChildren);
    this.props = this._makePropsProxy({ ...props }) as T;
    this.children = children;
    this.lists = this._makePropsProxy({ ...lists }) as Record<
      string,
      unknown[]
    >;
    this.name = '';

    this._registerEvents(this.eventBusInstance);

    this.eventBusInstance.emit(Block.EVENTS.INIT);
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
    Object.values(this.children).forEach(child => {
      if (Array.isArray(child)) {
        child.forEach(c => c.dispatchComponentDidMount());
      } else {
        child.dispatchComponentDidMount();
      }
    });
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

  private _getChildrenPropsAndProps(propsAndChildren: PropsWithChildren<T>): {
    props: T;
    children: Children;
    lists: Record<string, unknown[]>;
  } {
    const children: Children = {};
    const props: Partial<T> = {};
    const lists: Record<string, unknown[]> = {};

    Object.entries(propsAndChildren).forEach(([key, value]) => {
      if (value instanceof Block) {
        children[key] = value;
      } else if (Array.isArray(value)) {
        const allBlocks = value.every(item => item instanceof Block);
        if (allBlocks) {
          children[key] = value as Block<Props>[];
        } else {
          lists[key] = value;
        }
      } else {
        props[key as keyof T] = value as T[keyof T];
      }
    });

    return { props: props as T, children, lists };
  }

  setProps(nextProps: Partial<T>): void {
    if (!nextProps) {
      return;
    }

    Object.assign(this.props, nextProps);
  }

  setLists(nextLists: Record<string, unknown[]>): void {
    if (!nextLists) {
      return;
    }

    Object.assign(this.lists, nextLists);
  }

  get element(): HTMLElement | null {
    return this._element;
  }

  private _addEvents(): void {
    const { events = {} } = this.props;

    Object.entries(events).forEach(([eventName, listener]) => {
      if (this._element && typeof listener === 'function') {
        this._element.addEventListener(eventName, listener);
      }
    });
  }

  private _removeEvents(): void {
    const { events = {} } = this.props;

    Object.entries(events).forEach(([eventName, listener]) => {
      if (this._element && typeof listener === 'function') {
        this._element.removeEventListener(eventName, listener);
      }
    });
  }

  protected addAttributes(): void {
    const { attr = {} } = this.props;

    Object.entries(attr).forEach(([key, value]) => {
      if (this._element) {
        this._element.setAttribute(key, value as string);
      }
    });
  }

  protected setAttributes(attr: Record<string, string>): void {
    Object.entries(attr).forEach(([key, value]) => {
      if (this._element) {
        this._element.setAttribute(key, value);
      }
    });
  }

  private _compile(): HTMLElement {
    const propsAndStubs: Record<string, unknown> = { ...this.props };
    const tmpId = Math.floor(100000 + Math.random() * 900000);

    Object.entries(this.children).forEach(([key, child]) => {
      if (Array.isArray(child)) {
        propsAndStubs[key] = `<div data-id="__c_${key}"></div>`;
      } else {
        propsAndStubs[key] = `<div data-id="${child.getId()}"></div>`;
      }
    });

    Object.entries(this.lists).forEach(([key]) => {
      propsAndStubs[key] = `<div data-id="__l_${tmpId}_${key}"></div>`;
    });

    const template = Handlebars.compile(this.render());
    const htmlString = template(propsAndStubs);

    const fragment = this._createDocumentElement(
      'template',
    ) as HTMLTemplateElement;
    fragment.innerHTML = htmlString;

    Object.entries(this.children).forEach(([key, child]) => {
      if (Array.isArray(child)) {
        const stub = fragment.content.querySelector(`[data-id="__c_${key}"]`);
        if (stub) {
          const container = document.createElement('div');
          child.forEach((component: Block<Props>) => {
            const content = component.getContent();
            if (content) {
              container.appendChild(content);
            }
          });
          stub.replaceWith(container);
        }
      } else {
        const stub = fragment.content.querySelector(
          `[data-id="${child.getId()}"]`,
        );
        if (stub) {
          const childContent = child.getContent();
          stub.replaceWith(childContent || document.createTextNode(''));
        }
      }
    });

    Object.entries(this.lists).forEach(([key, list]) => {
      const stub = fragment.content.querySelector(
        `[data-id="__l_${tmpId}_${key}"]`,
      );
      if (stub) {
        const container = document.createElement('div');
        list.forEach(item => {
          if (item instanceof Block) {
            const node = item.getContent();
            if (node) {
              container.appendChild(node);
            } else {
              container.appendChild(document.createTextNode(''));
            }
          } else {
            container.appendChild(document.createTextNode(String(item)));
          }
        });
        stub.replaceWith(container);
      }
    });

    return fragment.content.firstElementChild as HTMLElement;
  }

  private _render(): void {
    this._removeEvents();
    const newElement = this._compile();

    if (this._element) {
      this._element.replaceWith(newElement);
    }

    this._element = newElement;

    this._addEvents();
    this.addAttributes();
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

  private _makePropsProxy<U extends object>(props: U): U {
    const self = this;

    return new Proxy(props, {
      get(target, prop: string | symbol, receiver: unknown): unknown {
        if (typeof prop === 'symbol') {
          return Reflect.get(target, prop, receiver);
        }

        if (prop in target) {
          const value = target[prop as keyof U];
          return typeof value === 'function'
            ? (value as (...args: unknown[]) => unknown).bind(target)
            : value;
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

        const oldTarget = { ...target };
        (target as Record<string, unknown>)[prop as string] = value;
        self.eventBusInstance.emit(Block.EVENTS.FLOW_CDU, oldTarget, target);

        return true;
      },
      deleteProperty(): boolean {
        throw new Error('Нет доступа');
      },
    });
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
