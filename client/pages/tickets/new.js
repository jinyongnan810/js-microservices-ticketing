import React, { useState } from "react";
import Router from "next/router";
import UseRequest from "../../hooks/use-request";

const NewTicket = () => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const { doRequest, errors } = UseRequest(
    "/api/tickets",
    "post",
    { title, price },
    (ticket) => {
      Router.push("/");
    }
  );
  const createTicket = (e) => {
    e.preventDefault();
    doRequest();
  };
  const priceOnBlur = (e) => {
    const price = parseFloat(e.target.value);
    if (isNaN(price)) {
      setPrice(0.0);
    } else {
      setPrice(price.toFixed(2));
    }
  };
  return (
    <form onSubmit={createTicket}>
      <h1>Create a ticket</h1>
      <div className="form-group">
        <label htmlFor="title">Title</label>
        <input
          type="text"
          className="form-control"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="price">Price</label>
        <input
          type="text"
          className="form-control"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          onBlur={(e) => priceOnBlur(e)}
        />
      </div>
      {errors}

      <button className="btn btn-primary">Create</button>
    </form>
  );
};

export default NewTicket;
