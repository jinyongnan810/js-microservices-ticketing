import nats, { Message } from "node-nats-streaming";
import { randomBytes } from "crypto";
console.clear();
const stan = nats.connect("ticketing", randomBytes(4).toString("hex"), {
  url: "http://localhost:4222",
});
stan.on("connect", () => {
  console.log("Listener connected to nats");
  stan
    .subscribe("ticket-created", "tickets-queue-group")
    .on("message", (msg: Message) => {
      console.log(
        `Event received: Channel[${msg.getSubject()}],Seq[${msg.getSequence()}],Data[${msg.getData()}]`
      );
    });
});
