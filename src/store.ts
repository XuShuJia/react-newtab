import { createSlice, configureStore } from "@reduxjs/toolkit";

const themeModeSlice = createSlice({
  name: "themeMode",
  initialState: {
    mode: (window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light") as "light" | "dark",
  },
  reducers: {
    setDarkThemeMode: (state) => {
      state.mode = "dark";
      document.documentElement.dataset.theme = "dark";
    },
    setLightThemeMode: (state) => {
      state.mode = "light";
      document.documentElement.dataset.theme = "light";
    },
    switchThemeMode: (state) => {
      const mode = state.mode === "light" ? "dark" : "light";
      document.documentElement.dataset.theme = mode;
      state.mode = mode;
    },
  },
});

export const { setDarkThemeMode, setLightThemeMode, switchThemeMode } =
  themeModeSlice.actions;

export const store = configureStore({
  reducer: {
    themeMode: themeModeSlice.reducer,
  },
});

export type TStore = ReturnType<typeof store.getState>;

export type TStoreDispatch = typeof store.dispatch;
