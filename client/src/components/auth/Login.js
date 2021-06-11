import React, { useState, Fragment } from "react";
import { Link } from "react-router-dom";

export const Login = () => {
  const [formData, setformData] = useState({
    email: "",
    password: "",
  });

  const onChange = (e) =>
    setformData({ ...formData, [e.target.name]: e.target.value });

  const { email, password } = formData;

  const onSubmitHandler = (e) => {
    e.preventDefault();

    console.log(formData);
  };

  return (
    <Fragment>
      <h1 className="large text-primary">Sign Up</h1>
      <p className="lead">
        <i className="fas fa-user"></i> Create Your Account
      </p>
      <form
        className="form"
        action="create-profile.html"
        onSubmit={onSubmitHandler}
      >
        <div className="form-group">
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            required
            value={email}
            onChange={(e) => onChange(e)}
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            minLength="6"
            required
            value={password}
            onChange={(e) => onChange(e)}
          />
        </div>

        <input type="submit" className="btn btn-primary" value="Login" />
      </form>
      <p className="my-1">
        Don't have an account? <Link to="/register">Sign Up</Link>
      </p>
    </Fragment>
  );
};
