import Bet365 from "./bet365";
import { getParams } from "./proxy";
import config from "./config";

export let pageReloadInterval = false;
export let resultInterval = false;
export let result = false;

let instance = new Bet365();

export const closeHandler = async () => {
  //await page.screenshot({ path: "buddy-screenshot.png" });
  try {
    await clearInternvalTimer();
    await instance.close();

    return "success";
  } catch (exception) {
    console.log(exception);
    return exception.toString();
  }
};
export const reloadHandler = async () => {
  try {
    await clearInternvalTimer();
    await instance.close();
    return await connectHandler();
  } catch (e) {
    console.log(e);
    return e.toString();
  }
};
export const screenShotHandler = async () => {
  //await page.screenshot({ path: "buddy-screenshot.png" });
  try {
    if (instance.page === false) {
      return "page is not found";
    }
    return await instance.page.screenshot();
  } catch (e) {
    console.log(e);
    return e.toString();
  }
};
export const getContentHandler = async () => {
  try {
    if (instance.page === false) {
      return "page is not found";
    }
    return await instance.page.content();
  } catch (e) {
    console.log(e);
    return e.toString();
  }
  //return await page.evaluate(() => document.body.innerHTML);
};
export const connectHandler = async () => {
  try {
    if (instance.browser != false) {
      return "browser is already open. You can use <a href='/reload'>reload</a> handler";
    }
    let i = new Bet365();
    await i.connect({
      params: getParams()
    });
    instance = i;
    await setIntervalTimer();
    return await screenShotHandler();
  } catch (e) {
    return JSON.stringify(e);
  }

  return;
};
export const getListHandler = async res => {
  res.set("fetch-time", instance.fetchTime);
  return JSON.stringify(await instance.getList());
};
export const resultHandler = async res => {
  res.set("fetch-time", instance.fetchTime);
  return JSON.stringify(result);
};

export const setIntervalTimer = async () => {
  // console.log("");
  await clearInternvalTimer();
  // setup page reload interval
  if (config.intervalTimes.reload != 0) {
    pageReloadInterval = setInterval(async () => {
      if (instance.page != false) {
        console.log("Browser Reload");
        await reloadHandler();
      }
    }, 1000 * config.intervalTimes.reload);
  }

  // setup result interval
  if (config.intervalTimes.list != 0) {
    resultInterval = setInterval(async () => {
      if (instance.page != false) {
        result = await instance.getList();
      }
    }, 1000 * config.intervalTimes.list);
  }
};

export const clearInternvalTimer = async () => {
  if (pageReloadInterval != false) {
    // console.log("Time interval has been cleared");
    clearInterval(pageReloadInterval);
  }
  if (resultInterval != false) {
    // console.log("Time interval has been cleared");
    clearInterval(resultInterval);
  }
};