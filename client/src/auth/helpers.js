import cookie from "js-cookie";

const authHelpers = {
  // set in cookie
  setCookie: (key, value) => {
    if (window !== "undefined") {
      cookie.set(key, value, {
        expires: 1,
      });
    }
  },
  // remove from cookie
  removeCookie: (key) => {
    if (window !== "undefined") {
      cookie.removeCookie(key);
    }
  },
  // get info from cookie
  getCookie: (key) => {
    if (window !== "undefined") {
      return cookie.get(key);
    }
  },
  // set in localstorage
  setLocalStorage: (key, value) => {
    if (window !== "undefined") {
      localStorage.setItem(key, JSON.stringify(value));
    }
  },
  // remove from localstorage
  removeLocalStorage: (key) => {
    if (window !== "undefined") {
      localStorage.removeItem(key);
    }
  },
  // authenticate user
  authenticate: (response, next) => {
    authHelpers.setCookie("token", response.data.token);
    authHelpers.setLocalStorage("user", response.data.user);
    next();
  },
  // access user info from localstorage
  isAuth: () => {
    if (window !== "undefined") {
      const cookieChecked = authHelpers.getCookie("token");
      if (cookieChecked) {
        if (localStorage.getItem("user")) {
          return JSON.parse(localStorage.getItem("user"));
        } else {
          return false;
        }
      }
    }
  },
};

export default authHelpers;
