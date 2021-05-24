import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import NavbarComponent from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./components/Home";

import { useWeb3Context } from "./contexts/Web3";
import { unlockAccount } from "./api/web3";
import { useAsync } from "./components/useAsync";

import ipfsClient from "ipfs-http-client";
import { MetamaskError } from "./components/MetamaskError";
const ipfs = ipfsClient("/dnsaddr/ipfs.infura.io/tcp/5001/https");

export default function App() {
  const {
    state: { account, netId },
    updateAccount,
  } = useWeb3Context();

  const { pending, error, call } = useAsync(unlockAccount);

  async function onClickConnect() {
    const { error, data } = await call(null);
    if (error) {
      console.error(error);
    }
    if (data) {
      updateAccount(data);
    }
  }

  if (window.ethereum) {
    return (
      <Router>
        <NavbarComponent
          connectMetamask={onClickConnect}
          m_pending={pending}
          m_error={error}
          account={account}
        />
        <Switch>
          <Route
            exact
            path="/"
            component={() => {
              return (
                <Home
                  account={account}
                  network={"private"}
                  ipfs={ipfs}
                  netId={netId}
                />
              );
            }}
          ></Route>
          <Route path="/about">about</Route>
          <Route path="/docs">docs</Route>
        </Switch>
        <Footer />
      </Router>
    );
  } else {
    return (
      <Router>
        <Switch>
          <Route
            exact
            path="/"
            component={() => {
              return <MetamaskError />;
            }}
          ></Route>
        </Switch>
      </Router>
    );
  }
}
