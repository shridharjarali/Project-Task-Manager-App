import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';
import { saveToken, saveUser, clearAll, getToken, getUser } from '../../utils/storage';

// Thunk: Send OTP to email
export const sendOTP = createAsyncThunk(
  'auth/sendOTP',
  async ({ email }, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/send-otp', { email });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to send OTP');
    }
  }
);

// Thunk: Verify OTP and get JWT
export const verifyOTP = createAsyncThunk(
  'auth/verifyOTP',
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/verify-otp', { email, otp });
      const { token, user } = response.data;
      await saveToken(token);
      await saveUser(user);
      return { token, user };
    } catch (err) {
      return rejectWithValue(err.message || 'Invalid OTP');
    }
  }
);

// Thunk: Restore session from storage
export const restoreSession = createAsyncThunk(
  'auth/restoreSession',
  async (_, { rejectWithValue }) => {
    try {
      const token = await getToken();
      const user = await getUser();
      if (token && user) {
        return { token, user };
      }
      return rejectWithValue('No session found');
    } catch (err) {
      return rejectWithValue('Failed to restore session');
    }
  }
);

// Thunk: Logout
export const logout = createAsyncThunk('auth/logout', async () => {
  await clearAll();
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    loading: false,
    otpSent: false,
    otpEmail: null,
    error: null,
    sessionChecked: false,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetOTP: (state) => {
      state.otpSent = false;
      state.otpEmail = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Send OTP
      .addCase(sendOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendOTP.fulfilled, (state, action) => {
        state.loading = false;
        state.otpSent = true;
        state.otpEmail = action.meta.arg.email;
      })
      .addCase(sendOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Verify OTP
      .addCase(verifyOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.otpSent = false;
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Restore Session
      .addCase(restoreSession.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.sessionChecked = true;
      })
      .addCase(restoreSession.rejected, (state) => {
        state.sessionChecked = true;
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.otpSent = false;
        state.otpEmail = null;
      });
  },
});

export const { clearError, resetOTP } = authSlice.actions;
export default authSlice.reducer;
