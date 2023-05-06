import { NSBookmark } from "../../types";

export interface IAddBookmarkGroupModalProps {
  onOk: (newBookmarkGroup: NSBookmark.IBookmarkGroup) => void;
}
