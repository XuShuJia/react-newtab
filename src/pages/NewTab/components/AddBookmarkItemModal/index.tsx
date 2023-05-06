import React from "react";
import { nanoid } from "nanoid";
import { CreateCommandModal } from "~/components/Modal";
import FormItem from "~/components/FormItem";
import { IAddBookmarkItemModalProps } from "./types";
import { useImmer } from "use-immer";
import { NSBookmark } from "../../types";

const AddBookmarkGroupModal = CreateCommandModal<IAddBookmarkItemModalProps>(
  ({ Modal, modalProps, contentProps }) => {
    const [state, setState] = useImmer({
      bookmarkName: "",
      bookmarkUrl: "",
    });
    return (
      <Modal
        {...modalProps}
        title="新增书签"
        size="small"
        onOk={() => {
          const newBookmark: NSBookmark.IBookmark = {
            id: nanoid(),
            name: state.bookmarkName,
            url: state.bookmarkUrl,
            icon: `${state.bookmarkUrl}/favicon.ico`,
          };
          contentProps.onOk(newBookmark);
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

export default AddBookmarkGroupModal;
