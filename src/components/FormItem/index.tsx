import { FC, PropsWithChildren } from "react";
import styles from "./style.module.less";
import { IFormItemProps } from "./types";

const FormItem: FC<IFormItemProps & PropsWithChildren> = (props) => {
  return (
    <div className={styles["form-item"]}>
      {props.label ? (
        <div className={[styles["item-label"], "theme-transition"].join(" ")}>
          {props.label}
        </div>
      ) : null}
      <div className={styles["item-content"]}>{props.children}</div>
    </div>
  );
};

export default FormItem;
