import cron from "node-cron";
import { closeExpiredAuctions } from "../services/product.service.js";

export const expireProductJob = () => {
  cron.schedule("*/30 * * * * *", async () => {
    await closeExpiredAuctions();
  });
};
