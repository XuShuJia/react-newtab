import { ReactElement } from "react";
import { NSBookmark } from "../../types";

export interface IBookmarkDrawerProps {
  open: boolean;
  bookmarkGroupList: NSBookmark.TBookmarkGroupList;
  onAddBookmarkGroup: () => void;
  onAddBookmarkItem: (bookmarkGroupId: string) => void;
  onClose: () => void;
}

export interface IDrawerContentBoxProps {
  title: string;
  onAdd: () => void;
}

export interface IBookmarkListItemProps {
  icon: ReactElement;
  title: string;
  onClick: () => void;
}
