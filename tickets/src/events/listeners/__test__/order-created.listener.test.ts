import { natsWrapper } from "../../nats-wrapper";
import { Message } from "node-nats-streaming";
import Mongoose from "mongoose";
import { Ticket } from "../../../models/ticket";
import { OrderCreatedListener } from "../order-created-listener";
import {
  OrderCreatedEvent,
  OrderStatus,
} from "@jinyongnan810/ticketing-common";

it("normal order created event", async () => {
  const ticket = Ticket.build({
    title: "test ticket",
    price: 123,
    userId: new Mongoose.Types.ObjectId().toHexString(),
  });
  await ticket.save();
  const listener = new OrderCreatedListener(natsWrapper.client);
  const data: OrderCreatedEvent["data"] = {
    id: new Mongoose.Types.ObjectId().toHexString(),
    userId: ticket.userId,
    expiredAt: "111",
    status: OrderStatus.CREATED,
    version: 0,
    ticket: {
      id: ticket.id,
      price: 111,
    },
  };
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  await listener.onMessage(data, msg);
  const ticketFound = await Ticket.findById(data.id);
  expect(ticketFound).toBeTruthy();
  expect(ticketFound!.price).toEqual(123);
  expect(ticketFound!.title).toEqual(ticket.title);
  expect(ticketFound!.version).toEqual(1);
  expect(ticketFound!.orderId).toEqual(data.id);
  expect(msg.ack).toBeCalledTimes(1);
});
