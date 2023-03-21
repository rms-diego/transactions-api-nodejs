import {
  test,
  expect,
  beforeAll,
  afterAll,
  describe,
  beforeEach,
} from "vitest";
import request from "supertest";

import { execSync } from "node:child_process";

import { app } from "../src/app";

describe("Tests transactions routes", () => {
  const server = app.server;

  beforeAll(async () => app.ready());

  afterAll(async () => app.close());

  beforeEach(() => {
    const resetDb =
      "npm run knex -- migrate:rollback && npm run knex -- migrate:latest";

    execSync(resetDb);
  });

  test("[POST] [/transactions/create] It should be able user create a new transaction", async () => {
    const transactionBody = {
      title: "Um titulo qualquer",
      amount: 10000,
      type: "credit",
    };

    await request(server)
      .post("/transactions/create")
      .send(transactionBody)
      .expect(201);
  });

  test("[GET] [/transactions/findMany] It should be able get all transactions", async () => {
    const transactionBody = {
      title: "Um titulo qualquer",
      amount: 10000,
      type: "credit",
    };

    const response = await request(server)
      .post("/transactions/create")
      .send(transactionBody)
      .expect(201);

    const cookie = response.get("Set-Cookie");

    const {
      body: { transactions },
    } = await request(server)
      .get("/transactions/findMany")
      .set("Cookie", cookie)
      .expect(200);

    expect(transactions).toEqual([
      expect.objectContaining({ title: "Um titulo qualquer", amount: 10000 }),
    ]);
  });

  test("[GET] [/transactions/findOne/:transactionId] It should be able get specific transactions", async () => {
    const transactionBody = {
      title: "Um titulo qualquer",
      amount: 10000,
      type: "credit",
    };

    const response = await request(server)
      .post("/transactions/create")
      .send(transactionBody)
      .expect(201);

    const cookie = response.get("Set-Cookie");

    const {
      body: { transactions },
    } = await request(server)
      .get("/transactions/findMany")
      .set("Cookie", cookie)
      .expect(200);

    const transactionId = transactions[0].id;

    const {
      body: { transaction },
    } = await request(server)
      .get(`/transactions/findOne/${transactionId}`)
      .set("Cookie", cookie)
      .expect(200);

    expect(transaction).toEqual(
      expect.objectContaining({ title: "Um titulo qualquer", amount: 10000 })
    );
  });

  test("[GET] [/transactions/summary] It should be able get the summary", async () => {
    const creditTransactionBody = {
      title: "Um titulo qualquer",
      amount: 10000,
      type: "credit",
    };

    const debitTransactionBody = {
      title: "Um titulo qualquer",
      amount: 5000,
      type: "debit",
    };

    const creditTransactionResponse = await request(server)
      .post("/transactions/create")
      .send(creditTransactionBody)
      .expect(201);

    const cookie = creditTransactionResponse.get("Set-Cookie");

    await request(server)
      .post("/transactions/create")
      .send(debitTransactionBody)
      .set("Cookie", cookie)
      .expect(201);

    const {
      body: { summary },
    } = await request(server)
      .get("/transactions/summary")
      .set("Cookie", cookie)
      .expect(200);

    expect(summary).toEqual({ amount: 5000 });
  });
});
