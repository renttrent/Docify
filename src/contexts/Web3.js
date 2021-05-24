import React, {
  useReducer,
  createContext,
  useContext,
  useEffect,
  useMemo,
} from "react";
import Web3 from "web3";
import { subscribeToAccount, subscribeToNetID } from "../api/web3";

const INITIAL_STATE = {
  type: "",
  account: "",
  netId: 0,
  web3: null,
};

const UPDATE_ACCOUNT = "UPDATE_ACCOUNT";
const UPDATE_NET_ID = "UPDATE_NET_ID";

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
    default:
      return state;
  }
}

const Web3Context = createContext({
  state: INITIAL_STATE,
  updateAccount: () => {},
  updateNetId: () => {},
});

export function useWeb3Context() {
  return useContext(Web3Context);
}

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

  return (
    <Web3Context.Provider
      value={useMemo(
        () => ({
          state,
          updateAccount,
          updateNetId,
        }),
        [state]
      )}
    >
      {children}
    </Web3Context.Provider>
  );
};

export function Updater() {
  const { state, updateNetId } = useWeb3Context();
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
      const unsubscribe = subscribeToAccount(state.web3, (error, netId) => {
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

  return null;
}
