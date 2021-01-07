import {
  Listener,
  Subjects,
  TicketCreatedEvent,
} from "@jinyongnan810/ticketing-common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queue-group-name";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TICKET_CREATED = Subjects.TICKET_CREATED;
  queueGroupName: string = queueGroupName; // an event is sent to one service in a queue group
  async onMessage(
    data: TicketCreatedEvent["data"],
    msg: Message
  ): Promise<void> {
    const { id, title, price } = data;
    const ticket = Ticket.build({ id, title, price });
    await ticket.save();
    msg.ack();
  }
}
