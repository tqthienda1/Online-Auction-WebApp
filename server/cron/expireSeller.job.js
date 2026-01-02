import cron from "node-cron";
import { updateExpiredSeller } from "../services/user.service.js";

export const expireSellerJob = () => {
  cron.schedule("*/30 * * * * *", async () => {
    await updateExpiredSeller();
  });
};
