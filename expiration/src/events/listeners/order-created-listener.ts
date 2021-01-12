import {
  Listener,
  Subjects,
  OrderCreatedEvent,
} from "@jinyongnan810/ticketing-common";
import { Message } from "node-nats-streaming";
import { expirationQueue } from "../queues/expiration-queue";
import { queueGroupName } from "./queue-group-name";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.ORDER_CREATED = Subjects.ORDER_CREATED;
  queueGroupName: string = queueGroupName; // an event is sent to one service in a queue group
  async onMessage(
    data: OrderCreatedEvent["data"],
    msg: Message
  ): Promise<void> {
    const { id, expiredAt } = data;
    const delay = new Date(expiredAt).getTime() - new Date().getTime();
    await expirationQueue.add(
      { orderId: id },
      {
        delay: delay,
      }
    );
    msg.ack();
  }
}
