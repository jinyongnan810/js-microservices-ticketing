import { Subjects } from "@jinyongnan810/ticketing-common";
import request from "supertest";
import mongoose from "mongoose";
import { app } from "../../app";
import { natsWrapper } from "../../events/nats-wrapper";
import { Order, OrderStatus } from "../../models/order";
import { Ticket } from "../../models/ticket";

it("/api/orders/:orderId DELETE normal", async () => {
  const cookie = global.signup();
  // 3 tickets
  const ticket1 = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "testTicket1",
    price: 111,
  });
  await ticket1.save();
  const ticket2 = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "testTicket2",
    price: 222,
  });
  await ticket2.save();
  const ticket3 = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "testTicket3",
    price: 333,
  });
  await ticket3.save();
  // 3 orders
  const order1 = Order.build({
    ticket: ticket1,
    userId: "orderuser",
    expiredAt: new Date(),
    status: OrderStatus.CREATED,
  });
  await order1.save();
  const order2 = Order.build({
    ticket: ticket2,
    userId: "123456",
    expiredAt: new Date(),
    status: OrderStatus.CREATED,
  });
  await order2.save();
  const order3 = Order.build({
    ticket: ticket3,
    userId: "123456",
    expiredAt: new Date(),
    status: OrderStatus.CREATED,
  });
  await order3.save();
  const res = await request(app)
    .delete(`/api/orders/${order2.id.toString()}`)
    .set("Cookie", cookie);
  expect(res.status).toBe(204);
  expect(natsWrapper.client.publish).toBeCalled();
  expect(natsWrapper.client.publish).toBeCalledWith(
    Subjects.ORDER_CANCELLED,
    JSON.stringify({
      id: order2.id,
      version: order2.version + 1,
      ticket: {
        id: ticket2.id,
      },
    }),
    expect.any(Function)
  );
});
it("/api/orders/:orderId DELETE not for cancelled", async () => {
  const cookie = global.signup();
  const ticket2 = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "testTicket2",
    price: 222,
  });
  await ticket2.save();
  const ticket3 = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "testTicket3",
    price: 333,
  });
  await ticket3.save();
  const order2 = Order.build({
    ticket: ticket2,
    userId: "123456",
    expiredAt: new Date(),
    status: OrderStatus.CANCELLED,
  });
  await order2.save();
  const order3 = Order.build({
    ticket: ticket3,
    userId: "123456",
    expiredAt: new Date(),
    status: OrderStatus.COMPLETE,
  });
  await order3.save();
  const res = await request(app)
    .delete(`/api/orders/${order2.id.toString()}`)
    .set("Cookie", cookie);
  expect(res.status).toBe(401);
  expect(natsWrapper.client.publish).not.toBeCalled();
  const res2 = await request(app)
    .delete(`/api/orders/${order3.id.toString()}`)
    .set("Cookie", cookie);
  expect(res2.status).toBe(401);
  expect(natsWrapper.client.publish).not.toBeCalled();
});

it("/api/orders/:orderId DELETE not myself", async () => {
  const cookie = global.signup();
  // 3 tickets
  const ticket1 = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "testTicket1",
    price: 111,
  });
  await ticket1.save();
  const ticket2 = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "testTicket2",
    price: 222,
  });
  await ticket2.save();
  const ticket3 = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "testTicket3",
    price: 333,
  });
  await ticket3.save();
  // 3 orders
  const order1 = Order.build({
    ticket: ticket1,
    userId: "orderuser",
    expiredAt: new Date(),
    status: OrderStatus.CREATED,
  });
  await order1.save();
  const order2 = Order.build({
    ticket: ticket2,
    userId: "123456",
    expiredAt: new Date(),
    status: OrderStatus.CREATED,
  });
  await order2.save();
  const order3 = Order.build({
    ticket: ticket3,
    userId: "123456",
    expiredAt: new Date(),
    status: OrderStatus.CREATED,
  });
  await order3.save();
  const res = await request(app)
    .delete(`/api/orders/${order1.id.toString()}`)
    .set("Cookie", cookie);
  expect(res.status).toBe(404);
  expect(natsWrapper.client.publish).not.toBeCalled();
});
