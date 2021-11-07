import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";
import authHelpers from "./helpers";

const AdminRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      authHelpers.isAuth() && authHelpers.isAuth().role === "admin" ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: "/signin",
            state: { from: props.location },
          }}
        />
      )
    }
  ></Route>
);

export default AdminRoute;
