import { expireProductJob } from "./expireProducts.job.js";
import { expireSellerJob } from "./expireSeller.job.js";

export const registerCronJobs = () => {
  expireProductJob();
  expireSellerJob();
};
