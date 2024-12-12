import { v4 as makeUUID } from 'uuid';
import Handlebars from 'handlebars';
import { EventBus } from './EventBus';

type Nullable<T> = T | null;

type EventsType = Record<string, (event: Event) => void>;

type BlockChildrenType = Record<string, Block>;

type BlockListType = Record<string, Array<Block>>;
type BlockPropsType = {
  [key: string]: unknown;
  events?: EventsType;
};

export type BlockPropsAndChildrenType = BlockListType &
  BlockChildrenType &
  BlockPropsType;

type BlockMetaType = {
  tagName: string;
  propsAndChildren: BlockPropsType;
};

export class Block {
  static EVENTS = {
    INIT: 'init',
    FLOW_CDM: 'flow:component-did-mount',
    FLOW_CDU: 'flow:component-did-update',
    FLOW_RENDER: 'flow:render',
  };

  _element: Nullable<HTMLElement> = null;

  _meta: Nullable<BlockMetaType> = null;

  _id: Nullable<string> = null;

  eventBus: () => EventBus;

  props: BlockPropsType;

  children: BlockChildrenType = {};

  list: BlockListType = {};

  _setUpdate = false;

  constructor(tagName = 'div', propsAndChildren: BlockPropsType = {}) {
    const eventBus = new EventBus();
    this._meta = {
      tagName,
      propsAndChildren,
    };

    this._id = makeUUID();

    const { children, props, list } = Block._getChildren(propsAndChildren);

    this.children = this._makePropsProxy(children) as BlockChildrenType;
    this.props = this._makePropsProxy({ ...props, __id: this._id });
    this.list = this._makePropsProxy(list) as BlockListType;

    this.eventBus = () => eventBus;

    this._registerEvents(eventBus);
    eventBus.emit(Block.EVENTS.INIT);
  }

  _registerEvents(eventBus: EventBus) {
    eventBus.on(Block.EVENTS.INIT, this.init.bind(this));
    eventBus.on(Block.EVENTS.FLOW_CDM, this._componentDidMount.bind(this));
    eventBus.on(Block.EVENTS.FLOW_CDU, this._componentDidUpdate.bind(this));
    eventBus.on(Block.EVENTS.FLOW_RENDER, this._render.bind(this));
  }

  _createResources() {
    if (!this._meta) {
      return;
    }

    const { tagName } = this._meta;
    this._element = this._createDocumentElement(tagName);
  }

  init() {
    this._createResources();

    this.eventBus().emit(Block.EVENTS.FLOW_RENDER);
  }

  _componentDidMount() {
    this.componentDidMount();
    Object.values(this.children).forEach(child => {
      child.dispatchComponentDidMount();
    });
  }

  componentDidMount() {}

  dispatchComponentDidMount() {
    this.eventBus().emit(Block.EVENTS.FLOW_CDM);
  }

  _componentDidUpdate(...args: unknown[]) {
    const [oldProps, newProps] = args as [
      BlockPropsAndChildrenType,
      BlockPropsAndChildrenType,
    ];
    const isReRender = this.componentDidUpdate(oldProps, newProps);
    if (isReRender) {
      this.eventBus().emit(Block.EVENTS.FLOW_RENDER);
    }
  }

  componentDidUpdate(
    oldProps: BlockPropsAndChildrenType,
    newProps: BlockPropsAndChildrenType,
  ) {
    console.log('componentDidUpdate', oldProps, newProps);
    return true;
  }

  get element() {
    return this._element;
  }

  _addEvents() {
    if (!this._element) {
      return;
    }

    const { events = {} } = this.props;

    Object.keys(events).forEach(eventName => {
      this._element!.addEventListener(eventName, events[eventName]);
    });
  }

  _removeEvents() {
    if (!this._element) {
      return;
    }

    const { events = {} } = this.props;

    Object.keys(events).forEach(eventName => {
      this._element!.removeEventListener(eventName, events[eventName]);
    });
  }

  compile(template: string, props: BlockPropsType) {
    const propsAndStubs = { ...props, ...this.props };

    Object.entries(this.children).forEach(([key, child]) => {
      propsAndStubs[key] = `<div data-id="${child._id}"></div>`;
    });

    Object.entries(this.list).forEach(([key]) => {
      propsAndStubs[key] = `<div data-id="__l_${key}"></div>`;
    });

    const fragment = this._createDocumentElement(
      'template',
    ) as HTMLTemplateElement;

    fragment.innerHTML = Handlebars.compile(template)(propsAndStubs);

    Object.values(this.children).forEach(child => {
      const stub = fragment.content.querySelector(`[data-id="${child._id}"]`);

      if (!stub || !child.getContent()) {
        return;
      }

      stub.replaceWith(child.getContent() as HTMLElement);
    });

    Object.entries(this.list).forEach(([key, child]) => {
      const stub = fragment.content.querySelector(`[data-id="__l_${key}"]`);

      if (!stub) {
        return;
      }

      const listContent = this._createDocumentElement(
        'template',
      ) as HTMLTemplateElement;

      child.forEach(item => {
        listContent.content.append(item.getContent() as HTMLElement);
      });

      stub.replaceWith(listContent.content);
    });

    return fragment.content;
  }

  _render() {
    if (!this._element) {
      return;
    }

    const block = this.render() as unknown as DocumentFragment;
    this._removeEvents();
    this._element.innerHTML = '';

    this._element.appendChild(block);

    this._addEvents();
  }

  render() {}

  getContent() {
    return this.element;
  }

  setProps = (newProps: BlockPropsType) => {
    if (!newProps) {
      return;
    }

    this._setUpdate = false;
    const oldValue = { ...this.props };

    const { props, children, list } = Block._getChildren(newProps);

    if (Object.values(children).length) {
      Object.assign(this.children, children);
    }

    if (Object.values(props).length) {
      Object.assign(this.props, props);
    }

    if (Object.values(list).length) {
      Object.assign(this.list, list);
    }

    if (this._setUpdate) {
      this.eventBus().emit(Block.EVENTS.FLOW_CDU, oldValue, this.props);
      this._setUpdate = false;
    }
  };

  _makePropsProxy(props: BlockPropsType | BlockListType | BlockChildrenType) {
    const self = this;

    return new Proxy(props, {
      get(target, prop: string) {
        const value = target[prop];
        return typeof value === 'function' ? value.bind(target) : value;
      },
      set(target, prop: string, value) {
        if (target[prop] !== value) {
          target[prop] = value;
          self._setUpdate = true;
        }

        return true;
      },
      deleteProperty() {
        throw new Error('Нет доступа');
      },
    });
  }

  static _getChildren(propsAndChildren: BlockPropsType) {
    const children: BlockChildrenType = {};
    const props: BlockPropsType = {};
    const list: BlockListType = {};

    Object.keys(propsAndChildren).forEach(key => {
      const prop = propsAndChildren[key];

      if (prop instanceof Block) {
        children[key] = prop;
      } else if (Array.isArray(prop)) {
        list[key] = prop;
      } else {
        props[key] = prop;
      }
    });

    return { children, props, list };
  }

  _createDocumentElement(tagName: string) {
    const element = document.createElement(tagName);
    if (this._id) {
      element.setAttribute('data-id', this._id);
    }

    return element;
  }
}
