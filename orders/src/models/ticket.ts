import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { idText } from "typescript";
import { Order, OrderStatus } from "./order";

// Describe attributes needed to create a ticket
interface TicketAttrs {
  id: string;
  title: string;
  price: number;
}
// Describe a ticket model
interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
  findByEvent(event: { id: string; version: number }): Promise<TicketDoc>;
}
// Describe a ticket document
interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  version: number;
  isReserved(): Promise<boolean>;
}

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
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
ticketSchema.set("versionKey", "version");
ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.pre("save", async function (done) {});

ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket({ ...attrs, _id: attrs.id });
};
ticketSchema.statics.findByEvent = async (event: {
  id: string;
  version: number;
}) => {
  const { id, version } = event;
  return Ticket.findOne({ _id: id, version: version - 1 });
};
ticketSchema.methods.isReserved = async function () {
  const existedOrder = await Order.findOne({
    ticket: this,
    status: {
      $in: [
        OrderStatus.CREATED,
        OrderStatus.AWAITING_PAYMENT,
        OrderStatus.COMPLETE,
      ],
    },
  });
  return !!existedOrder;
};

const Ticket = mongoose.model<TicketDoc, TicketModel>("ticket", ticketSchema);

export { Ticket, TicketDoc };
