import { Ticket } from "../ticket";

it("implement optimistic concurrency control", async () => {
  const ticket = Ticket.build({ userId: "123", title: "ticket1", price: 11 });
  await ticket.save();
  const ticket1 = await Ticket.findById(ticket.id);
  const ticket2 = await Ticket.findById(ticket.id);
  expect(ticket1!.version).toEqual(0);
  // perform update
  try {
    ticket1!.price = 22;
    await ticket1!.save();
  } catch (error) {
    console.log("first update failed", error);
    fail();
  }
  // perform update again on original instance
  try {
    ticket2!.price = 33;
    await ticket2!.save();
    fail();
  } catch (error) {
    console.log("second update failed", error);
  }
  // perform update normally
  try {
    ticket1!.price = 44;
    await ticket1!.save();
    expect(ticket1!.version).toEqual(2);
  } catch (error) {
    console.log("third update failed", error);
    fail();
  }
  // perform update normally
  try {
    ticket1!.price = 55;
    await ticket1!.save();
    expect(ticket1!.version).toEqual(3);
  } catch (error) {
    console.log("forth update failed", error);
    fail();
  }
});
