import React, { useState } from "react";
import { Form, Container, Jumbotron, Button, Row } from "react-bootstrap";
import Blockies from "react-blockies";

import Document from "../abis/Document.json";
import Web3 from "web3";

const web3 = new Web3(window.ethereum || "localhost:8545");
export default function Home({ account, ipfs }) {
  const [buffer, setBuffer] = useState("");
  const [fileName, setFileName] = useState("Upload File Here");
  const [ipfsHash, setIpfsHash] = useState("");
  const [contract, setContract] = useState(null);

  async function loadContract() {
    const netId = parseInt(window.ethereum.chainId);
    const netData = Document.networks[netId];
    if (netData) {
      const abi = Document.abi;
      const address = netData.address;
      const c = new web3.eth.Contract(abi, address);
      setContract(c);
    }
  }

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
    console.log(path);
    loadContract();
    if (contract) {
      await contract.methods
        .addDocument(path)
        .send({ from: account })
        .then((r) => {
          setIpfsHash(path);
        });

      console.log(await contract.methods.getDocument().call());
    }
    console.log(ipfsHash);
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
