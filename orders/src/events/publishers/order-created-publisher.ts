import {
  OrderCreatedEvent,
  Publisher,
  Subjects,
} from "@jinyongnan810/ticketing-common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.ORDER_CREATED = Subjects.ORDER_CREATED;
}
