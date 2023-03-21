import fastify from "fastify";
import cookie from "@fastify/cookie";

// routes
import { transactionsRoutes } from "../routes/transactions";

const app = fastify();

app.register(cookie);

app.register(transactionsRoutes, {
  prefix: "transactions",
});

app.get("/", () => ({ message: "hello world!" }));

export { app };
