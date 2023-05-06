import { ReactNode, MouseEvent } from "react";
import { NSBookmark } from "../../types";

export interface IBookmarkDrawerProps {
  open: boolean;
  bookmarkGroupList: NSBookmark.TBookmarkGroupList;
  onImportBookmark: () => void;
  onExportBookmark: () => void;
  onAddBookmarkGroup: () => void;
  onAddBookmarkItem: (bookmarkGroupId: string) => void;
  onEditBookmarkGroup: (bookmarkGroupId: string) => void;
  onEditBookmarkItem: (bookmarkGroupId: string, bookmarkItemId: string) => void;
  onDeleteBookmarkGroup: (bookmarkGroupId: string) => void;
  onDeleteBookmarkItem: (
    bookmarkGroupId: string,
    bookmarkItemId: string
  ) => void;
  onMoveUpBookmarkGroup: (bookmarkGroupId: string) => void;
  onMoveDownBookmarkGroup: (bookmarkGroupId: string) => void;
  onMoveUpBookmarkItem: (
    bookmarkGroupId: string,
    bookmarkItemId: string
  ) => void;
  onMoveDownBookmarkItem: (
    bookmarkGroupId: string,
    bookmarkItemId: string
  ) => void;
  onClose: () => void;
}

export interface IDrawerContentBoxProps {
  title: string;
  onAdd: () => void;
}

export interface IBookmarkListItemProps {
  icon: ReactNode;
  title: string;
  arrow?: boolean;
  active?: boolean;
  onClick: () => void;
  onContextMenu?: (e: MouseEvent<HTMLDivElement>) => void;
}
