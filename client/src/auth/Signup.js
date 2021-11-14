import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import Layout from "../core/Layout";
import axios from "axios";
import authHelpers from "./helpers";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

const Signup = () => {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    buttonText: "Submit",
  });

  const { name, email, password, buttonText } = values;

  const handleChange = (name) => (e) => {
    setValues({ ...values, [name]: e.target.value });
  };

  const clickSubmit = (e) => {
    e.preventDefault();
    setValues({ ...values, buttonText: "Submitting" });
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_API}/signup`,
      data: { name, email, password },
    })
      .then((response) => {
        console.log("SIGNUP SUCCESS", response);
        setValues({
          ...values,
          name: "",
          email: "",
          password: "",
          buttonText: "Submitted",
        });
        toast.success(response.data.message);
      })
      .catch((error) => {
        console.log("SIGNUP ERROR", error.response.data);
        setValues({ ...values, buttonText: "Submit" });
        toast.error(error.response.data.error);
      });
  };

  const signupForm = () => (
    <form>
      <div className="form-group">
        <label className="text-muted">Name</label>
        <input
          type="text"
          onChange={handleChange("name")}
          className="form-control"
          value={name}
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Email</label>
        <input
          type="email"
          onChange={handleChange("email")}
          className="form-control"
          value={email}
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Password</label>
        <input
          type="password"
          onChange={handleChange("password")}
          className="form-control"
          value={password}
        />
      </div>
      <div>
        <button className="btn btn-primary" onClick={clickSubmit}>
          {buttonText}
        </button>
      </div>
    </form>
  );

  return (
    <Layout>
      <div className="col-md-6 offset-md-3">
        <ToastContainer />
        {authHelpers.isAuth() ? <Redirect to="/" /> : null}
        <h1 className="p-5 text-center">Signup</h1>
        {signupForm()}
      </div>
    </Layout>
  );
};

export default Signup;
