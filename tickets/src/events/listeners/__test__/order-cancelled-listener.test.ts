import { natsWrapper } from "../../nats-wrapper";
import { Message } from "node-nats-streaming";
import Mongoose from "mongoose";
import { Ticket } from "../../../models/ticket";
import {
  OrderCancelledEvent,
  OrderCreatedEvent,
  OrderStatus,
} from "@jinyongnan810/ticketing-common";
import { OrderCancelledListener } from "../order-cancelled-listener";

it("normal order cancelled event", async () => {
  const ticket = Ticket.build({
    title: "test ticket",
    price: 123,
    userId: new Mongoose.Types.ObjectId().toHexString(),
  });
  await ticket.save();
  ticket.orderId = new Mongoose.Types.ObjectId().toHexString();
  await ticket.save();
  const listener = new OrderCancelledListener(natsWrapper.client);
  const data: OrderCancelledEvent["data"] = {
    id: ticket.orderId,
    version: 1,
    ticket: {
      id: ticket.id,
    },
  };
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  await listener.onMessage(data, msg);
  const ticketFound = await Ticket.findById(ticket._id);
  expect(ticketFound).toBeTruthy();
  expect(ticketFound!.price).toEqual(123);
  expect(ticketFound!.title).toEqual(ticket.title);
  expect(ticketFound!.version).toEqual(2);
  expect(ticketFound!.orderId).toBeUndefined();
  expect(msg.ack).toBeCalledTimes(1);
  expect(natsWrapper.client.publish).toBeCalledTimes(1);
});

it("order cancelled event with different orderId", async () => {
  const ticket = Ticket.build({
    title: "test ticket",
    price: 123,
    userId: new Mongoose.Types.ObjectId().toHexString(),
  });
  await ticket.save();
  ticket.orderId = new Mongoose.Types.ObjectId().toHexString();
  await ticket.save();
  const listener = new OrderCancelledListener(natsWrapper.client);
  const data: OrderCancelledEvent["data"] = {
    id: "abc",
    version: 1,
    ticket: {
      id: ticket.id,
    },
  };
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  await listener.onMessage(data, msg);

  expect(msg.ack).toBeCalledTimes(0);
  expect(natsWrapper.client.publish).toBeCalledTimes(0);
});
