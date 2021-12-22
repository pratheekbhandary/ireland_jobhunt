import { SocksProxyAgent } from "socks-proxy-agent";
import fetch from "node-fetch";
import { Types, Categories, Subcategories } from "./interfaces";
import logger, { successLogger } from "./logger";

const agent = new SocksProxyAgent("socks5h://127.0.0.1:9050");

let TAG_LEN = 32;
const K_TAG = '<input id="k" type="hidden" value="';
const P_TAG = '<input id="p" type="hidden" value="';
const headers = {
  Host: "burghquayregistrationoffice.inis.gov.ie",
  "User-Agent":
    "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:62.0) Gecko/20100101 Firefox/62.0",
  Accept: "application/json, text/javascript, */*; q=0.01",
  Referer:
    "https://burghquayregistrationoffice.inis.gov.ie/Website/AMSREG/AMSRegWeb.nsf/AppSelect?OpenForm",
  "X-Requested-With": "XMLHttpRequest",
  Cookie:
    "_ga=GA1.3.1378869052.1536830642; _gid=GA1.3.1590764695.1537783699; cookieconsent_status=dismiss",
  Connection: "keep-alive",
};

function buildUrl(
  type: Types,
  category: Categories,
  subcategory: Subcategories
): string {
  return `https://burghquayregistrationoffice.inis.gov.ie/Website/AMSREG/AMSRegWeb.nsf/(getAppsNear)?readform&&cat=${category}&sbcat=${subcategory}&typ=${type}`;
  // return `https://burghquayregistrationoffice.inis.gov.ie/Website/AMSREG/AMSRegWeb.nsf/(getApps4DTAvailability)?readform&&cat=${category}&sbcat=${subcategory}&typ=${type}`;
}
function getSlots(json) {
  if (json?.empty === "TRUE") return [];
  return typeof json.slots === "string" ? JSON.parse(json.slots) : json.slots;
}

function buildReturn({ slots, type, category, subcategory }) {
  return {
    status: "success",
    data: {
      type,
      category,
      subcategory,
      slots,
    },
  };
}

async function getNewTokens() {
  try {
    const response = await fetch(
      "https://burghquayregistrationoffice.inis.gov.ie/Website/AMSREG/AMSRegWeb.nsf/AppSelect?OpenForm",
      {
        agent,
      }
    );
    const page = await response.text();
    const kAndP = getKayAndPiTokensFromPage(page);
    return kAndP;
  } catch (err) {
    logger.error("Failed to fetch p and k", err);
  }
}

function getKayAndPiTokensFromPage(page) {
  const kStartIndex = page.lastIndexOf(K_TAG) + K_TAG.length;
  const pStartIndex = page.lastIndexOf(P_TAG) + P_TAG.length;
  const k = page.substring(kStartIndex, kStartIndex + TAG_LEN);
  const p = page.substring(pStartIndex, pStartIndex + TAG_LEN);

  return {
    k,
    p,
  };
}

export async function checkSlotsAvailability(
  type: Types = Types.New,
  category: Categories = Categories.All,
  subcategory: Subcategories = Subcategories.All
): Promise<any> {
  try {
    process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";
    const URL_CHECK_SLOTS = buildUrl(type, category, subcategory);
    const { p, k } = await getNewTokens();
    logger.debug(`URL:${URL_CHECK_SLOTS + `&k=${k}` + `&p=${p}`}`);
    const requestResult = await fetch(URL_CHECK_SLOTS + `&k=${k}` + `&p=${p}`, {
      method: "GET",
      headers,
      agent,
    })
      .then((res) => res.json())
      .then((res) => {
        logger.silly(res);
        return res;
      })
      .then(getSlots)
      .then(async (slots) => {
        if (slots.length > 0) {
          successLogger.info(`Dates found: ${JSON.stringify(slots)}`);
          await triggerNotification();
        } else {
          logger.silly("No dates available at the moment");
        }
      });
    return requestResult;
  } catch (err) {
    logger.error("Failed to find slots", err);
  }
}

export const triggerNotification = async () => {
  const event = "gnib_appointment";
  await fetch(
    `https://maker.ifttt.com/trigger/${event}/with/key/bh7FcxgiUux43OL-AhbJgo`
  );
};
