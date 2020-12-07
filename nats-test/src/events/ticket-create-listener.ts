import nats, { Message, Stan } from "node-nats-streaming";
import { Listener } from "./base-listener";
import { Subjects } from "./subjects";
import { TicketCreateEvent } from "./ticket-create-event";

export class TicketCreatedListener extends Listener<TicketCreateEvent> {
  readonly subject: Subjects.TICKET_CREATED = Subjects.TICKET_CREATED;
  queueGroupName = "ticket-queue-group";
  onMessage(data: TicketCreateEvent["data"], msg: Message): void {
    console.log(`Data parsed:${JSON.stringify(data)}`);
    msg.ack(); // manually ack the event
  }
}
