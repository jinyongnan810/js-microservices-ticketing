import nats from "node-nats-streaming";
import { TicketCreatedPublisher } from "./events/ticket-create-publisher";
console.clear();
const stan = nats.connect("ticketing", "abc", { url: "http://localhost:4222" });
stan.on("connect", async () => {
  console.log("Publisher connected to nats");
  const data = {
    id: "123",
    title: "ticket1",
    price: 77.11,
  };

  try {
    await new TicketCreatedPublisher(stan).publish(data);
  } catch (error) {
    console.log(error);
  }
  stan.on("close", () => {
    console.log("Publisher Closing...");
    process.exit();
  });
});

process.on("SIGINT", () => stan.close());
process.on("SIGTERM", () => stan.close());
