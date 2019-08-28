import { connect, getList } from "./bet365mobile";
import { getParams } from "./proxy";
import config from "./config";

export let pageInterval = false;
export let resultInterval = false;
export let page = false;
export let browser = false;
export let result = false;

export const setPage = p => {
  page = p;
};
export const getPage = () => page;

export const setBrowser = p => {
  browser = p;
};
export const getBrowser = () => browser;

export const closeHandler = async () => {
  //await page.screenshot({ path: "buddy-screenshot.png" });
  try {
    if (browser === false) {
      return "browser is not found";
    }
    await clearInternvalTimer();
    await browser.close();
    setBrowser(false);
    setPage(false);
    return "success";
  } catch (exception) {
    console.log(exception);
    return exception.toString();
  }
};
export const reloadHandler = async () => {
  try {
    if (browser === false) {
      return "browser is not found";
    }
    await clearInternvalTimer();
    await browser.close();
    return await connectHandler();
  } catch (exception) {
    console.log(exception);
    return exception.toString();
  }
};
export const screenShotHandler = async () => {
  //await page.screenshot({ path: "buddy-screenshot.png" });
  try {
    if (page === false) {
      return "page is not found";
    }
    return await page.screenshot();
  } catch (exception) {
    console.log(exception);
    return exception.toString();
  }
};
export const getContentHandler = async () => {
  try {
    if (page === false) {
      return "page is not found";
    }
    return await page.content();
  } catch (exception) {
    console.log(exception);
    return exception.toString();
  }
  //return await page.evaluate(() => document.body.innerHTML);
};
export const connectHandler = async () => {
  try {
    let { page, browser } = await connect({
      params: getParams()
    });
    setPage(page);
    setBrowser(browser);
    await setIntervalTimer();
    return await screenShotHandler();
  } catch (e) {
    return JSON.stringify(e);
  }

  return;
};
export const getListHandler = async () => {
  return JSON.stringify(await getList());
};
export const resultHandler = async () => {
  return JSON.stringify(result);
};

export const setIntervalTimer = async () => {
  // console.log("");
  await clearInternvalTimer();
  // setup page reload interval
  if (config.intervalTimes.reload != 0) {
    pageInterval = setInterval(async () => {
      if (page != false) {
        console.log("Browser Reload");
        await reloadHandler();
      }
    }, 1000 * config.intervalTimes.reload);
  }

  // setup result interval
  if (config.intervalTimes.list != 0) {
    resultInterval = setInterval(async () => {
      if (page != false) {
        result = await getList();
      }
    }, 1000 * config.intervalTimes.list);
  }
};

export const clearInternvalTimer = async () => {
  if (pageInterval != false) {
    // console.log("Time interval has been cleared");
    clearInterval(pageInterval);
  }
  if (resultInterval != false) {
    // console.log("Time interval has been cleared");
    clearInterval(resultInterval);
  }
};
