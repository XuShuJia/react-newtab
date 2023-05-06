import React, { FC, PropsWithChildren, memo, useEffect, useRef } from "react";
import { useImmer } from "use-immer";
import { FiPlus, FiFolder, FiChevronRight } from "react-icons/fi";
import styles from "./style.module.less";
import {
  IBookmarkDrawerProps,
  IDrawerContentBoxProps,
  IBookmarkListItemProps,
} from "./types";
import Button, { ButtonGroup } from "~/components/Button";
import ContextMenu, {
  MenuItem,
  MenuItemDivider,
  useContextMenu,
} from "~/components/ContextMenu";

const DrawerContentBox: FC<IDrawerContentBoxProps & PropsWithChildren> = (
  props
) => {
  return (
    <div className={styles["drawer-content-box"]}>
      <div className={styles["drawer-content-box-header"]}>
        <div
          className={[
            styles["drawer-content-box-title"],
            "theme-transition",
          ].join(" ")}
        >
          {props.title}
        </div>
        <div className={styles["drawer-content-box-addbutton"]}>
          <Button onClick={props.onAdd}>
            <FiPlus />
          </Button>
        </div>
      </div>
      <div className={styles["drawer-content-box-list"]}>{props.children}</div>
    </div>
  );
};

const BookmarkListItem: FC<IBookmarkListItemProps> = (props) => {
  return (
    <div
      className={[styles.item].join(" ")}
      data-active={props.active}
      onClick={props.onClick}
      onContextMenu={props.onContextMenu}
    >
      <div className={styles["item-icon"]}>
        {typeof props.icon === "string" ? <img src={props.icon} /> : props.icon}
      </div>
      <div className={styles["item-title"]}>{props.title}</div>
      {props.arrow ? (
        <div className={styles["item-arrow"]}>
          <FiChevronRight />
        </div>
      ) : null}
    </div>
  );
};

