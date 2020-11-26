import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";

it("/api/tickets GET", async () => {
  const newTicket1 = Ticket.build({
    title: "abc",
    price: 100,
    userId: "123456",
  });
  await newTicket1.save();
  const newTicket2 = Ticket.build({
    title: "def",
    price: 101,
    userId: "654321",
  });
  await newTicket2.save();

  const res = await request(app).get("/api/tickets");
  expect(res.status).toBe(200);

  expect(res.body[0].title).toEqual("abc");
  expect(res.body[0].price).toEqual(100);
  expect(res.body[0].userId).toEqual("123456");
  expect(res.body[1].title).toEqual("def");
  expect(res.body[1].price).toEqual(101);
  expect(res.body[1].userId).toEqual("654321");
});
