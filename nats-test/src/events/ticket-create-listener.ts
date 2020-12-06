import nats, { Message, Stan } from "node-nats-streaming";
import { Listener } from "./base-listener";

export class TicketCreatedListener extends Listener {
  subject = "ticket-created";
  queueGroupName = "ticket-queue-group";
  onMessage(data: any, msg: Message): void {
    console.log(`Data parsed:${JSON.stringify(data)}`);
    msg.ack(); // manually ack the event
  }
}
