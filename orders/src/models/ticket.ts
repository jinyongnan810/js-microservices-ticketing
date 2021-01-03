import mongoose from "mongoose";

// Describe attributes needed to create a ticket
interface TicketAttrs {
  title: string;
  price: number;
}
// Describe a ticket model
interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
}
// Describe a ticket document
interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
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

ticketSchema.pre("save", async function (done) {});

ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket(attrs);
};

const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema);

export { Ticket, TicketDoc };
