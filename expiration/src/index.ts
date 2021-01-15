import { randomBytes } from "crypto";
import { OrderCreatedListener } from "./events/listeners/order-created-listener";
import { natsWrapper } from "./events/nats-wrapper";

const start = async () => {
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error("NATS_CLUSTER_ID not set.");
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error("NATS_CLIENT_ID not set.");
  }
  if (!process.env.NATS_URL) {
    throw new Error("NATS_URL not set.");
  }

  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID!,
      process.env.NATS_CLIENT_ID!,
      process.env.NATS_URL!
    );
    natsWrapper.client.on("close", () => {
      console.log("NATS client closed...");
      process.exit();
    });
    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());
    new OrderCreatedListener(natsWrapper.client).listen();
  } catch (error) {
    console.log(error.messsage);
  }
};

start();
