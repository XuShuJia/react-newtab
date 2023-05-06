import { useRef } from "react";
import { useImmer } from "use-immer";

export default () => {
  const [state, setState] = useImmer({
    open: false,
    top: 0,
    left: 0,
  });

  const ref = useRef<HTMLDivElement | null>(null);

  const open = (top: number, left: number) => {
    setState((draft) => {
      draft.open = true;
      draft.top = top;
      draft.left = left;
      requestAnimationFrame(() => {
        if (ref.current) {
          const { innerWidth, innerHeight } = window;
          const { width, height } = ref.current.getBoundingClientRect();
          setState((draft) => {
            let top = draft.top;
            let left = draft.left;
            top = top < 0 ? 0 : top;
            top = top + height > innerHeight ? innerHeight - height : top;
            left = left < 0 ? 0 : left;
            left = left + width > innerWidth ? innerWidth - width : left;
            draft.top = top;
            draft.left = left;
          });
        }
      });
    });
  };

  const onClose = () => {
    setState((draft) => {
      draft.open = false;
    });
  };

  return {
    ref,
    open,
    onClose,
    state,
  };
};
