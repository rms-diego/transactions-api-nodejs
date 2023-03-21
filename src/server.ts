import { env } from "./env";

import { app } from "./app";

app.listen({ port: +env.PORT }, (error, address) => {
  if (error) throw new Error(error.message);

  console.log("Server running\nlink: %s", address);
});
