import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../libs/app/store";
import {
  EDITEDTASKCONTENTS,
  EDITEDTASKCONTENTSNUMBER,
  EDITEDTASKTITLE,
  NEWTASKCONTENTS,
  NEWTASKTITLE,
  TASK,
  TASKMODAL,
} from "../libs/types/task";

export interface TaskState {
  taskList: TASK;
  newTaskTitle: NEWTASKTITLE;
  editedTaskTitle: EDITEDTASKTITLE;
  newTaskContents: NEWTASKCONTENTS;
  editedTaskContents: EDITEDTASKCONTENTS;
  modalOpen: TASKMODAL;
  editedTaskContentsNumber: EDITEDTASKCONTENTSNUMBER;
}
const initialState: TaskState = {
  taskList: {
    id: "",
    title: "",
    tasks: [],
    createdAt: "",
    updatedAt: "",
  },
  newTaskTitle: {
    title: "",
    tasks: [],
  },
  editedTaskTitle: {
    _id: "",
    title: "",
    tasks: [],
  },
  newTaskContents: {
    id: "",
    contents: "",
    taskContents: "",
    startDate: "",
    user: window.localStorage.sns_id,
  },
  editedTaskContents: {
    id: "",
    contents: "",
    taskContents: "",
    startDate: "",
    user: window.localStorage.sns_id,
  },
  editedTaskContentsNumber: {
    numId: 0,
  },
  modalOpen: {
    open: false,
  },
};

export const TaskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    setTaskList: (state, action: PayloadAction<TASK>) => {
      state.taskList = action.payload;
    },
    resetTaskList: (state) => {
      state.taskList = initialState.taskList;
    },
    setNewTaskTitle: (state, action: PayloadAction<NEWTASKTITLE>) => {
      state.newTaskTitle = action.payload;
    },
    resetNewTaskTitle: (state) => {
      state.newTaskTitle = initialState.newTaskTitle;
    },
    setEditedTaskTitle: (state, action: PayloadAction<EDITEDTASKTITLE>) => {
      state.editedTaskTitle = action.payload;
    },
    resetEditedTaskTitle: (state) => {
      state.editedTaskTitle = initialState.editedTaskTitle;
    },
    setNewTaskContents: (state, action: PayloadAction<NEWTASKCONTENTS>) => {
      state.newTaskContents = action.payload;
    },
    resetNewTaskContents: (state) => {
      state.newTaskContents = initialState.newTaskContents;
    },
    setEditedTaskContents: (
      state,
      action: PayloadAction<EDITEDTASKCONTENTS>
    ) => {
      state.editedTaskContents = action.payload;
    },
    resetEditedTaskContents: (state) => {
      state.editedTaskContents = initialState.editedTaskContents;
    },
    setEditedTaskContentsNumber: (
      state,
      action: PayloadAction<EDITEDTASKCONTENTSNUMBER>
    ) => {
      state.editedTaskContentsNumber = action.payload;
    },
    resetEditedTaskContentsNumber: (state) => {
      state.editedTaskContentsNumber = initialState.editedTaskContentsNumber;
    },
    setModalOpen: (state, action: PayloadAction<TASKMODAL>) => {
      state.modalOpen = action.payload;
    },
    resetModalOpen: (state) => {
      state.modalOpen = initialState.modalOpen;
    },
  },
});

export const {
  setTaskList,
  resetTaskList,
  setNewTaskTitle,
  resetNewTaskTitle,
  setEditedTaskTitle,
  resetEditedTaskTitle,
  setNewTaskContents,
  resetNewTaskContents,
  setEditedTaskContents,
  resetEditedTaskContents,
  setEditedTaskContentsNumber,
  resetEditedTaskContentsNumber,
  setModalOpen,
  resetModalOpen,
} = TaskSlice.actions;

export const selectTaskList = (state: RootState) => state.task.taskList;
export const selectNewTaskTitle = (state: RootState) => state.task.newTaskTitle;
export const selectEditedTaskTitle = (state: RootState) =>
  state.task.editedTaskTitle;
export const selectNewTaskContents = (state: RootState) =>
  state.task.newTaskContents;
export const selectEditedTaskContents = (state: RootState) =>
  state.task.editedTaskContents;
export const selectEditedTaskContentsNumber = (state: RootState) =>
  state.task.editedTaskContentsNumber;
export const selectModalOpen = (state: RootState) => state.task.modalOpen;

export default TaskSlice.reducer;
