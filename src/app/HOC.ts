import type { State } from './Store';
import store, { StoreEvents } from './Store';
import { isEqual } from '../utils/isEqual';
import type Block from './Block';
import type { Props, PropsWithChildren } from './Block';

export type BlockClass<T extends Props> = new (
  props: PropsWithChildren<T>,
) => Block<T>;

export function connect<
  TProps extends Props,
  TStateProps extends Partial<TProps> = Partial<TProps>,
>(mapStateToProps: (state: State) => TStateProps) {
  return function wrap(Component: BlockClass<TProps>) {
    return class WithStore extends Component {
      private stateProps = mapStateToProps(store.getState());

      constructor(props: TProps) {
        super({ ...props, ...mapStateToProps(store.getState()) } as TProps);

        store.on(StoreEvents.Updated, () => {
          const newStateProps = mapStateToProps(store.getState());
          if (!isEqual(this.stateProps, newStateProps)) {
            this.stateProps = { ...newStateProps };
            this.setProps({ ...newStateProps });
          }
        });
      }

      override render(): string {
        return super.render();
      }
    };
  };
}
