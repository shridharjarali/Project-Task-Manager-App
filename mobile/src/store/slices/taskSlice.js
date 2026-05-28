import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';

export const fetchTasks = createAsyncThunk(
  'tasks/fetchAll',
  async ({ projectId }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/projects/${projectId}/tasks`);
      return { projectId, tasks: response.data };
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch tasks');
    }
  }
);

export const createTask = createAsyncThunk(
  'tasks/create',
  async ({ projectId, title, due_date }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/projects/${projectId}/tasks`, {
        title,
        due_date: due_date || null,
      });
      return { projectId, task: response.data };
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to create task');
    }
  }
);

export const updateTask = createAsyncThunk(
  'tasks/update',
  async ({ projectId, id, ...updates }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/projects/${projectId}/tasks/${id}`, updates);
      return { projectId, task: response.data };
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to update task');
    }
  }
);

export const deleteTask = createAsyncThunk(
  'tasks/delete',
  async ({ projectId, id }, { rejectWithValue }) => {
    try {
      await api.delete(`/projects/${projectId}/tasks/${id}`);
      return { projectId, taskId: id };
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to delete task');
    }
  }
);

const taskSlice = createSlice({
  name: 'tasks',
  initialState: {
    byProject: {},  // { [projectId]: Task[] }
    loading: false,
    error: null,
  },
  reducers: {
    clearTaskError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.byProject[action.payload.projectId] = action.payload.tasks;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create
      .addCase(createTask.pending, (state) => {
        state.loading = true;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.loading = false;
        const { projectId, task } = action.payload;
        if (!state.byProject[projectId]) {
          state.byProject[projectId] = [];
        }
        state.byProject[projectId].unshift(task);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update
      .addCase(updateTask.fulfilled, (state, action) => {
        const { projectId, task } = action.payload;
        const tasks = state.byProject[projectId];
        if (tasks) {
          const idx = tasks.findIndex((t) => t.id === task.id);
          if (idx !== -1) tasks[idx] = task;
        }
      })
      // Delete
      .addCase(deleteTask.fulfilled, (state, action) => {
        const { projectId, taskId } = action.payload;
        if (state.byProject[projectId]) {
          state.byProject[projectId] = state.byProject[projectId].filter(
            (t) => t.id !== taskId
          );
        }
      });
  },
});

export const { clearTaskError } = taskSlice.actions;
export default taskSlice.reducer;
