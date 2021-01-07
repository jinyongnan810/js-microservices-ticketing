import { Subjects } from "@jinyongnan810/ticketing-common";
import { Mongoose } from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { natsWrapper } from "../../events/nats-wrapper";
import { Ticket } from "../../models/ticket";

it("/api/tickets PUT need to signin", async () => {
  const newTicket = Ticket.build({
    title: "abc",
    price: 100,
    userId: "123456",
  });
  await newTicket.save();

  const cookie = global.signup();

  const res = await request(app)
    .put(`/api/tickets/${newTicket._id}`)
    .send({ title: "changed", price: "777" });
  expect(res.status).toBe(401);
});

it("/api/tickets PUT need to be the owner", async () => {
  const newTicket = Ticket.build({
    title: "abc",
    price: 100,
    userId: "xxxxxx",
  });
  await newTicket.save();

  const cookie = global.signup();

  const res = await request(app)
    .put(`/api/tickets/${newTicket._id}`)
    .set("Cookie", cookie)
    .send({ title: "changed", price: "777" });
  expect(res.status).toBe(401);
});

it("/api/tickets PUT not found", async () => {
  const newTicket = Ticket.build({
    title: "abc",
    price: 100,
    userId: "123456",
  });
  await newTicket.save();

  const cookie = global.signup();

  const res = await request(app)
    .put(`/api/tickets/111`)
    .set("Cookie", cookie)
    .send({ title: "changed", price: "777.77" });
  expect(res.status).toEqual(404);
});

it("/api/tickets PUT invalid", async () => {
  const newTicket = Ticket.build({
    title: "abc",
    price: 100,
    userId: "123456",
  });
  await newTicket.save();

  const cookie = global.signup();

  const res = await request(app)
    .put(`/api/tickets/${newTicket._id}`)
    .set("Cookie", cookie)
    .send({ title: "", price: "-1" });
  expect(res.status).toBe(400);
  expect(res.body.errors[0]["field"]).toBe("title");
  expect(res.body.errors[1]["field"]).toBe("price");
});

it("/api/tickets PUT valid", async () => {
  const newTicket = Ticket.build({
    title: "abc",
    price: 100,
    userId: "123456",
  });
  await newTicket.save();

  const cookie = global.signup();

  const res = await request(app)
    .put(`/api/tickets/${newTicket._id}`)
    .set("Cookie", cookie)
    .send({ title: "changed", price: "777.77" });
  expect(res.status).toEqual(200);
  // db
  const updated = await Ticket.findById(newTicket._id);
  expect(updated).toBeTruthy();
  expect(updated!.price).toBe(777.77);
  expect(updated!.title).toBe("changed");
  // event
  expect(natsWrapper.client.publish).toBeCalled();
  expect(natsWrapper.client.publish).toBeCalledWith(
    Subjects.TICKET_UPDATED,
    JSON.stringify({
      id: updated?.id,
      title: updated?.title,
      price: updated?.price,
      userId: updated?.userId,
      version: updated?.version,
    }),
    expect.any(Function)
  );
});
