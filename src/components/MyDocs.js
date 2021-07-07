import React, { useState, useContext } from "react";
import { Container, Card, Button } from "react-bootstrap";
import UserContext from "../contexts/UserContext";

export const MyDocs = ({ ipfs }) => {
  const [docs, setDocs] = useState([
    {
      ipfs: "Qmc6peXvHGKS3FLKU3V2DZKA5uGYUo7S1XZDFa3A9zggYf",
      type: "jpg",
      name: "bitcoin.jpg",
      contractaddr: "0xE357B628dEaECa46727Cd32c984Eb5294FA5E070",
    },
  ]);

  const userContext = useContext(UserContext);
  const { web3, contract, netId, accounts } = userContext;

  function IpfsCards() {
    const returnCards = [];

    docs.map((object, idx) => {
      returnCards.push(
        <Card>
          <Card.Body>
            {console.log(object)}
            <Card.Title>{object.name}</Card.Title>
            <Card.Body>
              Ipfs Hash: {object.ipfs} <br />
              File Type: {object.type} <br />
              <pre>
                Contract: Docify - <b> {object.contractaddr} </b>
              </pre>
              <Button
                variant="info"
                href={
                  "https://ropsten.etherscan.io/address/" + object.contractaddr
                }
              >
                Contract On Etherescan
              </Button>
            </Card.Body>
            <Button
              variant="primary"
              href={"https://ipfs.io/ipfs/" + object.ipfs}
            >
              View on IPFS
            </Button>
          </Card.Body>
        </Card>
      );
    });
    return returnCards;
  }

  return (
    <Container>
      <div className="mydocs" style={{ marginTop: "2em" }}>
        {IpfsCards()}
      </div>
    </Container>
  );
};
