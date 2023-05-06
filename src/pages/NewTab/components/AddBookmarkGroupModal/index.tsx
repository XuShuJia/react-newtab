import { nanoid } from "nanoid";
import { useImmer } from "use-immer";
import { CreateCommandModal } from "~/components/Modal";
import FormItem from "~/components/FormItem";
import { IAddBookmarkGroupModalProps } from "./types";
import { NSBookmark } from "../../types";

const AddBookmarkGroupModal = CreateCommandModal<IAddBookmarkGroupModalProps>(
  ({ Modal, modalProps, contentProps }) => {
    const [state, setState] = useImmer({
      bookmarkGroupName: "",
    });
    return (
      <Modal
        {...modalProps}
        title="新增书签分类"
        size="small"
        onOk={() => {
          const newBookmarkGroup: NSBookmark.IBookmarkGroup = {
            id: nanoid(),
            name: state.bookmarkGroupName,
            bookmarks: [],
          };
          contentProps.onOk(newBookmarkGroup);
        }}
      >
        <FormItem label="分类名">
          <input
            value={state.bookmarkGroupName}
            onChange={(e) => {
              setState((draft) => {
                draft.bookmarkGroupName = e.target.value;
              });
            }}
          />
        </FormItem>
      </Modal>
    );
  }
);

export default AddBookmarkGroupModal;
