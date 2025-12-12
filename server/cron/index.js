import { expireProductJob } from "./expireProducts.job.js";

export const registerCronJobs = () => {
  expireProductJob();
};
