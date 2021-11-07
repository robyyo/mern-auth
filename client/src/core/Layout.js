import React, { Fragment } from "react";
import { Link, withRouter } from "react-router-dom";
import authHelpers from "../auth/helpers";

const Layout = ({ children, match, history }) => {
  const isActive = (path) => {
    if (match.path === path) {
      return true;
    } else {
      return false;
    }
  };

  const nav = () => (
    <ul className="nav nav-tabs bg-primary">
      <li className="nav-item">
        <Link
          to="/"
          className={
            isActive("/") ? `text-dark nav-link` : `text-light nav-link`
          }
        >
          Home
        </Link>
      </li>
      {!authHelpers.isAuth() && (
        <Fragment>
          <li className="nav-item">
            <Link
              to="/signup"
              className={
                isActive("/signup")
                  ? `text-dark nav-link`
                  : `text-light nav-link`
              }
            >
              Signup
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/signin"
              className={
                isActive("/signin")
                  ? `text-dark nav-link`
                  : `text-light nav-link`
              }
            >
              Signin
            </Link>
          </li>
        </Fragment>
      )}
      {authHelpers.isAuth() && authHelpers.isAuth().role === "admin" && (
        <li className="nav-item">
          <Link
            className={
              isActive("/admin") ? `text-dark nav-link` : `text-light nav-link`
            }
            to="/admin"
          >
            {authHelpers.isAuth().name}
          </Link>
        </li>
      )}
      {authHelpers.isAuth() && authHelpers.isAuth().role === "subscriber" && (
        <li className="nav-item">
          <Link
            className={
              isActive("/private")
                ? `text-dark nav-link`
                : `text-light nav-link`
            }
            to="/private"
          >
            {authHelpers.isAuth().name}
          </Link>
        </li>
      )}
      {authHelpers.isAuth() && (
        <li className="nav-item">
          <span
            className="nav-link text-light"
            style={{ cursor: "pointer" }}
            onClick={() => {
              authHelpers.signOut(() => {
                history.push("/");
              });
            }}
          >
            Signout
          </span>
        </li>
      )}
    </ul>
  );

  return (
    <Fragment>
      {nav()}
      <div className="container">{children}</div>
    </Fragment>
  );
};

export default withRouter(Layout);
