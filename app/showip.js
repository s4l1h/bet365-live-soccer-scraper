import puppeteer from "puppeteer";
import { getProxy } from "./proxy";

export const showIP = async params => {
  try {
    /** create a browser instance, then a page instance with it */
    let b = await puppeteer.launch(params);
    let p = await b.newPage();

    let proxy = getProxy();
    console.log("Proxy", proxy);
    if (proxy !== false) {
      await p.authenticate({
        username: proxy.username,
        password: proxy.password
      });
    }

    await p.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36"
    );
    await p.setViewport({ width: 1920, height: 1040 });
    await p.goto("https://whatismyipaddress.com/");
    return await p.screenshot({ encoding: "binary" });
  } catch (exception) {
    console.log(exception);
    return exception.toString();
  } finally {
    if (typeof b != "undefined") {
      b.close();
    }
  }
};
