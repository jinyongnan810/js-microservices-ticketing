import {
  Listener,
  Subjects,
  OrderCreatedEvent,
  OrderCancelledEvent,
} from "@jinyongnan810/ticketing-common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { natsWrapper } from "../nats-wrapper";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";
import { queueGroupName } from "./queue-group-name";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.ORDER_CANCELLED = Subjects.ORDER_CANCELLED;
  queueGroupName: string = queueGroupName; // an event is sent to one service in a queue group
  async onMessage(
    data: OrderCancelledEvent["data"],
    msg: Message
  ): Promise<void> {
    const { id, ticket } = data;
    const ticketFound = await Ticket.findById(ticket.id);
    if (!ticketFound) {
      throw new Error("Ticket not found");
    }
    if (ticketFound.orderId === id) {
      ticketFound.orderId = undefined;
    }
    await ticketFound.save();
    // publish ticket updated event
    new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: ticketFound.id,
      title: ticketFound.title,
      price: ticketFound.price,
      userId: ticketFound.userId,
      version: ticketFound.version,
    });
    msg.ack();
  }
}
