import React, { useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Web3 from "web3";

import NavbarComponent from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./components/Home";

const ipfsClient = require("ipfs-http-client");
const ipfs = ipfsClient({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "http",
  apiPath: "/ipfs/api/v0",
});

export default function App() {
  const [account, setAccount] = useState("0x0");
  const [network, setNetwork] = useState("no network");
  const [web3, setWeb3] = useState("");

  async function getAccounts() {
    const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
    const net = await web3.eth.net.getNetworkType();
    const accounts = await web3.eth.getAccounts();

    setAccount(accounts[0]);
    setNetwork(net);
    setWeb3(web3);
  }

  async function ethEnabled() {
    if (window.ethereum) {
      await window.ethereum.send("eth_requestAccounts");
      window.web3 = new Web3(window.ethereum);
      return true;
    }
    return false;
  }

  getAccounts();

  return (
    <Router>
      <NavbarComponent />
      <Switch>
        <Route
          exact
          path="/"
          component={() => {
            return <Home account={account} network={network} ipfs={ipfs} />;
          }}
        ></Route>
        <Route path="/about">about</Route>
        <Route path="/docs">docs</Route>
      </Switch>
      <Footer />
    </Router>
  );
}
