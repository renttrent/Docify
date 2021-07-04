import React from 'react';
import UserContext from '../contexts/UserContext';

const Listener = () => {

    const userContext = React.useContext();
    const {web3, accounts, netId, contract} = userContext;

    const listenRecordEvent = () => {
        
    }

    const listenRecordAddedSinger = () => {

    }

}


export default Listener;
