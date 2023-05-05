// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace NSBookmark {
  export interface IBookmark {
    id: string;
    name: string;
    url: string;
    icon: string;
  }
  export type TBookmarkList = IBookmark[];
  export interface IBookmarkGroup {
    id: string;
    name: string;
    bookmarks: TBookmarkList;
  }
  export type TBookmarkGroupList = IBookmarkGroup[];
}
