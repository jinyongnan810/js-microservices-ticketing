import nats, { Stan } from "node-nats-streaming";
class NatsWrapper {
  _client?: Stan;
  connect(clusterId: string, clientId: string, url: string): Promise<void> {
    this._client = nats.connect(clusterId, clientId, { url });
    return new Promise((resolve, reject) => {
      this._client!.on("connect", () => {
        console.log("Connected to NATS");
        resolve();
      });
      this._client!.on("error", (err) => {
        console.log("Failed to connect to NATS");
        reject(err);
      });
    });
  }
}

export const natsWrapper = new NatsWrapper();
