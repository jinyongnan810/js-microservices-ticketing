import Router from "next/router";
import React, { useEffect, useState } from "react";
import UseRequest from "../../hooks/use-request";

const ShowTicket = ({ ticket, currentUser }) => {
  const buyTicketRequest = UseRequest(
    `/api/orders`,
    "post",
    { ticketId: ticket.id },
    (order) => {
      Router.reload();
    }
  );
  const buyTicket = (e) => {
    e.preventDefault();
    buyTicketRequest.doRequest();
  };
  return (
    <form onSubmit={buyTicket}>
      <h1>{ticket.title}</h1>
      <h3>Price:${ticket.price}</h3>
      <h3>
        Status:
        {ticket.orderId ? (
          <span className="text-secondary">Not Available</span>
        ) : (
          <span className="text-success">Available</span>
        )}
      </h3>
      {buyTicketRequest.errors}
      <button className="btn btn-primary" disabled={!!ticket.orderId}>
        Purchase
      </button>
    </form>
  );
};
ShowTicket.getInitialProps = async (context, client, currentUser) => {
  const { ticketId } = context.query;
  const { data } = await client.get(`/api/tickets/${ticketId}`);

  return { ticket: { ...data }, currentUser };
};

export default ShowTicket;
