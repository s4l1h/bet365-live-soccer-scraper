import { showIP } from "./showip";
import {
  fetchProxyList,
  proxyList,
  getParams,
  setProxy,
  clearProxyParam
} from "./proxy";
import {
  connectHandler,
  screenShotHandler,
  resultHandler,
  reloadHandler,
  closeHandler,
  getContentHandler,
  getListHandler
} from "./handlers";

import config from "./config";

// Fetch Proxy
fetchProxyList();
setInterval(async () => {
  await fetchProxyList();
}, 1000 * config.intervalTimes.proxy);

const express = require("express");

const app = express();
app.get("/connect", async (req, res) => {
  try {
    res.end(await connectHandler());
  } catch (e) {
    res.end(e.toString());
  }
});
app.get("/reload", async (req, res) => {
  res.end(await reloadHandler());
});
app.get("/close", async (req, res) => {
  res.end(await closeHandler());
});
app.get("/html", async (req, res) => {
  res.end(await getContentHandler());
});
app.get("/screenshot", async (req, res) => {
  res.end(await screenShotHandler());
});
app.get("/result", async (req, res) => {
  res.end(await getListHandler(res));
});
app.get("/", async (req, res) => {
  res.end(await resultHandler(res));
});
// Show IP
app.get("/showip", async (req, res) => {
  res.end(await showIP(getParams()));
});

app.get("/params", (req, res) => {
  res.end(JSON.stringify(getParams()));
});
app.get("/pickProxy/:id", async (req, res) => {
  if (req.params.id != "") {
    await setProxy(proxyList[req.params.id]);
    res.end(JSON.stringify(getParams()));
  }
});
app.get("/proxyList", async (req, res) => {
  res.end(JSON.stringify(proxyList));
});

app.get("/clearProxyParam", async (req, res) => {
  await clearProxyParam();
  res.end(JSON.stringify(getParams()));
});

app.listen(process.env.PORT || 3000);