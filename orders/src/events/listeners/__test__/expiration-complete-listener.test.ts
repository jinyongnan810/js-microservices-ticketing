import { natsWrapper } from "../../nats-wrapper";
import { TicketCreatedListener } from "../ticket-created-listener";
import { Message } from "node-nats-streaming";
import {
  ExpirationCompleteEvent,
  OrderStatus,
  TicketCreatedEvent,
} from "@jinyongnan810/ticketing-common";
import mongoose from "mongoose";
import { Ticket } from "../../../models/ticket";
import { ExpirationCompleteListener } from "../expiration-complete-listener";
import { Order } from "../../../models/order";

it("expiration complete event to already completed order", async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "test ticket",
    price: 111,
  });
  await ticket.save();
  const order = Order.build({
    userId: "123",
    expiredAt: new Date(),
    status: OrderStatus.COMPLETE,
    ticket: ticket,
  });
  await order.save();

  const listener = new ExpirationCompleteListener(natsWrapper.client);
  const data: ExpirationCompleteEvent["data"] = {
    orderId: order.id,
  };
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  await listener.onMessage(data, msg);
  const orderFound = await Order.findById(order.id);
  expect(orderFound).toBeTruthy();
  expect(orderFound!.version).toEqual(0);
  expect(orderFound!.status).toEqual(OrderStatus.COMPLETE);
  expect(msg.ack).toBeCalledTimes(1);
});

it("normal expiration complete event", async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "test ticket",
    price: 111,
  });
  await ticket.save();
  const order = Order.build({
    userId: "123",
    expiredAt: new Date(),
    status: OrderStatus.CREATED,
    ticket: ticket,
  });
  await order.save();

  const listener = new ExpirationCompleteListener(natsWrapper.client);
  const data: ExpirationCompleteEvent["data"] = {
    orderId: order.id,
  };
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  await listener.onMessage(data, msg);
  const orderFound = await Order.findById(order.id);
  expect(orderFound).toBeTruthy();
  expect(orderFound!.version).toEqual(1);
  expect(orderFound!.status).toEqual(OrderStatus.CANCELLED);
  expect(msg.ack).toBeCalledTimes(1);
});
