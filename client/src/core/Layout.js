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
          <li>
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
          <li>
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
      {authHelpers.isAuth() && (
        <li>
          <span
            className="nav-link"
            style={{ cursor: "pointer" }}
            onClick={() => {
              history.push("/");
            }}
          >
            {authHelpers.isAuth().name}
          </span>
        </li>
      )}
      {authHelpers.isAuth() && (
        <li>
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
