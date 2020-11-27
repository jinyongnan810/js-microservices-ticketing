import nats, { Message } from "node-nats-streaming";
import { randomBytes } from "crypto";
console.clear();
const stan = nats.connect("ticketing", randomBytes(4).toString("hex"), {
  url: "http://localhost:4222",
});
stan.on("connect", () => {
  console.log("Listener connected to nats");
  const options = stan.subscriptionOptions().setManualAckMode(true); //set manual acknowledge mode to true. Need to manually ack the event after save to db .etc.
  // to prevent failed event get lost
  stan
    .subscribe("ticket-created", "tickets-queue-group", options)
    .on("message", (msg: Message) => {
      console.log(
        `Event received: Channel[${msg.getSubject()}],Seq[${msg.getSequence()}],Data[${msg.getData()}]`
      );
      msg.ack(); // manually ack the event
    });
});
