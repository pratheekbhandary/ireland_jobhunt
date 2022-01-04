import checkSlotsAvailability, {
  Types,
  Categories,
  Subcategories,
} from "./index";

const CronJob = require("cron").CronJob;
const job = new CronJob(
  "*/10 * * * * *",
  () => {
    checkSlotsAvailability(Types.New, Categories.All, Subcategories.All);
  },
  null,
  true,
  "America/Los_Angeles"
);
job.start();
