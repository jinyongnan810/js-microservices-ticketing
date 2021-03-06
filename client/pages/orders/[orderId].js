import Router from "next/router";
import React, { useEffect, useState } from "react";
import StripeCheckout from "react-stripe-checkout";
import UseRequest from "../../hooks/use-request";

const ShowOrder = ({ order, currentUser }) => {
  const [countDown, setCountDown] = useState("");
  const { doRequest, errors } = UseRequest(
    "/api/payments",
    "post",
    { orderId: order.id },
    ({ id }) => {
      console.log("payment success:", id);
      Router.push("/orders");
    }
  );
  useEffect(() => {
    const calTimeLeft = () => {
      let diff = new Date(order.expiredAt) - new Date();
      diff = Math.round(diff / 1000);
      const sec = diff % 60;
      const min = Math.floor(diff / 60);
      return { text: min > 0 ? `${min}min ${sec}s` : `${sec}s`, num: diff };
    };
    setCountDown(calTimeLeft()["text"]);
    const timer = setInterval(() => {
      const res = calTimeLeft();
      if (res.num > 0) {
        setCountDown(res["text"]);
      } else {
        setCountDown("no time");
        clearInterval(timer);
      }
    }, 1000);
    return () => {
      // called after leaving the page
      clearInterval(timer);
    };
  }, [order]);

  if (countDown === "no time") {
    return (
      <div>
        <h3>Payment Expired</h3>
      </div>
    );
  }

  if (order.status !== "CREATED") {
    return (
      <div>
        <h3>Payment Not Available.</h3>
      </div>
    );
  }

  return (
    <div>
      <h1>Order Payment</h1>
      <h3>{countDown} left to finish payment.</h3>
      <br />
      {errors}
      <StripeCheckout
        token={(token) => {
          doRequest({ token: token.id });
        }}
        amount={order.ticket.price * 100}
        stripeKey="pk_test_51IBTOcKRyFK3tEfd8O3q3YJ97zxsWad6s8rUAGG23kOMESxe5wo5xENIIuOwrPsgCoFap3iIhYA9Fh8tauYPAhNw00ITsh8evk"
        email={currentUser.email}
      />
    </div>
  );
};
ShowOrder.getInitialProps = async (context, client, currentUser) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);
  console.log("cur:", currentUser);
  return { order: { ...data }, currentUser };
};

export default ShowOrder;
