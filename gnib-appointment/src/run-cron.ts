import { appointmentSiteStatus } from "./index";

const CronJob = require("cron").CronJob;
const job = new CronJob(
  "*/30 * * * * *",
  () => {
    appointmentSiteStatus();
  },
  null,
  true,
  "America/Los_Angeles"
);
job.start();
