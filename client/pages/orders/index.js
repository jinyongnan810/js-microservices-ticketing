import Link from "next/link";
import React from "react";

const OrderIndex = ({ orders }) => {
  return (
    <div>
      <h1>My Orders</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Ticket</th>
            <th>Price</th>
            <th>Status</th>
            <th>Options</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.ticket.id}</td>
              <td>{order.ticket.price}</td>
              <td>{order.status}</td>
              <td>
                <Link href="/orders/[orderId]" as={`/orders/${order.id}`}>
                  <a target="_blank">View</a>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
OrderIndex.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get(`/api/orders`);
  return { orders: [...data], currentUser };
};

export default OrderIndex;
