import { NSBookmark } from "../../types";

export interface IEditBookmarkItemModalProps {
  bookmarkItem: NSBookmark.IBookmark;
  onOk: (bookmarkItem: NSBookmark.IBookmark) => void;
}
