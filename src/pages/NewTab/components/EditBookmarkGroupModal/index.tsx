import { useImmer } from "use-immer";
import { CreateCommandModal } from "~/components/Modal";
import FormItem from "~/components/FormItem";
import { IEditBookmarkGroupModalProps } from "./types";

const EditBookmarkGroupModal = CreateCommandModal<IEditBookmarkGroupModalProps>(
  ({ Modal, modalProps, contentProps }) => {
    const [state, setState] = useImmer({
      bookmarkGroupName: contentProps.bookmarkGroupName,
    });
    return (
      <Modal
        {...modalProps}
        title="修改书签分类名称"
        size="small"
        onOk={() => {
          contentProps.onOk(state.bookmarkGroupName);
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

export default EditBookmarkGroupModal;
