import { FastifyInstance } from "fastify";

import { validateSessionId } from "../middleware/validateSessionId";

import * as controller from "../controller/transactions.controller";

export const transactionsRoutes = async (app: FastifyInstance) => {
  // app.addHook("preHandler", validateSessionId);

  app.get(
    "/findMany",
    { preHandler: [validateSessionId] },
    controller.findMany
  );

  app.get(
    "/findOne/:id",
    { preHandler: [validateSessionId] },
    controller.findOne
  );

  app.get("/summary", { preHandler: [validateSessionId] }, controller.summary);

  app.post("/create", controller.create);
};
