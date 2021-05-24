import React from "react";
import { Alert } from "react-bootstrap";
export function MetamaskError() {
  return (
    <Alert
      variant="danger"
      style={{
        margin: "auto",
        width: "calc(100vw - 10%)",
        height: "40vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        marginTop: "10%",
      }}
    >
      <Alert.Heading style={{ marginTop: "4em" }}>
        {" "}
        Metamask is not installed{" "}
      </Alert.Heading>
      <p>This application requires the Metamask extension.</p>
      <p>
        If you are in chrome you can download it{" "}
        <Alert.Link
          target="_blank"
          href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en"
        >
          here.
        </Alert.Link>
      </p>
      <p>
        Or check their{" "}
        <Alert.Link target="_blank" href="https://metamask.io/">
          website
        </Alert.Link>{" "}
        for more information.
      </p>
    </Alert>
  );
}
