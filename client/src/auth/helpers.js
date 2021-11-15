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
      cookie.remove(key);
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
  signOut: (next) => {
    authHelpers.removeCookie("token");
    authHelpers.removeLocalStorage("user");
    next();
  },
  updateUser: (response, next) => {
    console.log("UPDATE USER IN LOCAL STORAGE HELPERS", response);
    if (typeof window != "undefined") {
      let auth = JSON.parse(localStorage.getItem("user"));
      auth = response.data;
      localStorage.setItem("user", JSON.stringify(auth));
    }
    next();
  },
};

export default authHelpers;
