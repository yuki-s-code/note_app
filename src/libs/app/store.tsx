import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import navReducer from "../../slices/navSlice";
import userReducer from "../../slices/userSlice";
import noteReducer from "../../slices/noteSlice";
import boardReducer from "../../slices/boardSlice";
import taskReducer from "../../slices/taskSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    note: noteReducer,
    nav: navReducer,
    board: boardReducer,
    task: taskReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
