import { OrderStatus } from "@jinyongnan810/ticketing-common";
import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { TicketDoc } from "./ticket";

// Describe attributes needed to create a Order
interface OrderAttrs {
  userId: string;
  expiredAt: Date;
  status: OrderStatus;
  ticket: TicketDoc;
}
// Describe a Order model
interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
}
// Describe a Order document
interface OrderDoc extends mongoose.Document {
  userId: string;
  expiredAt: Date;
  status: OrderStatus;
  ticket: TicketDoc;
  version: number;
}

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    expiredAt: {
      type: mongoose.Schema.Types.Date,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.CREATED,
    },
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ticket",
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        // manipulate ret to change json result
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);
// add version control
OrderSchema.set("versionKey", "version");
OrderSchema.plugin(updateIfCurrentPlugin);
OrderSchema.pre("save", async function (done) {});

OrderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order(attrs);
};

const Order = mongoose.model<OrderDoc, OrderModel>("Order", OrderSchema);

export { Order, OrderStatus };
