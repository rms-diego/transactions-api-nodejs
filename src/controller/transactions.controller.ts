import { FastifyRequest, FastifyReply } from "fastify";

import { z as zod } from "zod";

import { knex } from "../database";

import { randomUUID } from "crypto";

const createTransactionBodySchema = zod.object({
  title: zod.string(),
  amount: zod.number(),
  type: zod.enum(["debit", "credit"]),
});

const findOneTransactionParamSchema = zod.object({
  id: zod.string().uuid(),
});

export const findMany = async (request: FastifyRequest) => {
  const { sessionId } = request.cookies;

  const allTransactions = await knex("transactions")
    .select()
    .where({ session_id: sessionId });

  return { transactions: allTransactions };
};

export const findOne = async (request: FastifyRequest) => {
  const { id } = findOneTransactionParamSchema.parse(request.params);
  const { sessionId } = request.cookies;

  const transaction = await knex("transactions")
    .first()
    .where({ id, session_id: sessionId });

  return { transaction };
};

export const summary = async (request: FastifyRequest) => {
  const { sessionId } = request.cookies;

  const summary = await knex("transactions")
    .where({ session_id: sessionId })
    .first()
    .sum("amount", { as: "amount" });

  return { summary };
};

export const create = async (
  request: FastifyRequest,
  response: FastifyReply
) => {
  const { title, amount, type } = createTransactionBodySchema.parse(
    request.body
  );

  const amountTransaction = type === "credit" ? amount : amount * -1;

  let sessionId = request.cookies.sessionId;

  if (!sessionId) {
    sessionId = randomUUID();

    const oneWeekInMilliseconds = 1000 * 60 * 60 * 24 * 7; // 7 days

    response.cookie("sessionId", sessionId, {
      path: "/",
      maxAge: oneWeekInMilliseconds,
    });
  }

  await knex("transactions").insert({
    id: randomUUID(),
    title,
    amount: amountTransaction,
    session_id: sessionId,
  });

  return response.status(201).send();
};
