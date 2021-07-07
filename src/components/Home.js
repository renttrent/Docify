import React, { useState, useEffect, useContext, useMemo } from "react";
import {
  Form,
  Container,
  Jumbotron,
  Button,
  Row,
  Modal,
  Spinner,
} from "react-bootstrap";
import UserContext from "../contexts/UserContext";
import multihashes from "multihashes";

import Blockies from "react-blockies";

import Docify from "../abis/Docify.json";
import base58 from "bs58";
import { Link } from "react-router-dom";
import GenerateLink from "./GenerateLink";

export default function Home({ ipfs, m_error }) {
  const [buffer, setBuffer] = useState("");
  const [fileName, setFileName] = useState("Upload File Here");
  const [ipfsHash, setIpfsHash] = useState("");

  const userContext = useContext(UserContext);
  const { web3, accounts, netId, contract } = userContext;
  const [account, setAccount] = useState("");
  const [txErr, setTxErr] = useState(null);
  const [show, setShow] = useState(false);

  const [ipfsLoading, setIpfsLoading] = useState(false);
  // const [currentProvider, setCurrentProvider] = useState(null);

  useEffect(() => {
    const updateAccounts = async () => {
      const accounts = await web3.eth.getAccounts();
      setAccount(accounts[0]);
    };

    if (window.ethereum.isConnected()) updateAccounts();
  }, [accounts, web3]);

  const handleClose = () => {
    setShow(false);
    setTxErr(null);
  };

  const handleShow = () => setShow(true);

  useEffect(() => {}, [ipfsLoading]);

  useEffect(() => {
    if (m_error) {
      handleShow();
    }
  }, [m_error]);

  const getNetwork = () => {
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
  };

  const accountToDisplay = () => {
    if (accounts !== undefined && accounts.length !== 0) {
      return (
        account.substr(0, 5) +
        "..." +
        account.substr(account.length - 3, account.length)
      );
    } else {
      return "";
    }
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
    setIpfsLoading(true);

    const file = await ipfs.add(buffer, (error, res) => {
      console.error(error);
      console.info(res);
    });

    const { path } = file;
    console.log("ipfs: " + path);

    console.log("contract: " + contract);

    if (contract) {
      // let mh = multihashes.fromB58String(Buffer.from(path));

      // let hf = new DataView(mh.slice(0, 2).buffer, 0);
      // const hashFunction = hf.getInt8(0, true);
      // // console.log(web3.utils.hexToNumber(hashFunction));
      // const digest = web3.utils.soliditySha3({
      //   t: "bytes32",
      //   v: "0x" + Buffer.from(mh.slice(2)).toString("hex"),
      // });
      // const size = mh.length - 2;
      // console.log(hashFunction, digest, size);
      contract.methods
        .issue(path)
        .send({ from: account, gas: 1000000 })
        .then((r) => {
          setIpfsHash(path);
        })
        .catch((e) => {
          console.log(e);
          setTxErr(txErr);
          handleShow();
        });
    }

    setIpfsLoading(false);
  };

  function CustomModal() {
    console.log(txErr);
    return (
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Metamask Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Error Message: {m_error ? m_error : " "}
          {txErr ? txErr : " "}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

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
            {ipfsLoading ? (
              <>
                {"Submitting "}
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
              </>
            ) : (
              "Submit"
            )}
          </Button>
        </Form>
        {/* <Link to={"/sign/jhsdfgyy34isdhfu3"}> Lila </Link> */}
      </Container>
      {/* {show ? <CustomModal /> : <span></span>} */}
    </>
  );
}
