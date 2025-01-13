import { isEqual } from '../utils/isEqual';
import type { Props, PropsWithChildren } from './Block';
import type Block from './Block';
import type { Indexed, State } from './Store';
import store, { StoreEvents } from './Store';

export type BlockClass<T extends Props> = new (
  props?: PropsWithChildren<T>,
) => Block<T>;

export function connect<
  TProps extends Props,
  TStateProps extends Partial<TProps> = Partial<TProps>,
>(mapStateToProps: (state: State) => TStateProps) {
  return function wrap(Component: BlockClass<TProps>) {
    return class WithStore extends Component {
      private stateProps: Indexed;

      constructor(props: Indexed = {}) {
        const initialStateProps = mapStateToProps(store.getState());
        super({
          ...props,
          ...initialStateProps,
        } as unknown as PropsWithChildren<TProps>);

        this.stateProps = initialStateProps;

        store.on(StoreEvents.Updated, () => {
          const newStateProps = mapStateToProps(store.getState());

          if (!isEqual(this.stateProps, newStateProps)) {
            this.setProps({ ...newStateProps });
            this.stateProps = newStateProps;
          }
        });
      }

      override render(): string {
        console.log('WithStore render');
        return super.render();
      }
    };
  };
}
