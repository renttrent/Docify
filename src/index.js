import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

import {
  Provider as Web3Provider,
  Updater as Web3Updater,
} from "./contexts/Web3";

ReactDOM.render(
  <React.StrictMode>
    <Web3Provider>
      <App />
      <Web3Updater />
    </Web3Provider>
  </React.StrictMode>,
  document.getElementById("app")
);
serviceWorker.unregister();
