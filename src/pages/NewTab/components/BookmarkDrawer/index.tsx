import React, { FC, PropsWithChildren, memo } from "react";
import { useImmer } from "use-immer";
import { FiPlus, FiFolder } from "react-icons/fi";
import styles from "./style.module.less";
import {
  IBookmarkDrawerProps,
  IDrawerContentBoxProps,
  IBookmarkListItemProps,
} from "./types";
import Button, { ButtonGroup } from "~/components/Button";

const DrawerContentBox: FC<IDrawerContentBoxProps & PropsWithChildren> = (
  props
) => {
  const { title, children, onAdd } = props;
  return (
    <div className={styles["drawer-content-box"]}>
      <div className={styles["drawer-content-box-header"]}>
        <div
          className={[
            styles["drawer-content-box-title"],
            "theme-transition",
          ].join(" ")}
        >
          {title}
        </div>
        <div className={styles["drawer-content-box-addbutton"]}>
          <Button onClick={onAdd}>
            <FiPlus />
          </Button>
        </div>
      </div>
      <div className={styles["drawer-content-box-list"]}>{children}</div>
    </div>
  );
};

const BookmarkListItem: FC<IBookmarkListItemProps> = (props) => {
  const { title, icon, onClick } = props;
  return (
    <div className={styles["drawer-content-box-item"]} onClick={onClick}>
      <div>{icon}</div>
      <div>{title}</div>
    </div>
  );
};

const BookmarkDrawer: FC<IBookmarkDrawerProps> = memo((props) => {
  const { open, bookmarkGroupList } = props;
  const { onAddBookmarkGroup, onAddBookmarkItem } = props;
  const [state, setState] = useImmer({
    bookmarkGroupActiveId: bookmarkGroupList[0] ? bookmarkGroupList[0].id : "",
  });

  return (
    <div
      className={[styles["bookmark-drawer"], "theme-transition"].join(" ")}
      data-open={open}
    >
      <div className={styles["drawer-content"]}>
        <DrawerContentBox title="书签分类" onAdd={onAddBookmarkGroup}>
          {bookmarkGroupList.map(({ id, name }) => {
            return (
              <BookmarkListItem
                key={id}
                title={name}
                icon={<FiFolder />}
                onClick={() => {}}
              />
            );
          })}
        </DrawerContentBox>
        <div
          className={[styles["content-divider"], "theme-transition"].join(" ")}
        />
        <DrawerContentBox
          title="书签列表"
          onAdd={() => onAddBookmarkItem(state.bookmarkGroupActiveId)}
        ></DrawerContentBox>
      </div>
      <div className={[styles["drawer-footer"], "theme-transition"].join(" ")}>
        <ButtonGroup>
          <Button>导出</Button>
          <Button>导入</Button>
        </ButtonGroup>
        {/* <div
          className={[styles["close-button"], "theme-transition"].join(" ")}
          onClick={onClose}
        >
          <FiX />
        </div> */}
      </div>
    </div>
  );
});

export default BookmarkDrawer;
