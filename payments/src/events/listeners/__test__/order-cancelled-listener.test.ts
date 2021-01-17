import {
  OrderCancelledEvent,
  OrderCreatedEvent,
  OrderStatus,
  Subjects,
} from "@jinyongnan810/ticketing-common";
import mongoose from "mongoose";
import { Order } from "../../../models/order";
import { natsWrapper } from "../../nats-wrapper";
import { OrderCancelledListener } from "../order-cancelled-listener";
import { OrderCreatedListener } from "../order-created-listener";
it("normal order created event received", async () => {
  const preOrder = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: "123",
    version: 0,
    status: OrderStatus.CREATED,
    price: 111,
  });
  await preOrder.save();
  const event: OrderCancelledEvent = {
    subject: Subjects.ORDER_CANCELLED,
    data: {
      id: preOrder.id,
      version: 1,
      ticket: {
        id: "1234",
      },
    },
  };
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  await new OrderCancelledListener(natsWrapper.client).onMessage(
    event.data,
    msg
  );
  const order = await Order.findById(event.data.id);
  expect(order).toBeTruthy();
  expect(order!.userId).toEqual("123");
  expect(order!.status).toEqual(OrderStatus.CANCELLED);
  expect(order!.version).toEqual(1);
  expect(order!.price).toEqual(111);
});
