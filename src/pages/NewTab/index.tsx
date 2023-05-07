import { FC, useCallback } from "react";
import { useImmer } from "use-immer";
import { useSelector, useDispatch } from "react-redux";
import { FiBookmark, FiMoon, FiSun } from "react-icons/fi";
import { TStore, switchThemeMode } from "~/store";
import styles from "./style.module.less";
import { IState, TThemeMode } from "./types";
import Button, { ButtonGroup } from "~/components/Button";
import Clock from "./components/Clock";
import SearchBar from "./components/SearchBar";
import BookmarkDrawer from "./components/BookmarkDrawer";
import useBookmarkGroupList from "./hooks/useBookmarkGroupList";

const Main: FC = () => {
  const themeMode = useSelector((state: TStore) => state.themeMode);
  const dispatch = useDispatch();
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
    dispatch(switchThemeMode());
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
              {themeMode.mode === "dark" ? <FiMoon /> : <FiSun />}
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
