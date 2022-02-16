import puppeteer from "puppeteer";
import { JSDOM } from "jsdom";
import StringHash from "string-hash";
import { getProxy } from "./proxy";
import config from "./config";
let page;
export const device = require("puppeteer/DeviceDescriptors")["iPhone X"];
export const cookieDomain = config.domain;
export const mainDomain = `https://mobile.${cookieDomain}/`;
export const liveDomainPath = `https://mobile.${cookieDomain}/#/IP/`;

export const connect = async ({ params }) => {
  try {
    /** create a browser instance, then a page instance with it */
    const browser = await puppeteer.launch(params);

    page = await browser.newPage();

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
    await page.setCookie(...cookie);
    await page.goto(mainDomain);

    await page.goto(liveDomainPath);
    await page.waitForSelector(
      ".ipo-ClassificationMenuBase>div.ipo-Classification.sport_1",
      {
        timeout: 10000
      }
    );
    // Bet365 Logo flip :D
    // await new Promise(resolve => {
    //   setTimeout(resolve, 5000);
    // });
    //   await page.type(String.fromCharCode(13));
    await page.keyboard.press("Escape");
    await page.click(
      ".ipo-ClassificationMenuBase>div.ipo-Classification.sport_1",
      {
        timeout: 10000
      }
    );
    return { page, browser };
  } catch (e) {
    console.log(mainDomain, liveDomainPath, cookieDomain);
    console.log(e);
    browser.close();
    return e.toString();
  }
};

export const getList = async () => {
  // return await page.evaluate(() => {
  try {
    let e = await page.content();
    let dom = new JSDOM(e);

    let document = dom.window.document;
    const matches = {};
    const matchesELM = document.querySelectorAll(
      "div.ipo-Fixture_TimedFixture"
    );

    matchesELM.forEach(matchELM => {
      try {
        // console.log(matchELM);
        let match = {};
        let scores = matchELM.querySelectorAll("span.ipo-Fixture_PointField");
        if (scores.length == 2) {
          // console.log(scores[0].innerHTML);
          // console.log(scores[1].innerHTML);
          match["scoreA"] = scores[0].innerHTML;
          match["scoreB"] = scores[1].innerHTML;
        }
        let teams = matchELM.querySelectorAll(
          "div.ipo-Fixture_CompetitorName > div"
        );
        if (teams.length == 2) {
          // console.log(teams[0].innerHTML);
          // console.log(teams[1].innerHTML);
          match["home"] = teams[0].innerHTML;
          match["away"] = teams[1].innerHTML;
          match["ID"] = StringHash(match["home"] + match["away"]);
        }
        match["time"] = matchELM.querySelector(
          ".ipo-Fixture_GameInfo.ipo-Fixture_Time"
        ).innerHTML;
        match["status"] =
          matchELM.querySelectorAll(".ipo-ParticipantDummy_Suspended").length >
          0
            ? "212"
            : "211";
        if (typeof match["ID"] != "undefined") {
          matches[match["ID"]] = match;
        }
      } catch (exception) {
        console.log(exception);
      }
    });
    return matches;
  } catch (e) {
    console.log(e);
    return e.toString();
  }
  // });
};