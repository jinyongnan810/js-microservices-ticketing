import {
  ExpirationCompleteEvent,
  Publisher,
  Subjects,
} from "@jinyongnan810/ticketing-common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.EXPIRATION_COMPLETE = Subjects.EXPIRATION_COMPLETE;
}
