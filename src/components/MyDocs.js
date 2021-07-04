import React, { useState, useContext } from "react";
import { Container, Card, Button } from "react-bootstrap";
import UserContext from '../contexts/UserContext';

export const MyDocs = ({ ipfs }) => {
  const [docs, setDocs] = useState([
    {
      ipfs: "QmSm7MHikFSaTa2qAKNd1hQVXpwPpWdgyFJ65yh6mcTr8u",
      type: "jpg",
      name: "bitcoin.jpg",
    },
  ]);

  const userContext = useContext(UserContext);
  const {web3, contract, netId, accounts} = userContext;

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
              <pre>Contract: Docify - <b>0x7E4ADA83B20c776d6d1f10dE592A738268F16A91</b></pre>
              <Button variant="info" href="https://ropsten.etherscan.io/address/0x7e4ada83b20c776d6d1f10de592a738268f16a91">Contract On Etherescan</Button>
            </Card.Body>
            <Button variant="primary">View on IPFS</Button>
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
