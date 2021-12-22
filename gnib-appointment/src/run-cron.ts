import checkSlotsAvailability, {
  Types,
  Categories,
  Subcategories,
} from "./index";

const CronJob = require("cron").CronJob;
const job = new CronJob(
  "* * * * *",
  () => {
    checkSlotsAvailability(Types.New, Categories.All, Subcategories.All);
  },
  null,
  true,
  "America/Los_Angeles"
);
job.start();
