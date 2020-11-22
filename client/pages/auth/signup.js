import { useState } from "react";
import axios from "axios";

const SignupPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const signUp = async (event) => {
    event.preventDefault();
    try {
      const res = await axios.post("http://ticketing.com/api/users/signup", {
        email,
        password,
      });
      setErrors([]);
      const data = res.data;
    } catch (error) {
      setErrors(error.response.data.errors);
    }
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
        {errors.length > 0 ? (
          <div className="alert alert-danger">
            <h3>Ooops...</h3>
            <ul>
              {errors.map((e) => (
                <li className="my-0" key={e.message}>
                  {e.message}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          ""
        )}

        <button className="btn btn-primary">Sign up</button>
      </form>
    </div>
  );
};
export default SignupPage;