const BookmarkDrawer: FC<IBookmarkDrawerProps> = memo((props) => {
  const { onAddBookmarkGroup, onAddBookmarkItem } = props;
  const [state, setState] = useImmer({
    bookmarkGroupActiveId: props.bookmarkGroupList[0]
      ? props.bookmarkGroupList[0].id
      : "",
    contextMenuTargetType: "" as "group" | "item",
  });
  const contextMenu = useContextMenu();
  const contextMenuInfoRef = useRef({
    contextMenuTargetId: "",
    contextMenuTargetType: "" as "group" | "item",
  });

  const openBookmarkItemFromContextMenu = (target: string) => {
    props.bookmarkGroupList.forEach((group) => {
      if (group.id === state.bookmarkGroupActiveId) {
        group.bookmarks.forEach((item) => {
          if (item.id === contextMenuInfoRef.current.contextMenuTargetId) {
            window.open(item.url, target);
          }
        });
      }
    });
  };

  const handleClickContextMenu = (
    type: "open" | "openNewPage" | "edit" | "moveUp" | "moveDown" | "delete"
  ) => {
    switch (type) {
      case "open":
        openBookmarkItemFromContextMenu("_self");
        break;
      case "openNewPage":
        openBookmarkItemFromContextMenu("_blank");
        break;
      case "edit":
        if (contextMenuInfoRef.current.contextMenuTargetType === "group") {
          props.onEditBookmarkGroup(
            contextMenuInfoRef.current.contextMenuTargetId
          );
        } else {
          props.onEditBookmarkItem(
            state.bookmarkGroupActiveId,
            contextMenuInfoRef.current.contextMenuTargetId
          );
        }
        break;
      case "moveUp":
        if (contextMenuInfoRef.current.contextMenuTargetType === "group") {
          props.onMoveUpBookmarkGroup(
            contextMenuInfoRef.current.contextMenuTargetId
          );
        } else {
          props.onMoveUpBookmarkItem(
            state.bookmarkGroupActiveId,
            contextMenuInfoRef.current.contextMenuTargetId
          );
        }
        break;
      case "moveDown":
        if (contextMenuInfoRef.current.contextMenuTargetType === "group") {
          props.onMoveDownBookmarkGroup(
            contextMenuInfoRef.current.contextMenuTargetId
          );
        } else {
          props.onMoveDownBookmarkItem(
            state.bookmarkGroupActiveId,
            contextMenuInfoRef.current.contextMenuTargetId
          );
        }
        break;
      case "delete":
        if (contextMenuInfoRef.current.contextMenuTargetType === "group") {
          props.onDeleteBookmarkGroup(
            contextMenuInfoRef.current.contextMenuTargetId
          );
        } else {
          props.onDeleteBookmarkItem(
            state.bookmarkGroupActiveId,
            contextMenuInfoRef.current.contextMenuTargetId
          );
        }
        break;
    }
  };

  const renderBookmarkItems =
    props.bookmarkGroupList.filter(({ id }) => {
      return id === state.bookmarkGroupActiveId;
    })[0]?.bookmarks || [];

  useEffect(() => {
    if (props.bookmarkGroupList.length > 0 && !state.bookmarkGroupActiveId) {
      setState((draft) => {
        draft.bookmarkGroupActiveId = props.bookmarkGroupList[0].id;
      });
    }
  }, [props.bookmarkGroupList]);

  return (
    <>
      <div
        className={[styles["bookmark-drawer"], "theme-transition"].join(" ")}
        data-open={props.open}
      >
        <div className={styles["drawer-content"]}>
          <DrawerContentBox title="书签分类" onAdd={onAddBookmarkGroup}>
            {props.bookmarkGroupList.map(({ id, name }) => {
              return (
                <BookmarkListItem
                  key={id}
                  icon={<FiFolder />}
                  title={name}
                  arrow
                  active={id === state.bookmarkGroupActiveId}
                  onClick={() => {
                    setState((draft) => {
                      draft.bookmarkGroupActiveId = id;
                    });
                  }}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    contextMenuInfoRef.current.contextMenuTargetId = id;
                    contextMenuInfoRef.current.contextMenuTargetType = "group";
                    contextMenu.open(e.clientY, e.clientX);
                    setState((draft) => {
                      draft.contextMenuTargetType = "group";
                    });
                  }}
                />
              );
            })}
          </DrawerContentBox>
          <div
            className={[styles["content-divider"], "theme-transition"].join(
              " "
            )}
          />
          <DrawerContentBox
            title="书签列表"
            onAdd={() => onAddBookmarkItem(state.bookmarkGroupActiveId)}
          >
            {renderBookmarkItems.map(({ id, name, icon, url }) => {
              return (
                <BookmarkListItem
                  key={id}
                  icon={icon}
                  title={name}
                  onClick={() => {
                    // =>>
                    window.open(url, "_self");
                  }}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    contextMenuInfoRef.current.contextMenuTargetId = id;
                    contextMenuInfoRef.current.contextMenuTargetType = "item";
                    contextMenu.open(e.clientY, e.clientX);
                    setState((draft) => {
                      draft.contextMenuTargetType = "item";
                    });
                  }}
                />
              );
            })}
          </DrawerContentBox>
        </div>
        <div
          className={[styles["drawer-footer"], "theme-transition"].join(" ")}
        >
          <ButtonGroup>
            <Button onClick={props.onExportBookmark}>备份</Button>
            <Button onClick={props.onImportBookmark}>导入备份</Button>
          </ButtonGroup>
        </div>
      </div>
      <ContextMenu
        ref={contextMenu.ref}
        {...contextMenu.state}
        onClose={contextMenu.onClose}
      >
        {state.contextMenuTargetType === "item" ? (
          <>
            <MenuItem onClick={() => handleClickContextMenu("open")}>
              打开
            </MenuItem>
            <MenuItem onClick={() => handleClickContextMenu("openNewPage")}>
              新页面打开
            </MenuItem>
            <MenuItemDivider />
          </>
        ) : null}
        <MenuItem onClick={() => handleClickContextMenu("edit")}>编辑</MenuItem>
        <MenuItem onClick={() => handleClickContextMenu("moveUp")}>
          上移
        </MenuItem>
        <MenuItem onClick={() => handleClickContextMenu("moveDown")}>
          下移
        </MenuItem>
        <MenuItemDivider />
        <MenuItem
          danger
          confirm
          confirmTitle="确认删除"
          confirmMessage="确实要删除此项？"
          onClick={() => handleClickContextMenu("delete")}
        >
          删除
        </MenuItem>
      </ContextMenu>
    </>
  );
});

export default BookmarkDrawer;
