import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";

it("/api/tickets GET not found", async () => {
  const res = await request(app).get("/api/tickets/abcdefg");
  expect(res.status).toBe(404);
});

it("/api/tickets GET found", async () => {
  const newTicket = Ticket.build({
    title: "abc",
    price: 100,
    userId: "123456",
  });
  await newTicket.save();
  const res = await request(app).get(`/api/tickets/${newTicket._id}`);
  expect(res.status).toBe(200);
  expect(res.body.title).toEqual(newTicket.title);
  expect(res.body.price).toEqual(newTicket.price);
  expect(res.body.userId).toEqual(newTicket.userId);
});
