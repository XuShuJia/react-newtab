import React, { FC, useCallback } from "react";
import { useImmer } from "use-immer";
import { FiBookmark, FiMoon, FiSun } from "react-icons/fi";
import styles from "./style.module.less";
import { NSBookmark } from "./types";
import Button, { ButtonGroup } from "~/components/Button";
import Modal from "~/components/Modal";
import Clock from "./components/Clock";
import SearchBar from "./components/SearchBar";
import BookmarkDrawer from "./components/BookmarkDrawer";

const Main: FC = () => {
  const [state, setState] = useImmer({
    openBookmarkDrawer: false,
    openAddBookmarkGroupModal: false,
    darkMode: document.documentElement.dataset.theme === "dark",
    bookmarkGroupList: [] as NSBookmark.TBookmarkGroupList,
  });
  const handleSwitchThemeMode = () => {
    setState((draft) => {
      const darkMode = !draft.darkMode;
      draft.darkMode = darkMode;
      document.documentElement.dataset.theme = darkMode ? "dark" : "light";
    });
  };
  const handleSwitchBookmarkDrawer = () => {
    setState((draft) => {
      draft.openBookmarkDrawer = !draft.openBookmarkDrawer;
    });
  };
  const handleCloseBookmarkDrawer = useCallback(() => {
    setState((draft) => {
      draft.openBookmarkDrawer = false;
    });
  }, [setState]);
  return (
    <div className={styles.container}>
      <div className={styles["header-bar"]}>
        <div className={styles["header-bar-left"]}></div>
        <div className={styles["header-bar-right"]}>
          <ButtonGroup>
            <Button
              type={state.openBookmarkDrawer ? "primary" : "default"}
              icon
              onClick={handleSwitchBookmarkDrawer}
            >
              <FiBookmark /> 书签
            </Button>
            <Button onClick={handleSwitchThemeMode}>
              {state.darkMode ? <FiMoon /> : <FiSun />}
            </Button>
          </ButtonGroup>
        </div>
      </div>
      <div className={styles["center-box"]}>
        <Clock />
        <SearchBar />
      </div>
      <BookmarkDrawer
        open={state.openBookmarkDrawer}
        bookmarkGroupList={state.bookmarkGroupList}
        onClose={handleCloseBookmarkDrawer}
        onAddBookmarkGroup={() =>
          setState((draft) => {
            draft.openAddBookmarkGroupModal = true;
          })
        }
        onAddBookmarkItem={(bookmarkGroupId) => {}}
      />
      <Modal
        size="small"
        title="新增书签分类"
        open={state.openAddBookmarkGroupModal}
        onClose={() =>
          setState((draft) => {
            draft.openAddBookmarkGroupModal = false;
          })
        }
      >
        <div>Content</div>
      </Modal>
    </div>
  );
};

export default Main;
