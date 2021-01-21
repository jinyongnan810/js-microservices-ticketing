import { natsWrapper } from "../../nats-wrapper";
import { TicketCreatedListener } from "../ticket-created-listener";
import { Message } from "node-nats-streaming";
import {
  OrderStatus,
  PaymentCreatedEvent,
  TicketCreatedEvent,
} from "@jinyongnan810/ticketing-common";
import mongoose from "mongoose";
import { Ticket } from "../../../models/ticket";
import { PaymentCreatedListener } from "../payment-created-listener";
import { Order } from "../../../models/order";

it("normal payment created event", async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 111,
    title: "title",
  });
  await ticket.save();
  const order = Order.build({
    userId: "123",
    expiredAt: new Date(),
    status: OrderStatus.CREATED,
    ticket: ticket,
  });
  await order.save();

  const listener = new PaymentCreatedListener(natsWrapper.client);
  const data: PaymentCreatedEvent["data"] = {
    orderId: order.id,
    paymentId: "stripe charge id",
  };
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  await listener.onMessage(data, msg);
  const orderFound = await Order.findById(order.id);
  expect(orderFound!.status).toEqual(OrderStatus.COMPLETE);
});
