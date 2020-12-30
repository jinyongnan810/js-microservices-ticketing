import {
  Publisher,
  Subjects,
  TicketUpdatedEvent,
} from "@jinyongnan810/ticketing-common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TICKET_UPDATED = Subjects.TICKET_UPDATED;
}
