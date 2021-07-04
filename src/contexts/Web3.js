import React, {
  useReducer,
  createContext,
  useContext,
  useEffect,
  useMemo,
} from "react";
import {
  subscribeToAccount,
  subscribeToNetID,
  subscribeToContract,
} from "../api/web3";

const INITIAL_STATE = {
  type: "",
  account: "",
  netId: 0,
  web3: null,
  contract: null,
};

const UPDATE_ACCOUNT = "UPDATE_ACCOUNT";
const UPDATE_NET_ID = "UPDATE_NET_ID";
const UPDATE_CONTRACT = "UPDATE_CONTRACT";

function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case UPDATE_ACCOUNT: {
      const web3 = action.web3 || state.web3;
      const { account } = action;

      return {
        ...state,
        web3,
        account,
      };
    }
    case UPDATE_NET_ID: {
      const { netId } = action;

      return {
        ...state,
        netId,
      };
    }
    case UPDATE_CONTRACT: {
      const { contract } = action;

      return {
        ...state,
        contract,
      };
    }
    default:
      return state;
  }
}

export const Web3Context = createContext({
  state: INITIAL_STATE,
  updateAccount: () => {},
  updateNetId: () => {},
  updateContract: () => {},
});

export const Provider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  function updateAccount(data) {
    dispatch({
      type: UPDATE_ACCOUNT,
      ...data,
    });
  }

  function updateNetId(data) {
    dispatch({
      type: UPDATE_NET_ID,
      ...data,
    });
  }

  function updateContract(data) {
    dispatch({
      type: UPDATE_CONTRACT,
      ...data,
    });
  }

  return (
    <Web3Context.Provider
      value={useMemo(
        () => ({
          state,
          updateAccount,
          updateNetId,
          updateContract,
        }),
        [state]
      )}
    >
      {children}
    </Web3Context.Provider>
  );
};

export const Updater = () => {
  const { state, updateNetId, updateContract } = useContext(Web3Context);
  useEffect(() => {
    if (state.web3) {
      const unsubscribe = subscribeToAccount(state.web3, (error, account) => {
        if (error) {
          console.log(error);
        }
        if (account !== undefined && account !== state.account) {
          window.location.reload();
        }
      });
      return unsubscribe;
    }
  }, [state.web3, state.account]);

  useEffect(() => {
    if (state.web3) {
      const unsubscribe = subscribeToNetID(state.web3, (error, netId) => {
        if (error) {
          console.log(error);
        }
        if (netId) {
          if (state.netId === 0) {
            updateNetId({ netId });
          } else if (netId !== state.netId) {
            window.location.reload();
          }
        }
      });
      return unsubscribe;
    }
  }, [state.web3, state.netId, updateNetId]);

  useEffect(() => {
    if (state.web3) {
      const unsubscribe = subscribeToContract(state.web3, (error, contract) => {
        if (error) {
          console.log(error);
        }
        if (contract) {
          updateContract({ contract });
        }
      });
      return unsubscribe;
    }
  }, [state.web3, state.contract, updateContract]);

  return <></>;
};
