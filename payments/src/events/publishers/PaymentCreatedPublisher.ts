import {
  PaymentCreatedEvent,
  Publisher,
  Subjects,
} from "@jinyongnan810/ticketing-common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PAYMENT_CREATED = Subjects.PAYMENT_CREATED;
}
