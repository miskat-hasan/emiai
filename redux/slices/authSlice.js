// redux/slices/authSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      let user = { ...action.payload };
      // dynamically handling avatar url wheather it is coming from user upload or their social account(eg.google/fb/insta)
      if (user && user.avatar && !user.avatar.startsWith('http')) {
        let avatar = user.avatar.startsWith('/') ? user.avatar.slice(1) : user.avatar;
        user.avatar = `${process.env.NEXT_PUBLIC_API_URL}/${avatar}`;
      }
      state.user = user;
      state.token = action.payload.token || state.token;
      state.isAuthenticated = true;
    },
    removeUser: state => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setUser, removeUser } = authSlice.actions;
export default authSlice.reducer;
