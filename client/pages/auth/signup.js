import { useState } from "react";
import Router from "next/router";
import useRequest from "../../hooks/use-request";

const SignupPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { doRequest, errors } = useRequest(
    "/api/users/signup",
    "post",
    {
      email,
      password,
    },
    () => Router.push("/")
  );
  const signUp = async (event) => {
    event.preventDefault();

    doRequest();
  };
  return (
    <form onSubmit={signUp}>
      <h1>Sign Up</h1>
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          type="text"
          className="form-control"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="passowrd">Passowrd</label>
        <input
          type="password"
          className="form-control"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      {errors}

      <button className="btn btn-primary">Sign up</button>
    </form>
  );
};
export default SignupPage;
