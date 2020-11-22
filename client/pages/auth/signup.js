import { useState } from "react";
import axios from "axios";
import useRequest from "../../hooks/use-request";

const SignupPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { doRequest, errors } = useRequest(
    "http://ticketing.com/api/users/signup",
    "post",
    {
      email,
      password,
    }
  );
  const signUp = async (event) => {
    event.preventDefault();

    doRequest();
  };
  return (
    <div className="container">
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
    </div>
  );
};
export default SignupPage;
