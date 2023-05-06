import { NSBookmark } from "../../types";

export interface IAddBookmarkItemModalProps {
  onOk: (newBookmarkItem: NSBookmark.IBookmark) => void;
}
