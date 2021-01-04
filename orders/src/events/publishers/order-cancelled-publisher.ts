import {
  OrderCancelledEvent,
  Publisher,
  Subjects,
} from "@jinyongnan810/ticketing-common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.ORDER_CANCELLED = Subjects.ORDER_CANCELLED;
}
