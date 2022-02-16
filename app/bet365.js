import puppeteer from "puppeteer";
import { JSDOM } from "jsdom";
import StringHash from "string-hash";
import { getProxy } from "./proxy";
import config from "./config";
import { clickLink } from "./helpers";
const device = {
  name: "Desktop 1920x1080",
  userAgent:
    "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.75 Safari/537.36",
  viewport: {
    width: 1920,
    height: 1080
  }
};
const cookieDomain = config.domain;
const mainDomain = `https://www.${cookieDomain}/`;
const liveDomainPath = `https://www.${cookieDomain}/#/IP/`;

const inplay = `//a[text()="In-Play"]`;
const livesoccer = `//div[text()="Soccer" and @class="ipo-ClassificationBarButtonBase_Label "]`;
const livetennis = `//div[text()="Tennis" and @class="ipo-ClassificationBarButtonBase_Label "]`;
let clickSoccerInterval = false;
class Bet365 {
  constructor() {
    this.page = false;
    this.browser = false;
    this.error = "";
    this.fetchTime = new Date();
  }
  async getList() {
    if (this.page == false) {
      return "page not found ";
    }
    // return await page.evaluate(() => {
    try {
      let e = await this.page.content();
      let dom = new JSDOM(e);

      let document = dom.window.document;

      const matches = {};
      const matchesELM = document.querySelectorAll("div.ipo-Fixture_TableRow");
      matchesELM.forEach(matchELM => {
        try {
          let match = {};
          let scores = matchELM.querySelectorAll(
            "div.ipo-TeamPoints_TeamScore"
          );
          if (scores.length == 2) {
            match["scoreA"] = scores[0].innerHTML;
            match["scoreB"] = scores[1].innerHTML;
          }
          let teams = matchELM.querySelectorAll(
            "span.ipo-TeamStack_TeamWrapper"
          );
          if (teams.length == 3) {
            match["home"] = teams[0].innerHTML;
            match["away"] = teams[1].innerHTML;
            match["ID"] = StringHash(match["home"] + match["away"]);
          }
          match["time"] = matchELM.querySelector(".ipo-InPlayTimer").innerHTML;
          match["status"] =
            matchELM.querySelectorAll(".gll-ParticipantCentered_Suspended")
              .length > 0
              ? "212"
              : "211";

          if (typeof match["ID"] != "undefined") {
            matches[match["ID"]] = match;
          }
        } catch (e) {
          console.log(e);
          return e.toString();
        }
      });
      this.fetchTime = new Date();
      return matches;
    } catch (e) {
      console.log(e);
      return e.toString();
    }
    // });
  }
  async close() {
    if (this.browser == false) {
      return "browser not found ";
    }
    // clear Interval
    if (clickSoccerInterval != false) {
      // console.log("Time interval has been cleared");
      clearInterval(clickSoccerInterval);
    }
    this.browser.close();
    this.browser = false;
    this.page = false;
  }
  async connect({ params }) {
    try {
      /** create a browser instance, then a page instance with it */
      let browser = await puppeteer.launch(params);

      let page = await browser.newPage();

      await page.emulate(device);

      let proxy = getProxy();
      if (proxy !== false) {
        await page.authenticate({
          username: proxy.username,
          password: proxy.password
        });
      }

      var cookie = [
        // cookie exported by google chrome plugin editthiscookie
        {
          domain: "." + cookieDomain,
          expirationDate: parseInt(Date.now() / 1000) + 10 * 36 * 24 * 3600,
          name: "aps03",
          path: "/",
          value: "lng=1&tzi=1&oty=2&ct=197&cg=0&cst=0&hd=N&cf=N"
        },
        {
          domain: "." + cookieDomain,
          expirationDate: parseInt(Date.now() / 1000) + 10 * 36 * 24 * 3600,
          name: "session",
          path: "/",
          value: "processform=0"
        }
      ];
      await page.goto(mainDomain);
      await page.setCookie(...cookie);

      await page.goto(liveDomainPath);

      await page.waitForXPath(inplay);
      await clickLink(page, inplay);

      await page.waitForXPath(livesoccer);
      await clickLink(page, livesoccer);

      this.page = page;
      this.browser = browser;
      this.error = "";

      if (clickSoccerInterval === false) {
        clickSoccerInterval = setInterval(async () => {
          if (page != false) {
            await page.waitForXPath(livesoccer);
            await clickLink(page, livesoccer);
          }
        }, 1000 * 60 * 20);
      }
      // return { page, browser };
    } catch (e) {
      console.log(e);
      this.error = e.toString();
      browser.close();
      // return e.toString();
    }
  }
}

export default Bet365;