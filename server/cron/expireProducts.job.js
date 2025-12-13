import cron from "node-cron";
import prisma from "../prismaClient.js";

export const expireProductJob = () => {
  cron.schedule("*/30 * * * * *", async () => {
    try {
      await prisma.product.updateMany({
        where: {
          endTime: { lt: new Date() },
          sold: { not: true },
        },
        data: { sold: true },
      });

      console.log("Cron: expired products updated.");
    } catch (err) {
      console.error("Cron error:", err);
    }
  });
};
