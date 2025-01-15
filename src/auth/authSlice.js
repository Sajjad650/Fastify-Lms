import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuth: false, // Defaulting to not authenticated
  currentUser: {}, // No user by default
  jid: '',
  userPic: '',
  loginType: '',
  notificationFlag: false,
  isToggled: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    toggle(state) {
      state.isToggled = !state.isToggled;
    },
    setAuth(state, action) {
      state.isAuth = action.payload;
    },
    setNotification(state, action) {
      state.notificationFlag = action.payload;
    },
    setJid(state, action) {
      state.jid = action.payload;
    },
    setUser(state, action) {
      state.currentUser = action.payload;
      state.isAuth = true;
    },
    setLogout(state) {
      state.currentUser = null;
      state.jid = '';
      state.isAuth = false;
      state.userPic = '';
      state.loginType = '';
    },
    setLogin(state, action) {
      const { currentUser, jid, isAuth, loginType } = action.payload;
      state.currentUser = currentUser;
      state.jid = jid;
      state.isAuth = isAuth;
      state.loginType = loginType;
    },
    setUserPic(state, action) {
      state.userPic = action.payload;
    },
  },
});

export const { setAuth, setJid, setUser, setLogout, setLogin, setUserPic, setNotification, toggle } = authSlice.actions;

export default authSlice.reducer;
