import {
  Listener,
  OrderCreatedEvent,
  OrderStatus,
  Subjects,
} from "@jinyongnan810/ticketing-common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import { queueGroupName } from "./queue-group-name";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.ORDER_CREATED = Subjects.ORDER_CREATED;
  queueGroupName: string = queueGroupName;
  async onMessage(
    data: OrderCreatedEvent["data"],
    msg: Message
  ): Promise<void> {
    const {
      id,
      userId,
      status,
      version,
      ticket: { price },
    } = data;
    const order = Order.build({
      id,
      userId,
      status,
      version,
      price,
    });
    await order.save();
    msg.ack();
  }
}
