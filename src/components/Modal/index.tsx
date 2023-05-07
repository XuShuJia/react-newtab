/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
  FC,
  PropsWithChildren,
  memo,
  useEffect,
  useLayoutEffect,
  useRef,
} from "react";
import { createPortal } from "react-dom";
import { createRoot } from "react-dom/client";
import { useImmer } from "use-immer";
import { FiX } from "react-icons/fi";
import Button, { ButtonGroup } from "~/components/Button";
import styles from "./style.module.less";
import { IModalProps, IModalSizeMap, ICommandModeContentProps } from "./types";

const ModalSizeMap: IModalSizeMap = {
  default: [420, 600],
  large: [950, 600],
  small: [400, 320],
};

const Modal: FC<IModalProps & PropsWithChildren> = memo((props) => {
  const [state, setState] = useImmer({
    render: false,
    show: false,
  });
  const modalRef = useRef<HTMLDivElement | null>(null);
  const modalRectRef = useRef({
    width: 0,
    height: 0,
    top: 0,
    left: 0,
  });
  const modalCloseBySelfRef = useRef(false);
  const handleClickOk = () => {
    props.onOk && props.onOk();
    if (props.okButtonClose !== false) {
      props.onClose && props.onClose();
    }
  };
  const handleClickCancel = () => {
    props.onCancel && props.onCancel();
    if (props.cancelButtonClose !== false) {
      props.onClose && props.onClose();
    }
  };

  useLayoutEffect(() => {
    if (modalCloseBySelfRef.current) return;
    if (props.open && !state.render && !state.show) {
      setState((draft) => {
        draft.render = true;
      });
    }
    if (props.open && state.render && !state.show) {
      requestAnimationFrame(() => {
        setState((draft) => {
          draft.show = true;
        });
      });
    }
    if (!props.open && state.render && state.show) {
      setState((draft) => {
        draft.show = false;
      });
      setTimeout(() => {
        setState((draft) => {
          draft.render = false;
          props.onClosed && props.onClosed();
        });
      }, 300);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.open, props.onClosed, state.render, state.show]);

  useEffect(() => {
    let timer: NodeJS.Timer;
    function updateSizeInfo() {
      modalRectRef.current.width = ModalSizeMap.default[0];
      modalRectRef.current.height = ModalSizeMap.default[1];
      if (
        Array.isArray(props.size) &&
        props.size.length === 2 &&
        typeof props.size[0] === "number" &&
        typeof props.size[1] === "number"
      ) {
        modalRectRef.current.width = props.size[0];
        modalRectRef.current.height = props.size[1];
      } else if (
        props.size &&
        !Array.isArray(props.size) &&
        ModalSizeMap[props.size]
      ) {
        modalRectRef.current.width = ModalSizeMap[props.size][0];
        modalRectRef.current.height = ModalSizeMap[props.size][1];
      }
    }
    function updatePositionInfo() {
      const { width, height } = modalRectRef.current;
      modalRectRef.current.top = window.innerHeight * 0.5 - height * 0.5;
      modalRectRef.current.left = window.innerWidth * 0.5 - width * 0.5;
    }
    function updateModalStyle() {
      if (modalRef.current) {
        const { width, height, top, left } = modalRectRef.current;
        modalRef.current.style.width = `${width}px`;
        modalRef.current.style.height = `${height}px`;
        modalRef.current.style.top = `${top}px`;
        modalRef.current.style.left = `${left}px`;
      }
    }
    function handleWindowResize() {
      clearTimeout(timer);
      timer = setTimeout(() => {
        updatePositionInfo();
        updateModalStyle();
      }, 300);
    }
    updateSizeInfo();
    updatePositionInfo();
    updateModalStyle();
    window.addEventListener("resize", handleWindowResize);
    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, [props.size, state.render]);

  // CCM Mode
  useEffect(() => {
    if (props.onReady) {
      props.onReady({
        doClose() {
          modalCloseBySelfRef.current = true;
          setState((draft) => {
            draft.show = false;
          });
          setTimeout(() => {
            setState((draft) => {
              draft.render = false;
            });
            props.onClosed && props.onClosed();
            modalCloseBySelfRef.current = false;
          }, 300);
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!state.render) return null;

  return createPortal(
    <>
      {props.mask !== false ? (
        <div data-show={state.show} className={styles["modal-mask"]}></div>
      ) : null}
      <div ref={modalRef} className={styles.modal} data-show={state.show}>
        {props.renderHeader !== false ? (
          <div className={styles["modal-header"]}>
            <div
              className={[styles["modal-title"], "theme-transition"].join(" ")}
            >
              {props.title}
            </div>
            <div
              className={[styles["modal-close"], "theme-transition"].join(" ")}
              onClick={props.onClose}
            >
              <FiX />
            </div>
          </div>
        ) : null}
        <div className={styles["modal-content"]}>{props.children}</div>
        {((props.customButtons && props.customButtons.length > 0) ||
          props.okButton !== false ||
          props.cancelButton !== false) &&
        props.renderFooter !== false ? (
          <div className={styles["modal-footer"]}>
            <ButtonGroup>
              {props.customButtons}
              {props.okButton !== false ? (
                <Button type="primary" onClick={handleClickOk}>
                  {props.okButtonText || "确 定"}
                </Button>
              ) : null}
              {props.cancelButton !== false ? (
                <Button onClick={handleClickCancel}>
                  {props.cancelButtonText || "取 消"}
                </Button>
              ) : null}
            </ButtonGroup>
          </div>
        ) : null}
      </div>
    </>,
    document.body
  );
});

const CreateCommandModal = <CP = object,>(
  Content: FC<ICommandModeContentProps<CP>>
) => {
  let doCloseModal = () => {};
  const open = (contentProps?: CP, modalProps?: IModalProps) => {
    const mountNode = document.body.appendChild(document.createElement("div"));
    const root = createRoot(mountNode);
    root.render(
      <React.StrictMode>
        <Content
          Modal={Modal}
          modalProps={{
            ...modalProps,
            open: true,
            onReady(instance) {
              doCloseModal = instance.doClose;
            },
            onClose() {
              doCloseModal();
            },
            onClosed() {
              root.unmount();
              document.body.removeChild(mountNode);
            },
          }}
          contentProps={(contentProps || {}) as unknown as any}
        />
      </React.StrictMode>
    );
  };
  const close = () => {
    doCloseModal();
  };
  return {
    open,
    close,
  };
};

export { ModalSizeMap, CreateCommandModal };
// export { default as ConfirmModal } from "./ConfirmModal";
export default Modal;
