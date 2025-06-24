import { configureStore } from "@reduxjs/toolkit";
import exampleReducer from "./slices/exampleSlice";
import uiReducer from "./slices/uiSlice";
import selectedNodesReducer from "./slices/selectedNodesSlice";

export const store = configureStore({
  reducer: {
    example: exampleReducer,
    ui: uiReducer,
    selectedNodes: selectedNodesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
