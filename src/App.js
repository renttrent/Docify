import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";

import NavbarComponent from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./components/Home";

import { useWeb3Context } from "./contexts/Web3";
import { unlockAccount } from "./api/web3";
import { useAsync } from "./components/useAsync";

import ipfsClient from "ipfs-http-client";
const ipfs = ipfsClient({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  apiPath: "/ipfs/api/v0",
});

export default function App() {
  // const [account, setAccount] = useState("0x0");
  // const [network, setNetwork] = useState("no network");
  // const [web3, setWeb3] = useState("");
  // const [provider, setProvider] = useState(null);

  const {
    state: { account },
    updateAccount,
  } = useWeb3Context();

  const { pending, error, call } = useAsync(unlockAccount);

  // useEffect(() => {
  //   async function getAccounts() {
  //     const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
  //     const net = await web3.eth.net.getNetworkType();
  //     const accounts = await web3.eth.getAccounts();
  //     const p = await detectEthereumProvider();

  //     setAccount(accounts[0]);
  //     setNetwork(net);
  //     setWeb3(web3);
  //     setProvider(p);
  //   }
  //   getAccounts();
  // }, [account]);
  async function onClickConnect() {
    const { error, data } = await call(null);

    if (error) {
      console.error(error);
    }
    if (data) {
      updateAccount(data);
    }
  }
  return (
    <Router>
      <NavbarComponent
        connectMetamask={onClickConnect}
        m_pending={pending}
        m_error={error}
      />
      <Switch>
        <Route
          exact
          path="/"
          component={() => {
            return <Home account={account} network={"private"} ipfs={ipfs} />;
          }}
        ></Route>
        <Route path="/about">about</Route>
        <Route path="/docs">docs</Route>
      </Switch>
      <Footer />
    </Router>
  );
}
