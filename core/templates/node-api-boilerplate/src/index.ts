import express from "express";
import { requestIdMiddleware } from "@platform/middleware";
import { createLogger } from "@platform/logger";

const app = express();
const logger = createLogger("node-api-boilerplate");

app.use(requestIdMiddleware);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/", (_req, res) => {
  logger.info("Boilerplate backend activo");
  res.json({ service: "node-api-boilerplate" });
});

app.listen(3000, () => {
  logger.info("Servidor escuchando en puerto 3000");
});
