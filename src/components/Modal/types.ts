import { ReactElement } from "react";

export type TModalSize = "default" | "small" | "large";

export type IModalSizeMap = {
  [size in TModalSize]: [width: number, height: number];
};

export interface IModalProps {
  title: string;
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
  onOk?: () => void;
  onCancel?: () => void;
  onClose: () => void;
  onClosed?: () => void;
}
