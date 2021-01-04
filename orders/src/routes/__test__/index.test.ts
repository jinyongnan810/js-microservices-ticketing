import { Subjects } from "@jinyongnan810/ticketing-common";
import request from "supertest";
import { app } from "../../app";
import { natsWrapper } from "../../events/nats-wrapper";
import { Order, OrderStatus } from "../../models/order";
import { Ticket } from "../../models/ticket";

it("/api/orders GET", async () => {
  const res = await request(app).get("/api/orders").send({});
  expect(res.status).not.toBe(404);
});

it("/api/orders GET need auth", async () => {
  const res = await request(app).get("/api/orders").send({});
  expect(res.status).toBe(401);
});

it("/api/orders GET has auth", async () => {
  const cookie = global.signup();
  const res = await request(app)
    .get("/api/orders")
    .set("Cookie", cookie)
    .send({});
  expect(res.status).not.toBe(401);
});

it("/api/orders GET normal", async () => {
  const cookie = global.signup();
  // 3 tickets
  const ticket1 = Ticket.build({
    title: "testTicket1",
    price: 111,
  });
  await ticket1.save();
  const ticket2 = Ticket.build({
    title: "testTicket2",
    price: 222,
  });
  await ticket2.save();
  const ticket3 = Ticket.build({
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

  const res = await request(app).get("/api/orders").set("Cookie", cookie);
  expect(res.status).toBe(200);
  expect(res.body.length).toBe(2);
  expect(res.body[0].ticket.id.toString()).toEqual(ticket2.id);
  expect(res.body[1].ticket.id.toString()).toEqual(ticket3.id);
});
