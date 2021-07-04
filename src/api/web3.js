import Web3 from "web3";
import Docify from "../abis/Docify.json";

export async function unlockAccount() {
  const { ethereum } = window;

  if (!ethereum) {
    throw new Error("This browser does not support Web3!");
  }

  const web3 = new Web3(ethereum);
  await ethereum.enable();

  const accounts = await web3.eth.getAccounts();
  return { web3, account: accounts[0] || "" };
}

export function subscribeToAccount(web3, callback) {
  const id = setInterval(async () => {
    try {
      const accounts = await web3.eth.getAccounts();
      callback(null, accounts[0]);
    } catch (e) {
      callback(e, null);
    }
  }, 1000);

  return () => {
    clearInterval(id);
  };
}

export function subscribeToNetID(web3, callback) {
  const id = setInterval(async () => {
    try {
      const netId = await web3.eth.net.getId();
      callback(null, netId);
    } catch (e) {
      callback(e, null);
    }
  }, 1000);

  return () => {
    clearInterval(id);
  };
}

export function subscribeToContract(web3, callback) {
  const contract = setInterval(async () => {
    try {
      const netData = Docify.networks[parseInt(window.ethereum.chainId)];

      if (netData) {
        const c = new web3.eth.Contract(Docify.abi, netData.address);
        callback(null, c);
      }
    } catch (e) {
      callback(e, null);
    }
  }, 1000);

  return () => {
    clearInterval(contract);
  };
}
