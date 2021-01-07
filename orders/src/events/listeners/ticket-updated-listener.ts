import {
  Listener,
  NotFoundError,
  Subjects,
  TicketUpdatedEvent,
} from "@jinyongnan810/ticketing-common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queue-group-name";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TICKET_UPDATED = Subjects.TICKET_UPDATED;
  queueGroupName: string = queueGroupName; // an event is sent to one service in a queue group
  async onMessage(
    data: TicketUpdatedEvent["data"],
    msg: Message
  ): Promise<void> {
    const { id, title, price, version } = data;
    const ticket = await Ticket.findOne({ _id: id, version: version - 1 });
    if (!ticket) {
      throw new Error("Ticket not found");
    }
    ticket.title = title;
    ticket.price = price;
    await ticket.save();
    msg.ack();
  }
}
