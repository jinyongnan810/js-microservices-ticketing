import { Subjects } from "./subjects";

export interface TicketCreateEvent {
  subject: Subjects.TICKET_CREATED;
  data: {
    id: string;
    title: string;
    price: number;
  };
}
