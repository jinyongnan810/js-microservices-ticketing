import {
  OrderCreatedEvent,
  OrderStatus,
  Subjects,
} from "@jinyongnan810/ticketing-common";
import mongoose from "mongoose";
import { Order } from "../../../models/order";
import { natsWrapper } from "../../nats-wrapper";
import { OrderCreatedListener } from "../order-created-listener";
it("normal order created event received", async () => {
  const event: OrderCreatedEvent = {
    subject: Subjects.ORDER_CREATED,
    data: {
      id: new mongoose.Types.ObjectId().toHexString(),
      userId: "123456",
      expiredAt: "123",
      status: OrderStatus.CREATED,
      version: 0,
      ticket: {
        id: new mongoose.Types.ObjectId().toHexString(),
        price: 111,
      },
    },
  };
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  await new OrderCreatedListener(natsWrapper.client).onMessage(event.data, msg);
  const order = await Order.findById(event.data.id);
  expect(order).toBeTruthy();
  expect(order!.userId).toEqual(event.data.userId);
  expect(order!.status).toEqual(event.data.status);
  expect(order!.version).toEqual(event.data.version);
  expect(order!.price).toEqual(event.data.ticket.price);
});
