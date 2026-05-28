import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { saveTheme, getTheme } from '../../utils/storage';

export const loadTheme = createAsyncThunk('theme/load', async () => {
  const mode = await getTheme();
  return mode || 'light';
});

const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    mode: 'light', // 'light' | 'dark'
  },
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
      saveTheme(state.mode);
    },
    setTheme: (state, action) => {
      state.mode = action.payload;
      saveTheme(state.mode);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadTheme.fulfilled, (state, action) => {
      state.mode = action.payload;
    });
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;
