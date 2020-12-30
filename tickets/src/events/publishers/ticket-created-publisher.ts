import {
  Publisher,
  Subjects,
  TicketCreatedEvent,
} from "@jinyongnan810/ticketing-common";

class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TICKET_CREATED = Subjects.TICKET_CREATED;
}
