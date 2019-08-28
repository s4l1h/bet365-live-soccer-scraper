export default {
  params: {
    executablePath: "/opt/google/chrome-unstable/google-chrome",
    headless: true,
    devtools: false,
    ignoreHTTPSErrors: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--disable-extensions",
      "--disable-dev-tools",
      "--disable-infobars",
      "--ignore-certificate-errors"
      // debug logging
      //   "--enable-logging",
      //   "--v=1"
      //       '--proxy-server=127.0.0.1:9876',
    ]
  },
  domain: "mobile.288365.com",
  intervalTimes: {
    list: 1,
    reload: 1200,
    proxy: 60
  },
  proxyListAddr: ""
};
