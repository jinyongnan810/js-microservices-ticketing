import React, { useEffect, useState } from "react";

const ShowOrder = ({ order }) => {
  const [countDown, setCountDown] = useState("");

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
  return (
    <div>
      <h1>Order Payment</h1>
      <h3>{countDown} left to finish payment.</h3>
      <button className="btn btn-primary">Pay</button>
    </div>
  );
};
ShowOrder.getInitialProps = async (context, client, currentUser) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);

  return { order: { ...data }, currentUser };
};

export default ShowOrder;
