import React, {
  FC,
  PropsWithChildren,
  memo,
  useEffect,
  useLayoutEffect,
  useRef,
  forwardRef,
} from "react";
import { useImmer } from "use-immer";
import ReactDOM from "react-dom";
import styles from "./style.module.less";
import { IContextMenuProps, IMenuItemProps } from "./types";
import ConfirmModal from "~/components/Modal/ConfirmModal";

const MenuItem: FC<IMenuItemProps & PropsWithChildren> = (props) => {
  return (
    <div
      className={styles["menu-item"]}
      data-danger={props.danger}
      onClick={() => {
        if (props.confirm) {
          ConfirmModal.open({
            title: props.confirmTitle,
            message: props.confirmMessage,
            onOk() {
              props.onClick && props.onClick();
            },
          });
        } else {
          props.onClick && props.onClick();
        }
      }}
    >
      {props.children}
    </div>
  );
};

const MenuItemDivider: FC = () => {
  return <div className={styles["menu-item-divider"]}></div>;
};

const ContextMenu: FC<IContextMenuProps & PropsWithChildren> = memo(
  forwardRef((props, ref) => {
    const [state, setState] = useImmer({
      render: false,
      show: false,
    });
    const clickedRef = useRef(false);

    useLayoutEffect(() => {
      if (props.open && !state.render && !state.show) {
        setState((draft) => {
          draft.render = true;
        });
        requestAnimationFrame(() => {
          setState((draft) => {
            draft.show = true;
          });
        });
      }
      if (!props.open && state.render && state.show) {
        setState((draft) => {
          draft.show = false;
          draft.render = false;
        });
        props.onClosed && props.onClosed();
        // setTimeout(() => {
        //   setState((draft) => {
        //     draft.render = false;
        //     props.onClosed && props.onClosed();
        //   });
        // }, 300);
      }
    }, [props.open, state.render, state.show]);

    useEffect(() => {
      const handleWindowClick = () => {
        props.onClose && props.onClose();
      };
      window.addEventListener("click", handleWindowClick);
      return () => {
        window.removeEventListener("click", handleWindowClick);
      };
    }, []);

    if (!state.render) return null;

    return ReactDOM.createPortal(
      <div
        ref={ref}
        className={styles["context-menu"]}
        data-show={state.show}
        style={{
          top: `${props.top}px`,
          left: `${props.left}px`,
        }}
        onClick={(e) => {
          if (clickedRef.current) return;
          clickedRef.current = true;
          e.stopPropagation();
          e.preventDefault();
          setTimeout(() => {
            clickedRef.current = false;
            props.onClose && props.onClose();
          }, 100);
        }}
        onContextMenu={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
      >
        {props.children}
      </div>,
      document.body
    );
  })
);

export { MenuItem, MenuItemDivider };
export { default as useContextMenu } from "./hooks/useContextMenu";
export default ContextMenu;
