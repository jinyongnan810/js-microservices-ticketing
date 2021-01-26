import axios from "axios";
import { useState } from "react";

const UseRequest = (url, method, body, onSuccess) => {
  const [errors, setErrors] = useState(null);
  const doRequest = async (additionalData = {}) => {
    try {
      setErrors(null);
      const res = await axios[method](url, { ...body, ...additionalData });
      if (onSuccess) {
        onSuccess(res.data);
      }
      return res.data;
    } catch (error) {
      setErrors(
        <div className="alert alert-danger">
          <h3>Ooops...</h3>
          <ul>
            {error.response.data.errors.map((e) => (
              <li className="my-0" key={e.message}>
                {e.message}
              </li>
            ))}
          </ul>
        </div>
      );
    }
  };
  return { doRequest, errors };
};

export default UseRequest;
