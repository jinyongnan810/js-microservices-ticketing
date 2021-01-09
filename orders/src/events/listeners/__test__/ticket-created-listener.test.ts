import { natsWrapper } from "../../nats-wrapper";
import { TicketCreatedListener } from "../ticket-created-listener";
import { Message } from "node-nats-streaming";
import { TicketCreatedEvent } from "@jinyongnan810/ticketing-common";
import Mongoose from "mongoose";
import { Ticket } from "../../../models/ticket";

it("normal ticket created event", async () => {
  const listener = new TicketCreatedListener(natsWrapper.client);
  const data: TicketCreatedEvent["data"] = {
    id: new Mongoose.Types.ObjectId().toHexString(),
    userId: new Mongoose.Types.ObjectId().toHexString(),
    title: "test ticket",
    price: 123,
    version: 0,
  };
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  await listener.onMessage(data, msg);
  const ticketFound = await Ticket.findById(data.id);
  expect(ticketFound).toBeTruthy();
  expect(ticketFound!.price).toBe(123);
  expect(ticketFound!.title).toBe(data.title);
  expect(ticketFound!.version).toBe(0);
  expect(msg.ack).toBeCalledTimes(1);
});
