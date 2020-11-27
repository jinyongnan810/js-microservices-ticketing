import nats, { Message } from "node-nats-streaming";
import { randomBytes } from "crypto";
console.clear();
const stan = nats.connect("ticketing", randomBytes(4).toString("hex"), {
  url: "http://localhost:4222",
});
stan.on("connect", () => {
  console.log("Listener connected to nats");
  const options = stan
    .subscriptionOptions()
    // to prevent failed event get lost
    .setManualAckMode(true) //set manual acknowledge mode to true. Need to manually ack the event after save to db .etc.
    .setDeliverAllAvailable() // (2) get all previous events when first started
    .setDurableName("ticket"); // (3)do not send events that already been processed when started

  stan
    .subscribe(
      "ticket-created",
      "tickets-queue-group", // (1) send each event only to one of the queue menmber
      options
    )
    .on("message", (msg: Message) => {
      console.log(
        `Event received: Channel[${msg.getSubject()}],Seq[${msg.getSequence()}],Data[${msg.getData()}]`
      );
      msg.ack(); // manually ack the event
    });
  stan.on("close", () => {
    console.log("Publisher Closing...");
    process.exit();
  });
});

process.on("SIGINT", () => stan.close());
process.on("SIGTERM", () => stan.close());
