import { FastifyRequest, FastifyReply, HookHandlerDoneFunction } from "fastify";

export const validateSessionId = (
  request: FastifyRequest,
  response: FastifyReply,
  next: HookHandlerDoneFunction
) => {
  const { sessionId } = request.cookies;

  if (!sessionId) {
    return response.status(401).send({ error: "unauthorized" });
  }

  return next();
};
