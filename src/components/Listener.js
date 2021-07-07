import React from "react";
import UserContext from "../contexts/UserContext";

const Listener = () => {
  const userContext = React.useContext(UserContext);
  const { web3, accounts, netId, contract } = userContext;

  const listenRecordEvent = async () => {
    const results = await contract.getPastEvents("RecordEvent", {
      filter: {
        owner: accounts[0],
      },
      fromBlock: 0,
    });

    return results;
  };

  const listenRecordAddedSinger = async () => {
    const results = await contract.getPastEvents("RecordAddedSinger", {
      filter: {
        owner: accounts[0],
      },
      fromBlock: 0,
    });

    return results;
  };
};

export default Listener;
