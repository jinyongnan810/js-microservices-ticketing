import Link from "next/link";

const IndexPage = ({ currentUser, tickets }) => {
  const listOfTickets = tickets.map((ticket) => (
    <tr className="cursor-pointer" key={ticket.id}>
      <td>{ticket.title}</td>
      <td>{ticket.price}</td>
      <td>
        {ticket.orderId ? (
          <span className="text-secondary">Not Available</span>
        ) : (
          <span className="text-success">Available</span>
        )}
      </td>
      <td>
        <Link href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`}>
          <a target="_blank">View</a>
        </Link>
      </td>
    </tr>
  ));
  return (
    <div>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Status</th>
            <th>Options</th>
          </tr>
        </thead>
        <tbody>{listOfTickets}</tbody>
      </table>
    </div>
  );
};
// executed in the server side
// except when redirected from the same app
IndexPage.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get("/api/tickets");
  console.log("getinitialprops data", data);
  return { tickets: data };
};

export default IndexPage;
