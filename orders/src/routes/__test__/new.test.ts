import { Subjects } from "@jinyongnan810/ticketing-common";
import request from "supertest";
import mongoose from "mongoose";
import { app } from "../../app";
import { natsWrapper } from "../../events/nats-wrapper";
import { Order, OrderStatus } from "../../models/order";
import { Ticket } from "../../models/ticket";

it("/api/orders POST", async () => {
  const res = await request(app).post("/api/orders").send({});
  expect(res.status).not.toBe(404);
});

it("/api/orders POST need auth", async () => {
  const res = await request(app).post("/api/orders").send({});
  expect(res.status).toBe(401);
});

it("/api/orders POST has auth", async () => {
  const cookie = global.signup();
  const res = await request(app)
    .post("/api/orders")
    .set("Cookie", cookie)
    .send({});
  expect(res.status).not.toBe(401);
});

it("/api/orders POST invalid inputs", async () => {
  const cookie = global.signup();
  const res = await request(app)
    .post("/api/orders")
    .set("Cookie", cookie)
    .send({ ticketId: "123" });
  expect(res.status).toBe(400);
  expect(res.body.errors[0]["field"]).toBe("ticketId");
});
it("/api/orders POST ticket not found", async () => {
  const cookie = global.signup();
  const ticket = await Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "testTicket",
    price: 111,
  });
  const res = await request(app)
    .post("/api/orders")
    .set("Cookie", cookie)
    .send({ ticketId: ticket.id });
  expect(res.status).toBe(404);
  // db
  const createdOne = await Order.findOne({ ticket: ticket });
  expect(createdOne).toBeNull();
});
it("/api/orders POST ticket reserved created ", async () => {
  const cookie = global.signup();
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "testTicket",
    price: 111,
  });
  await ticket.save();
  const order = Order.build({
    ticket: ticket,
    userId: "123456",
    expiredAt: new Date(),
    status: OrderStatus.CREATED,
  });
  await order.save();
  const res = await request(app)
    .post("/api/orders")
    .set("Cookie", cookie)
    .send({ ticketId: ticket.id });
  expect(res.status).toBe(400);
  // db

  // event
});
it("/api/orders POST ticket reserved awaiting paymen ", async () => {
  const cookie = global.signup();
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "testTicket",
    price: 111,
  });
  await ticket.save();
  const order = Order.build({
    ticket: ticket,
    userId: "123456",
    expiredAt: new Date(),
    status: OrderStatus.AWAITING_PAYMENT,
  });
  await order.save();
  const res = await request(app)
    .post("/api/orders")
    .set("Cookie", cookie)
    .send({ ticketId: ticket.id });
  expect(res.status).toBe(400);
  // db

  // event
  expect(natsWrapper.client.publish).not.toBeCalled();
});
it("/api/orders POST ticket reserved complete ", async () => {
  const cookie = global.signup();
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "testTicket",
    price: 111,
  });
  await ticket.save();
  const order = Order.build({
    ticket: ticket,
    userId: "123456",
    expiredAt: new Date(),
    status: OrderStatus.COMPLETE,
  });
  await order.save();
  const res = await request(app)
    .post("/api/orders")
    .set("Cookie", cookie)
    .send({ ticketId: ticket.id });
  expect(res.status).toBe(400);
  // db

  // event
  expect(natsWrapper.client.publish).not.toBeCalled();
});
it("/api/orders POST ticket reserved cancelled ", async () => {
  const cookie = global.signup();
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "testTicket",
    price: 111,
  });
  await ticket.save();
  const order = Order.build({
    ticket: ticket,
    userId: "123456",
    expiredAt: new Date(),
    status: OrderStatus.CANCELLED,
  });
  await order.save();
  const res = await request(app)
    .post("/api/orders")
    .set("Cookie", cookie)
    .send({ ticketId: ticket.id });
  expect(res.status).toBe(201);
  // db
  const createdOne = await Order.findOne({ ticket: ticket });
  expect(createdOne).toBeTruthy();
  expect(createdOne!.ticket.toString()).toEqual(ticket.id);
});
it("/api/orders POST valid inputs", async () => {
  const cookie = global.signup();
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "testTicket",
    price: 111,
  });
  await ticket.save();
  const res = await request(app)
    .post("/api/orders")
    .set("Cookie", cookie)
    .send({ ticketId: ticket.id });
  expect(res.status).toBe(201);
  // db
  const createdOne = await Order.findOne({ ticket: ticket });
  expect(createdOne).toBeTruthy();
  expect(createdOne!.ticket.toString()).toEqual(ticket.id);
  expect(natsWrapper.client.publish).toBeCalled();
  expect(natsWrapper.client.publish).toBeCalledWith(
    Subjects.ORDER_CREATED,
    JSON.stringify({
      id: createdOne!.id,
      userId: createdOne!.userId,
      status: createdOne!.status,
      expiredAt: createdOne!.expiredAt,
      version: createdOne!.version,
      ticket: {
        id: ticket.id,
        price: ticket.price,
      },
    }),
    expect.any(Function)
  );
});
