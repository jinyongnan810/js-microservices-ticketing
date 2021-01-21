export const stripe = {
  charges: {
    create: jest.fn().mockResolvedValue({ id: "stripe payment id" }),
  },
};
