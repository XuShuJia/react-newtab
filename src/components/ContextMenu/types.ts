import { MutableRefObject } from "react";

export interface IContextMenuProps {
  ref?: MutableRefObject<HTMLDivElement | null>;
  open?: boolean;
  top?: number;
  left?: number;
  onClose?: () => void;
  onClosed?: () => void;
}

export interface IMenuItemProps {
  disabled?: boolean;
  danger?: boolean;
  confirm?: boolean;
  confirmTitle?: string;
  confirmMessage?: string;
  onClick?: () => void;
}
