import axios from "axios";
import config from "./config";
// import proxyChain from "proxy-chain";

export let proxyList = [];
export const proxyIndex = 0;

export const fetchProxyList = async () => {
  if (config.proxyListAddr === "") {
    return;
  }
  try {
    let response = await axios.get(config.proxyListAddr);
    if (response.data == null) {
      console.log("Proxy response return null", response.data);
      return;
    }

    proxyList = response.data.map(
      ({ host, port, username, password, type }) => {
        return { host, port, username, password, type };
      }
    );
    console.log("proxyList Reloaded");
  } catch (err) {
    console.log(err);
  }
};

const pickNextProxy = () => {
  proxyIndex++;
  if (proxyIndex >= proxyList.length) {
    proxyIndex = 0;
  }
  setProxy(proxyList[proxyIndex]);
};

let proxy = false;
let params = { ...config.params };

export const setProxy = async p => {
  proxy = p;
  params = { ...config.params };
  params.args = [...params.args, `--proxy-server=${p.host}:${p.port}`];
};

export const clearProxyParam = async () => {
  proxy = false;
  params = { ...config.params };
  params.args = [...params.args];
};

export const getParams = () => {
  return params;
};
export const getProxy = () => {
  return proxy;
};