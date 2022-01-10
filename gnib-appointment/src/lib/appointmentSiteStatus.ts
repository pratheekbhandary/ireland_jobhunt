import { SocksProxyAgent } from "socks-proxy-agent";
import fetch from "node-fetch";
import logger, { successLogger } from "./logger";
require("dotenv").config();
const agent = new SocksProxyAgent("socks5h://127.0.0.1:9050");

export async function appointmentSiteStatus(): Promise<any> {
  try {
    const APPOINTMENT_SITE =
      "https://www.irishimmigration.ie/burgh-quay-appointments/";
    process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";
    const requestResult = await fetch(APPOINTMENT_SITE, {
      method: "GET",
      agent,
    })
      .then((res) => res.json())
      .then((res) => res.text())
      .then(async (appoitmentSiteHTML) => {
        if (
          !appoitmentSiteHTML
            .replaceAll(/\s/g, "")
            .includes(
              `<p>Thesystemwillbeavailableagainfrom10.00amonMonday10January2022.</p><p>Weunderstandthedifficultiesandfrustrationsexperiencedbycustomerslookingforappointmentsandweapologiseforanyinconveniencecausedbythetemporarydisruptiontotheonlinebookingsystem.</p>`
            )
        ) {
          successLogger.info(`Site has been updated`);
          await triggerNotification();
          await openLinkInChrome();
        }
      });
    return requestResult;
  } catch (err) {
    logger.error("Failed to find slots", err);
  }
}

export const triggerNotification = async () => {
  try {
    const event = "gnib_appointment";
    const event_web = "gnib_appointment_web";
    await fetch(
      `https://maker.ifttt.com/trigger/${event}/with/key/${process.env.IFTT_ID}`
    );
    await fetch(
      `https://maker.ifttt.com/trigger/${event_web}/with/key/${process.env.IFTT_ID}`
    );
  } catch (err) {
    logger.error("Failed to trigger", err);
  }
};

export const openLinkInChrome = async () => {
  try {
    await fetch(`https://${process.env.CHROME_TRIGGER_LINK}`);
  } catch (err) {
    logger.error("Failed to open link", err);
  }
};
