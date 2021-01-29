import {
  Listener,
  OrderStatus,
  PaymentCreatedEvent,
  Subjects,
} from "@jinyongnan810/ticketing-common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import { queueGroupName } from "./queue-group-name";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  subject: Subjects.PAYMENT_CREATED = Subjects.PAYMENT_CREATED;
  queueGroupName: string = queueGroupName; // an event is sent to one service in a queue group
  async onMessage(
    data: PaymentCreatedEvent["data"],
    msg: Message
  ): Promise<void> {
    const { orderId } = data;
    const order = await Order.findById(orderId);
    if (!order || order.status !== OrderStatus.CREATED) {
      throw new Error("Order not found.");
    }
    order.status = OrderStatus.COMPLETE;
    await order.save();
    // dont need to publish an order-updated event because no one will change the order ever after

    msg.ack();
  }
}
