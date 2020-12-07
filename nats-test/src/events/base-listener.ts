import nats, { Message, Stan } from "node-nats-streaming";
interface Event {
  subject: string;
  data: any;
}
export abstract class Listener<T extends Event> {
  abstract subject: T["subject"];
  abstract queueGroupName: string;
  abstract onMessage(data: T["data"], msg: Message): void;
  private client: Stan;
  protected ackWait = 5 * 1000;
  constructor(client: Stan) {
    this.client = client;
  }
  subscriptionOptions() {
    return (
      this.client
        .subscriptionOptions()
        // to prevent failed event get lost
        .setManualAckMode(true) //set manual acknowledge mode to true. Need to manually ack the event after save to db .etc.
        .setDeliverAllAvailable() // (2) get all previous events when first started
        .setDurableName(this.queueGroupName)
    ); // (3)do not send events that already been processed when started
  }
  listen() {
    this.client
      .subscribe(
        this.subject,
        this.queueGroupName, // (1) send each event only to one of the queue menmber
        this.subscriptionOptions()
      )
      .on("message", (msg: Message) => {
        console.log(
          `Event received: Channel[${msg.getSubject()}],Seq[${msg.getSequence()}],Data[${msg.getData()}]`
        );
        const data = this.parseMessage(msg);
        this.onMessage(data, msg);
      });
  }
  parseMessage(msg: Message) {
    const message = msg.getData();
    return typeof message === "string"
      ? JSON.parse(message)
      : JSON.parse(message.toString("utf8"));
  }
}
