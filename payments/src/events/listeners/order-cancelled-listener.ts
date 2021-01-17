import {
  Listener,
  OrderCancelledEvent,
  OrderStatus,
  Subjects,
} from "@jinyongnan810/ticketing-common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import { queueGroupName } from "./queue-group-name";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.ORDER_CANCELLED = Subjects.ORDER_CANCELLED;
  queueGroupName: string = queueGroupName;
  async onMessage(
    data: OrderCancelledEvent["data"],
    msg: Message
  ): Promise<void> {
    const { id, version, ticket } = data;
    const order = await Order.findOne({
      _id: id,
      version: version - 1,
    });
    if (!order) {
      throw new Error(`Order not found for id:${id}`);
    }
    order.status = OrderStatus.CANCELLED;
    await order.save();
    msg.ack();
  }
}
