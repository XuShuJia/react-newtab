import { BsQuestionCircleFill } from "react-icons/bs";
import Button from "../Button";
import styles from "./style.module.less";
import { CreateCommandModal } from "./index";
import { IConfirmModalProps } from "./types";

const ConfirmModal = CreateCommandModal<IConfirmModalProps>(
  ({ Modal, modalProps, contentProps }) => {
    return (
      <Modal
        {...modalProps}
        renderHeader={false}
        renderFooter={false}
        title={contentProps.title}
        size={[260, 220]}
      >
        <div className={styles["confirm-content"]}>
          <div className={styles["confirm-icon"]}>
            <BsQuestionCircleFill />
          </div>
          <div className={styles["confirm-message"]}>
            {contentProps.message}
          </div>
          <div className={styles["confirm-buttons"]}>
            <Button
              type="primary"
              onClick={() => {
                modalProps.onClose && modalProps.onClose();
                contentProps.onOk && contentProps.onOk();
              }}
            >
              确 定
            </Button>
            <Button
              onClick={() => {
                modalProps.onClose && modalProps.onClose();
                contentProps.onCancel && contentProps.onCancel();
              }}
            >
              取 消
            </Button>
          </div>
        </div>
      </Modal>
    );
  }
);

export default ConfirmModal;
