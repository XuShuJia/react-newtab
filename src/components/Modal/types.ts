import { ReactElement } from "react";
import Modal from "./index";

export type TModalSize = "default" | "small" | "large";

export type IModalSizeMap = {
  [size in TModalSize]: [width: number, height: number];
};

export interface IModalInstance {
  doClose: () => void;
}

export interface IModalProps {
  title?: string;
  size?: TModalSize | [width: number, height: number];
  open?: boolean;
  mask?: boolean;
  maskClose?: boolean;
  okButton?: boolean;
  okButtonText?: string;
  okButtonClose?: boolean;
  cancelButton?: boolean;
  cancelButtonText?: string;
  cancelButtonClose?: boolean;
  customButtons?: ReactElement[];
  renderHeader?: boolean;
  renderFooter?: boolean;
  onOk?: () => void;
  onCancel?: () => void;
  onReady?: (instance: IModalInstance) => void;
  onClose?: () => void;
  onClosed?: () => void;
}

export type ModalType = typeof Modal;
export interface ICommandModeContentProps<CP> {
  Modal: ModalType;
  modalProps: IModalProps;
  contentProps: CP;
}

export interface IConfirmModalProps {
  title?: string;
  message?: string;
  onOk?: () => void;
  onCancel?: () => void;
}
