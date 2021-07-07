import React, { useState, useEffect, useContext } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import UserContext from "./contexts/UserContext";

import NavbarComponent from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./components/Home";
import GenerateLink from "./components/GenerateLink";

import Web3 from "web3";

import ipfsClient from "ipfs-http-client";
import { MetamaskError } from "./components/MetamaskError";
import { MyDocs } from "./components/MyDocs";

import DocifyAbi from "./abis/Docify.json";

const ipfs = ipfsClient("/dnsaddr/ipfs.infura.io/tcp/5001/https");

const web3 = new Web3(window.ethereum);

export default function App() {
  const [storageValue, setStorageValue] = useState(undefined);
  const [accounts, setAccounts] = useState(undefined);
  const [contract, setContract] = useState(undefined);
  const [netId, setNetId] = useState(-1);
  const [error, setError] = useState(undefined);

  useEffect(() => {
    const init = async () => {
      try {
        const accounts = await web3.eth.getAccounts();

        const networkId = await web3.eth.net.getId();
        const deployedNetwork = DocifyAbi.networks[networkId];
        const instance = new web3.eth.Contract(
          DocifyAbi.abi,
          deployedNetwork.address
        );

        setAccounts(accounts);
        setNetId(networkId);
        setContract(instance);
      } catch (error) {
        setError(error);
      }
    };
    init();
    console.log(accounts);
  }, [netId, accounts, contract]);

  useEffect(() => {
    const load = async () => {
      // const response = await contract.methods.get().call();
      // setStorageValue(response);
    };
    if (
      typeof web3 !== "undefined" &&
      typeof accounts !== "undefined" &&
      typeof contract !== "undefined"
    ) {
      load();
    }
  }, [accounts, contract]);

  if (typeof web3 !== "undefined") {
    return (
      <Router>
        <UserContext.Provider value={{ web3, accounts, netId, contract }}>
          <NavbarComponent m_error={error} />
          <Switch>
            <Route
              exact
              path="/"
              component={() => {
                return <Home ipfs={ipfs} m_error={error} />;
              }}
            ></Route>
            <Route
              exact
              path="sign/:hash"
              render={(props) => {
                return <GenerateLink {...props} />;
              }}
            />
            <Route
              exact
              path="/docs"
              component={() => {
                return <MyDocs ipfs={ipfs} />;
              }}
            />
          </Switch>
          <Footer />
        </UserContext.Provider>
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
