import React from "react";
import styles from "./style.module.less";
import { CreateCommandModal } from "./index";
import { IConfirmModalProps } from "./types";

const ConfirmModal = CreateCommandModal<IConfirmModalProps>(
  ({ Modal, modalProps, contentProps }) => {
    return (
      <Modal
        {...modalProps}
        title={contentProps.title}
        size={[350, 170]}
        onOk={contentProps.onOk}
        onCancel={contentProps.onCancel}
      >
        <div className={styles["confirm-message"]}>{contentProps.message}</div>
      </Modal>
    );
  }
);

export default ConfirmModal;
