import { FC, useCallback, useLayoutEffect } from "react";
import { useImmer } from "use-immer";
import { FiBookmark, FiMoon, FiSun } from "react-icons/fi";
import styles from "./style.module.less";
import { IState, TThemeMode } from "./types";
import Button, { ButtonGroup } from "~/components/Button";
import Clock from "./components/Clock";
import SearchBar from "./components/SearchBar";
import BookmarkDrawer from "./components/BookmarkDrawer";
import useBookmarkGroupList from "./hooks/useBookmarkGroupList";

const Main: FC = () => {
  const [state, setState] = useImmer<IState>({
    themeMode:
      (document.documentElement.dataset.theme as TThemeMode) || "light",
    openBookmarkDrawer: false,
  });
  const {
    bookmarkGroupList,
    handleImportBookmark,
    handleExportBookmark,
    handleAddBookmarkGroup,
    handleAddBookmarkItem,
    handleEditBookmarkGroup,
    handleEditBookmarkItem,
    handleDeleteBookmarkGroup,
    handleDeleteBookmarkItem,
    handleMoveUpBookmarkGroup,
    handleMoveUpBookmarkItem,
    handleMoveDownBookmarkGroup,
    handleMoveDownBookmarkItem,
  } = useBookmarkGroupList();

  const handleSwitchThemeMode = () => {
    setState((draft) => {
      const themeMode = draft.themeMode === "light" ? "dark" : "light";
      document.documentElement.dataset.theme = themeMode;
      draft.themeMode = themeMode;
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

  useLayoutEffect(() => {
    let themeMode: TThemeMode = "light";
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      themeMode = "dark";
    }
    setState((draft) => {
      draft.themeMode = themeMode;
    });
    document.documentElement.dataset.theme = themeMode;
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", (e) => {
        let themeMode: TThemeMode = "light";
        if (e.matches) {
          themeMode = "dark";
        }
        setState((draft) => {
          draft.themeMode = themeMode;
        });
        document.documentElement.dataset.theme = themeMode;
      });
  }, []);

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
              {state.themeMode === "dark" ? <FiMoon /> : <FiSun />}
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
        bookmarkGroupList={bookmarkGroupList}
        onClose={handleCloseBookmarkDrawer}
        onImportBookmark={handleImportBookmark}
        onExportBookmark={handleExportBookmark}
        onAddBookmarkGroup={handleAddBookmarkGroup}
        onAddBookmarkItem={handleAddBookmarkItem}
        onEditBookmarkGroup={handleEditBookmarkGroup}
        onEditBookmarkItem={handleEditBookmarkItem}
        onDeleteBookmarkGroup={handleDeleteBookmarkGroup}
        onDeleteBookmarkItem={handleDeleteBookmarkItem}
        onMoveUpBookmarkGroup={handleMoveUpBookmarkGroup}
        onMoveUpBookmarkItem={handleMoveUpBookmarkItem}
        onMoveDownBookmarkGroup={handleMoveDownBookmarkGroup}
        onMoveDownBookmarkItem={handleMoveDownBookmarkItem}
      />
    </div>
  );
};

export default Main;
