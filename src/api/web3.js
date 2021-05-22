import Web3 from "web3";

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
