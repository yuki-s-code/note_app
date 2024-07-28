import { createSlice, Dispatch, PayloadAction } from "@reduxjs/toolkit";
// eslint-disable-next-line import/no-cycle
import type { RootState } from "../libs/app/store";
import {
  CREATEISMODAL,
  SEARCHNAME,
  NOTEBLOCKS,
  COMPLEXTREEFOLDER,
  COMPLEXTREENOTE,
  TREEIDGET,
  ITEMINDEX,
  LIVEBLOCK,
  TITLE_ID,
  MENTIONBLOCK,
  APPDESIGN,
  MENTIONPEEK,
} from "../libs/types/note";

export interface NoteState {
  noteBlocks: NOTEBLOCKS;
  createFolderModal: CREATEISMODAL;
  searchName: SEARCHNAME;
  complexAllFolder: any;
  complexFolder: COMPLEXTREEFOLDER;
  complexNote: COMPLEXTREENOTE;
  treeIdGet: TREEIDGET;
  itemIndex: ITEMINDEX;
  liveBlock: LIVEBLOCK;
  titleId: TITLE_ID;
  mentionBlock: MENTIONBLOCK;
  noteJournalOpen: APPDESIGN;
  mentionPeek: MENTIONPEEK;
}

const initialState: NoteState = {
  noteBlocks: {
    id: "",
    contents: {},
    pageLinks: [],
    user: "all",
  },
  createFolderModal: {
    open: 0,
  },
  searchName: {
    name: "",
  },
  complexAllFolder: {},
  complexFolder: {
    index: "",
    canMove: true,
    isFolder: true,
    children: [],
    data: { title: "無題", icon: "📝", image: "", type: "" },
    canRename: true,
    roots: true,
    bookmarks: [],
  },
  complexNote: {
    root: {
      index: "root",
      canMove: true,
      isFolder: true,
      children: [],
      data: { title: "無題", icon: "📝", image: "", type: "" },
      canRename: true,
    },
  },
  treeIdGet: {
    id: "",
  },
  itemIndex: {
    index: "",
  },
  liveBlock: {
    open: false,
  },
  titleId: {
    index: "",
    dataItem: "",
    dataIcon: "📝",
    dataImage: "",
    dataType: "",
  },
  mentionBlock: {
    open: false,
    mentionData: "",
    mentionType: "note",
  },
  noteJournalOpen: {
    appOpen: false,
    appIndex: "",
  },
  mentionPeek: {
    peekDisplay: true,
  },
};

export const NoteSlice = createSlice({
  name: "note",
  initialState,
  reducers: {
    setNoteBlocks: (state, action: PayloadAction<NOTEBLOCKS>) => {
      state.noteBlocks = action.payload;
    },
    resetNoteBlocks: (state) => {
      state.noteBlocks = initialState.noteBlocks;
    },
    setCreateFolderModal: (state, action: PayloadAction<CREATEISMODAL>) => {
      state.createFolderModal = action.payload;
    },
    resetCreateFolderModal: (state) => {
      state.createFolderModal = initialState.createFolderModal;
    },
    setSearchName: (state, action: PayloadAction<SEARCHNAME>) => {
      state.searchName = action.payload;
    },
    resetSearchName: (state) => {
      state.searchName = initialState.searchName;
    },
    setComplexFolder: (state, action: PayloadAction<COMPLEXTREEFOLDER>) => {
      state.complexFolder = action.payload;
    },
    resetComplexFolder: (state) => {
      state.complexFolder = initialState.complexFolder;
    },
    setComplexAllFolder: (state, action: PayloadAction) => {
      state.complexAllFolder = action.payload;
    },
    resetComplexAllFolder: (state) => {
      state.complexAllFolder = initialState.complexAllFolder;
    },
    setTreeIdGet: (state, action: PayloadAction<TREEIDGET>) => {
      state.treeIdGet = action.payload;
    },
    resetTreeIdGet: (state) => {
      state.treeIdGet = initialState.treeIdGet;
    },
    setItemIndex: (state, action: PayloadAction<ITEMINDEX>) => {
      state.itemIndex = action.payload;
    },
    resetItemIndex: (state) => {
      state.itemIndex = initialState.itemIndex;
    },
    setLiveBlock: (state, action: PayloadAction<LIVEBLOCK>) => {
      state.liveBlock = action.payload;
    },
    resetLiveBlock: (state) => {
      state.liveBlock = initialState.liveBlock;
    },
    setTitleId: (state, action: PayloadAction<TITLE_ID>) => {
      state.titleId = action.payload;
    },
    resetTitleId: (state) => {
      state.titleId = initialState.titleId;
    },
    setMentionBlock: (state, action: PayloadAction<MENTIONBLOCK>) => {
      state.mentionBlock = action.payload;
    },
    resetMentionBlock: (state) => {
      state.mentionBlock = initialState.mentionBlock;
    },
    setNoteJournalOpen: (state, action: PayloadAction<APPDESIGN>) => {
      state.noteJournalOpen = action.payload;
    },
    resetNoteJournalOpen: (state) => {
      state.noteJournalOpen = initialState.noteJournalOpen;
    },
    setPeekDisplayOpen: (state, action: PayloadAction<MENTIONPEEK>) => {
      state.mentionPeek = action.payload;
    },
    resetPeekDisplayOpen: (state) => {
      state.mentionPeek = initialState.mentionPeek;
    },
  },
});

export const {
  setNoteBlocks,
  resetNoteBlocks,
  setCreateFolderModal,
  resetCreateFolderModal,
  setSearchName,
  resetSearchName,
  setComplexAllFolder,
  resetComplexAllFolder,
  setComplexFolder,
  resetComplexFolder,
  setTreeIdGet,
  resetTreeIdGet,
  setItemIndex,
  resetItemIndex,
  setLiveBlock,
  resetLiveBlock,
  setTitleId,
  resetTitleId,
  setMentionBlock,
  resetMentionBlock,
  setNoteJournalOpen,
  resetNoteJournalOpen,
  setPeekDisplayOpen,
  resetPeekDisplayOpen,
} = NoteSlice.actions;

export const selectNoteBlocks = (state: RootState) => state.note.noteBlocks;
export const selectCreateFolderModal = (state: RootState) =>
  state.note.createFolderModal;
export const selectSearchName = (state: RootState) => state.note.searchName;
export const selectComplexFolder = (state: RootState) =>
  state.note.complexFolder;
export const selectComplexAllFolder = (state: RootState) =>
  state.note.complexAllFolder;
export const selectComplexNote = (state: RootState) => state.note.complexNote;
export const selectTreeIdGet = (state: RootState) => state.note.treeIdGet;

export const selectItemIndex = (state: RootState) => state.note.itemIndex;
export const selectLiveBlock = (state: RootState) => state.note.liveBlock;

export const selectTitleId = (state: RootState) => state.note.titleId;

export const selectMentionBlock = (state: RootState) => state.note.mentionBlock;
export const selectNoteJournalOpen = (state: RootState) =>
  state.note.noteJournalOpen;
export const selectPeekDisplay = (state: RootState) => state.note.mentionPeek;
export default NoteSlice.reducer;
