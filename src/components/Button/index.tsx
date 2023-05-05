import React, { FC, PropsWithChildren } from "react";
import styles from "./style.module.less";
import { IButtonProps } from "./types";

const Button: FC<IButtonProps & PropsWithChildren> = (props) => {
  const { size = "default", type = "default", onClick } = props;
  return (
    <div
      className={[styles.button, "theme-transition"].join(" ")}
      data-button="true"
      data-size={size}
      data-type={type}
      data-icon={props.icon}
      onClick={onClick}
    >
      {props.children}
    </div>
  );
};

const ButtonGroup: FC<PropsWithChildren> = (props) => {
  return <div className={styles["button-group"]}>{props.children}</div>;
};

export { ButtonGroup };
export default Button;
