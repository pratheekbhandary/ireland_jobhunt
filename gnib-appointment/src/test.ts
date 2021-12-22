import gnibIrelandClient from "./index";
import { triggerNotification } from "./lib/checkSlotsAvailability";

(async () => {
  await triggerNotification();
})();
