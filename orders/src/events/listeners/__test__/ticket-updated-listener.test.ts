import { natsWrapper } from "../../nats-wrapper";
import { Message } from "node-nats-streaming";
import { TicketUpdatedEvent } from "@jinyongnan810/ticketing-common";
import Mongoose from "mongoose";
import { Ticket } from "../../../models/ticket";
import { TicketUpdatedListener } from "../ticket-updated-listener";

it("normal ticket updated event", async () => {
  const listener = new TicketUpdatedListener(natsWrapper.client);

  const ticket = Ticket.build({
    id: new Mongoose.Types.ObjectId().toHexString(),
    title: "test ticket",
    price: 111,
  });
  await ticket.save();

  const data: TicketUpdatedEvent["data"] = {
    id: ticket._id,
    userId: new Mongoose.Types.ObjectId().toHexString(),
    title: "test ticket updated",
    price: 222,
    version: 1,
  };
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  await listener.onMessage(data, msg);
  const ticketFound = await Ticket.findById(ticket.id);
  expect(ticketFound).toBeTruthy();
  expect(ticketFound!.price).toBe(222);
  expect(ticketFound!.title).toBe(data.title);
  expect(ticketFound!.version).toBe(1);
  expect(msg.ack).toBeCalledTimes(1);
});

it("mis-ordered ticket updated event", async () => {
  const listener = new TicketUpdatedListener(natsWrapper.client);

  const ticket = Ticket.build({
    id: new Mongoose.Types.ObjectId().toHexString(),
    title: "test ticket",
    price: 111,
  });
  await ticket.save();

  const data: TicketUpdatedEvent["data"] = {
    id: ticket._id,
    userId: new Mongoose.Types.ObjectId().toHexString(),
    title: "test ticket updated 3",
    price: 333,
    version: 2,
  };
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  try {
    await listener.onMessage(data, msg);
    fail();
  } catch (error) {}
  const ticketFound = await Ticket.findById(ticket.id);
  expect(ticketFound).toBeTruthy();
  expect(ticketFound!.price).toBe(111);
  expect(ticketFound!.title).toBe(ticket.title);
  expect(ticketFound!.version).toBe(0);
  expect(msg.ack).toBeCalledTimes(0);
});
