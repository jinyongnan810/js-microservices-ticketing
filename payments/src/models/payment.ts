import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

// Describe attributes needed to create a Payment
interface PaymentAttrs {
  orderId: string;
  paymentId: string;
}
// Describe a Payment model
interface PaymentModel extends mongoose.Model<PaymentDoc> {
  build(attrs: PaymentAttrs): PaymentDoc;
}
// Describe a Payment document
interface PaymentDoc extends mongoose.Document {
  orderId: string;
  paymentId: string;
}

const PaymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
    },
    paymentId: {
      type: String,
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

PaymentSchema.statics.build = (attrs: PaymentAttrs) => {
  return new Payment({ ...attrs });
};

const Payment = mongoose.model<PaymentDoc, PaymentModel>(
  "Payment",
  PaymentSchema
);

export { Payment };
