import { CreateCommandModal } from "~/components/Modal";
import FormItem from "~/components/FormItem";
import { IEditBookmarkItemModalProps } from "./types";
import { useImmer } from "use-immer";
import { NSBookmark } from "../../types";

const EditBookmarkItemModal = CreateCommandModal<IEditBookmarkItemModalProps>(
  ({ Modal, modalProps, contentProps }) => {
    const [state, setState] = useImmer({
      bookmarkName: contentProps.bookmarkItem.name,
      bookmarkUrl: contentProps.bookmarkItem.url,
    });
    return (
      <Modal
        {...modalProps}
        title="修改书签"
        size="small"
        onOk={() => {
          const bookmarkItem: NSBookmark.IBookmark = {
            ...contentProps.bookmarkItem,
            name: state.bookmarkName,
            url: state.bookmarkUrl,
            icon: `${state.bookmarkUrl}/favicon.ico`,
          };
          contentProps.onOk(bookmarkItem);
        }}
      >
        <FormItem label="书签名称">
          <input
            value={state.bookmarkName}
            onChange={(e) => {
              setState((draft) => {
                draft.bookmarkName = e.target.value;
              });
            }}
          />
        </FormItem>
        <FormItem label="书签地址">
          <input
            value={state.bookmarkUrl}
            onChange={(e) => {
              setState((draft) => {
                draft.bookmarkUrl = e.target.value;
              });
            }}
          />
        </FormItem>
      </Modal>
    );
  }
);

export default EditBookmarkItemModal;
