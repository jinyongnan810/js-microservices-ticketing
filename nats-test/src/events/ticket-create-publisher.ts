import { Publisher } from "./base-publisher";
import { Subjects } from "./subjects";
import { TicketCreateEvent } from "./ticket-create-event";

export class TicketCreatedPublisher extends Publisher<TicketCreateEvent> {
  readonly subject: Subjects.TICKET_CREATED = Subjects.TICKET_CREATED;
}
