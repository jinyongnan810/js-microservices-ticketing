import { OrderStatus, Subjects } from "@jinyongnan810/ticketing-common";
import request from "supertest";
import mongoose from "mongoose";
import { app } from "../../app";
import { natsWrapper } from "../../events/nats-wrapper";
import { Order } from "../../models/order";
import { stripe } from "../../stripe";
import { Payment } from "../../models/payment";
jest.mock("../../stripe");
it("/api/payments POST need auth", async () => {
  const res = await request(app).post("/api/payments").send({});
  expect(res.status).toBe(401);
  expect(stripe.charges.create).not.toHaveBeenCalled();
});

it("/api/payments POST has auth", async () => {
  const cookie = global.signup();
  const res = await request(app)
    .post("/api/payments")
    .set("Cookie", cookie)
    .send({});
  expect(res.status).not.toBe(401);
  expect(stripe.charges.create).not.toHaveBeenCalled();
});

it("/api/payments POST invalid inputs", async () => {
  const cookie = global.signup();
  const res = await request(app)
    .post("/api/payments")
    .set("Cookie", cookie)
    .send({ orderId: "", token: "" });
  expect(res.status).toBe(400);
  expect(res.body.errors[0]["field"]).toBe("orderId");
  expect(res.body.errors[1]["field"]).toBe("token");
  expect(stripe.charges.create).not.toHaveBeenCalled();
});

it("/api/payments POST order not exist", async () => {
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 111,
    userId: "123456",
    status: OrderStatus.CREATED,
    version: 0,
  });
  await order.save();
  const cookie = global.signup();
  const res = await request(app)
    .post("/api/payments")
    .set("Cookie", cookie)
    .send({
      orderId: new mongoose.Types.ObjectId().toHexString(),
      token: "abc",
    });
  expect(res.status).toBe(404);
  expect(stripe.charges.create).not.toHaveBeenCalled();
});
it("/api/payments POST invalid user", async () => {
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 111,
    userId: "123",
    status: OrderStatus.CREATED,
    version: 0,
  });
  await order.save();
  const cookie = global.signup();
  const res = await request(app)
    .post("/api/payments")
    .set("Cookie", cookie)
    .send({ orderId: order.id, token: "abc" });
  expect(res.status).toBe(401);
  expect(stripe.charges.create).not.toHaveBeenCalled();
});
it("/api/payments POST normal", async () => {
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 111,
    userId: "123456",
    status: OrderStatus.CREATED,
    version: 0,
  });
  await order.save();
  const cookie = global.signup();
  const res = await request(app)
    .post("/api/payments")
    .set("Cookie", cookie)
    .send({ orderId: order.id, token: "tok_visa" });
  expect(res.status).toBe(200);
  // stripe call
  expect(stripe.charges.create).toHaveBeenCalled();
  const params = (stripe.charges.create as jest.Mock).mock.calls[0][0];
  expect(params["amount"]).toEqual(11100);
  expect(params["currency"]).toEqual("usd");
  expect(params["source"]).toEqual("tok_visa");
  // payment creation
  const payment = await Payment.findOne({
    orderId: order.id,
    paymentId: "stripe payment id",
  });
  expect(payment).toBeTruthy();
});
