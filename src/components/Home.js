import React, { useState, useEffect } from "react";
import { Form, Container, Jumbotron, Button, Row } from "react-bootstrap";
import Blockies from "react-blockies";

import Document from "../abis/Document.json";

export default function Home({ web3, account, ipfs }) {
  const [buffer, setBuffer] = useState("");
  const [fileName, setFileName] = useState("Upload File Here");
  const [ipfsHash, setIpfsHash] = useState("");
  const [contract, setContract] = useState(null);

  useEffect(() => {
    const netData = Document.networks[parseInt(window.ethereum.chainId)];

    if (netData) {
      const c = new web3.eth.Contract(Document.abi, netData.address);
      setContract(c);
    }
  }, []);

  function getNetwork() {
    const netId = parseInt(window.ethereum.chainId);
    switch (netId) {
      case 1:
        return "Mainnet";
      case 2:
        return "Morden test network";
      case 3:
        return "Ropsten network";
      case 4:
        return "Rinkeby test network";
      case 42:
        return "Kovan test network";
      default:
        return "Private network";
    }
  }

  const accountToDisplay = () => {
    return (
      account.substr(0, 5) +
      "..." +
      account.substr(account.length - 3, account.length)
    );
  };

  const readFile = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      console.log(Buffer(reader.result));
      setBuffer(Buffer(reader.result));
    };

    setFileName(file.name);
  };

  const uploadIPFS = async (e) => {
    e.preventDefault();

    const file = await ipfs.add(buffer, (error, res) => {
      console.error(error);
      console.info(res);
    });

    const { path } = file;
    console.log("ipfs: " + path);

    console.log("contract: " + contract);

    if (contract) {
      contract.methods
        .addDocument(path)
        .send({ from: account })
        .then((r) => {
          setIpfsHash(path);
        });

      contract.methods
        .getDocument()
        .call()
        .then((r) => {
          console.log("get: " + r);
        });
    }
  };

  return (
    <>
      <Container style={{ marginTop: "1.5em" }}>
        <Jumbotron style={{ backgroundColor: "#003580", color: "#F2F6FA" }}>
          <Container>
            <Row className=" align-items-center">
              <h3 style={{ marginRight: "10px" }}>Account:</h3>
              <Blockies seed={account} />
              <h5 style={{ marginLeft: "10px", color: "#FEBA02" }}>
                {accountToDisplay()}
              </h5>
            </Row>
            <Row>
              <h3>
                Network:{" "}
                <span style={{ color: "#FEBA02" }}>{getNetwork()} </span>
              </h3>
            </Row>
          </Container>
        </Jumbotron>
        <Form>
          <Form.Group>
            <Form.File
              id="custom-file"
              label={fileName}
              custom
              onChange={readFile}
            />
          </Form.Group>
          <Button variant="primary" type="button" onClick={uploadIPFS}>
            Submit
          </Button>
        </Form>
      </Container>
    </>
  );
}
