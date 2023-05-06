import { useRef, useCallback } from "react";
import { useImmer } from "use-immer";
import { NSBookmark } from "../types";
import AddBookmarkGroupModal from "../components/AddBookmarkGroupModal";
import AddBookmarkItemModal from "../components/AddBookmarkItemModal";
import EditBookmarkGroupModal from "../components/EditBookmarkGroupModal";
import EditBookmarkItemModal from "../components/EditBookmarkItemModal";
import { nanoid } from "nanoid";

export default () => {
  const [bookmarkGroupList, updateBookmarkGroupList] = useImmer(
    (() => {
      let bookmarkGroupList: NSBookmark.TBookmarkGroupList = [];
      const localStoreBookmarkGroupListData: NSBookmark.TBookmarkGroupList =
        JSON.parse(localStorage.getItem("bookmarks") || "[]");
      if (Array.isArray(localStoreBookmarkGroupListData)) {
        bookmarkGroupList = localStoreBookmarkGroupListData;
      }
      return bookmarkGroupList;
    })()
  );
  const bookmarkGroupListRef = useRef(bookmarkGroupList);
  bookmarkGroupListRef.current = bookmarkGroupList;

  const updateLocalStoreBookmarkData = () => {
    requestAnimationFrame(() => {
      localStorage.setItem(
        "bookmarks",
        JSON.stringify(bookmarkGroupListRef.current)
      );
    });
  };

  const handleImportBookmark = useCallback(() => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.addEventListener("change", () => {
      const files = fileInput.files;
      if (files) {
        const fileReader = new FileReader();
        fileReader.addEventListener("load", (e) => {
          if (fileReader.result && typeof fileReader.result === "string") {
            const bookmarkGroupList = JSON.parse(
              fileReader.result
            ) as NSBookmark.TBookmarkGroupList;
            updateBookmarkGroupList(bookmarkGroupList);
            updateLocalStoreBookmarkData();
          }
        });
        fileReader.readAsText(files[0]);
      }
    });
    fileInput.click();
  }, []);

  const handleExportBookmark = useCallback(() => {
    const bookmarkJsonString = JSON.stringify(bookmarkGroupListRef.current);
    const bolb = new Blob([bookmarkJsonString], { type: "application/json" });
    const url = URL.createObjectURL(bolb);
    const a = document.createElement("a");
    const d = new Date();
    const year = d.getFullYear();
    let month: number | string = d.getMonth() + 1;
    let date: number | string = d.getDate();
    let hours: number | string = d.getHours();
    let minutes: number | string = d.getMinutes();
    month = month < 10 ? `0${month}` : month;
    date = date < 10 ? `0${date}` : date;
    hours = hours < 10 ? `0${hours}` : hours;
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    a.href = url;
    a.download = `bookmarks_export_${nanoid(
      4
    ).toLocaleLowerCase()}_${year}${month}${date}${hours}${minutes}`;
    a.style.visibility = "hidden";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, []);

  const handleAddBookmarkGroup = useCallback(() => {
    AddBookmarkGroupModal.open({
      onOk(newBookmarkGroup) {
        updateBookmarkGroupList((draft) => {
          draft.push(newBookmarkGroup);
          updateLocalStoreBookmarkData();
        });
      },
    });
  }, []);

  const handleAddBookmarkItem = useCallback((bookmarkGroupId: string) => {
    AddBookmarkItemModal.open({
      onOk(newBookmarkItem) {
        updateBookmarkGroupList((draft) => {
          draft.forEach(({ id }, index) => {
            if (id === bookmarkGroupId) {
              draft[index].bookmarks.push(newBookmarkItem);
              updateLocalStoreBookmarkData();
            }
          });
        });
      },
    });
  }, []);

  const handleEditBookmarkGroup = useCallback((bookmarkGroupId: string) => {
    const bookmarkGroup = bookmarkGroupListRef.current.find(
      ({ id }) => id === bookmarkGroupId
    );
    if (bookmarkGroup) {
      EditBookmarkGroupModal.open({
        bookmarkGroupName: bookmarkGroup.name,
        onOk(newBookmarkGroupName) {
          updateBookmarkGroupList((draft) => {
            draft.forEach(({ id }, index) => {
              if (id === bookmarkGroup.id) {
                draft[index].name = newBookmarkGroupName;
                updateLocalStoreBookmarkData();
              }
            });
          });
        },
      });
    }
  }, []);

  const handleEditBookmarkItem = useCallback(
    (bookmarkGroupId: string, bookmarkItemId: string) => {
      const bookmarkGroup = bookmarkGroupListRef.current.find(
        ({ id }) => id === bookmarkGroupId
      );
      if (bookmarkGroup) {
        const bookmarkItem = bookmarkGroup.bookmarks.find(
          ({ id }) => id === bookmarkItemId
        );
        if (bookmarkItem) {
          EditBookmarkItemModal.open({
            bookmarkItem,
            onOk(_bookmarkItem) {
              updateBookmarkGroupList((draft) => {
                draft.forEach((group, groupIndex) => {
                  if (group.id === bookmarkGroupId) {
                    group.bookmarks.forEach((item, itemIndex) => {
                      if (item.id === bookmarkItemId) {
                        draft[groupIndex].bookmarks[itemIndex] = _bookmarkItem;
                        updateLocalStoreBookmarkData();
                      }
                    });
                  }
                });
              });
            },
          });
        }
      }
    },
    []
  );

  const handleDeleteBookmarkGroup = useCallback((bookmarkGroupId: string) => {
    updateBookmarkGroupList(
      bookmarkGroupListRef.current.filter(({ id }) => id !== bookmarkGroupId)
    );
    updateLocalStoreBookmarkData();
  }, []);

  const handleDeleteBookmarkItem = useCallback(
    (bookmarkGroupId: string, bookmarkItemId: string) => {
      updateBookmarkGroupList((draft) => {
        draft.forEach((group, groupIndex) => {
          if (group.id === bookmarkGroupId) {
            draft[groupIndex].bookmarks = draft[groupIndex].bookmarks.filter(
              ({ id }) => id !== bookmarkItemId
            );
            updateLocalStoreBookmarkData();
          }
        });
      });
    },
    []
  );

  const handleMoveUpBookmarkGroup = useCallback((bookmarkGroupId: string) => {
    let prevIndex = 0;
    let newIndex = 0;
    const newBookmarkGroupList = [...bookmarkGroupListRef.current];
    newBookmarkGroupList.forEach(({ id }, index) => {
      if (id === bookmarkGroupId) {
        prevIndex = index;
        newIndex = prevIndex - 1 < 0 ? 0 : prevIndex - 1;
      }
    });
    const prevIndexItem = newBookmarkGroupList[prevIndex];
    const newIndexItem = newBookmarkGroupList[newIndex];
    newBookmarkGroupList[prevIndex] = newIndexItem;
    newBookmarkGroupList[newIndex] = prevIndexItem;
    updateBookmarkGroupList(newBookmarkGroupList);
    updateLocalStoreBookmarkData();
  }, []);

  const handleMoveUpBookmarkItem = useCallback(
    (bookmarkGroupId: string, bookmarkItemId: string) => {
      let prevIndex = 0;
      let newIndex = 0;
      let groupIndex = 0;
      const newBookmarkGroupList = [...bookmarkGroupListRef.current];
      newBookmarkGroupList.forEach((group, _groupIndex) => {
        if (group.id === bookmarkGroupId) {
          groupIndex = _groupIndex;
          group.bookmarks.forEach((item, itemIndex) => {
            if (item.id === bookmarkItemId) {
              prevIndex = itemIndex;
              newIndex = newIndex = itemIndex - 1 < 0 ? 0 : itemIndex - 1;
            }
          });
        }
      });
      const newTargetBookmarkGroup = JSON.parse(
        JSON.stringify(bookmarkGroupListRef.current[groupIndex])
      ) as NSBookmark.IBookmarkGroup;
      const prevIndexItem = newTargetBookmarkGroup.bookmarks[prevIndex];
      const newIndexItem = newTargetBookmarkGroup.bookmarks[newIndex];
      newTargetBookmarkGroup.bookmarks[newIndex] = prevIndexItem;
      newTargetBookmarkGroup.bookmarks[prevIndex] = newIndexItem;
      newBookmarkGroupList[groupIndex] = newTargetBookmarkGroup;
      updateBookmarkGroupList(newBookmarkGroupList);
      updateLocalStoreBookmarkData();
    },
    []
  );

  const handleMoveDownBookmarkGroup = useCallback((bookmarkGroupId: string) => {
    let prevIndex = 0;
    let newIndex = 0;
    const newBookmarkGroupList = [...bookmarkGroupListRef.current];
    newBookmarkGroupList.forEach(({ id }, index) => {
      if (id === bookmarkGroupId) {
        prevIndex = index;
        newIndex =
          prevIndex + 1 > newBookmarkGroupList.length - 1
            ? newBookmarkGroupList.length - 1
            : prevIndex + 1;
      }
    });
    const prevIndexItem = newBookmarkGroupList[prevIndex];
    const newIndexItem = newBookmarkGroupList[newIndex];
    newBookmarkGroupList[prevIndex] = newIndexItem;
    newBookmarkGroupList[newIndex] = prevIndexItem;
    updateBookmarkGroupList(newBookmarkGroupList);
    updateLocalStoreBookmarkData();
  }, []);

  const handleMoveDownBookmarkItem = useCallback(
    (bookmarkGroupId: string, bookmarkItemId: string) => {
      let prevIndex = 0;
      let newIndex = 0;
      let groupIndex = 0;
      const newBookmarkGroupList = [...bookmarkGroupListRef.current];
      newBookmarkGroupList.forEach((group, _groupIndex) => {
        if (group.id === bookmarkGroupId) {
          groupIndex = _groupIndex;
          group.bookmarks.forEach((item, itemIndex) => {
            if (item.id === bookmarkItemId) {
              prevIndex = itemIndex;
              newIndex =
                itemIndex + 1 > group.bookmarks.length - 1
                  ? group.bookmarks.length - 1
                  : itemIndex + 1;
            }
          });
        }
      });
      const newTargetBookmarkGroup = JSON.parse(
        JSON.stringify(bookmarkGroupListRef.current[groupIndex])
      ) as NSBookmark.IBookmarkGroup;
      const prevIndexItem = newTargetBookmarkGroup.bookmarks[prevIndex];
      const newIndexItem = newTargetBookmarkGroup.bookmarks[newIndex];
      newTargetBookmarkGroup.bookmarks[newIndex] = prevIndexItem;
      newTargetBookmarkGroup.bookmarks[prevIndex] = newIndexItem;
      newBookmarkGroupList[groupIndex] = newTargetBookmarkGroup;
      updateBookmarkGroupList(newBookmarkGroupList);
      updateLocalStoreBookmarkData();
    },
    []
  );

  return {
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
  };
};
