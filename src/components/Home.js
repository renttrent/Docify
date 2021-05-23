import React, { useState } from "react";
import { Form, Container, Jumbotron, Button, Row } from "react-bootstrap";
import Blockies from "react-blockies";

export default function Home({ account, network, ipfs }) {
  const [buffer, setBuffer] = useState("");
  const [fileName, setFileName] = useState("Upload File Here");

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
    console.log(file);
    // for await (var file of ipfs.add(buffer)) {
    //   // const fileHash = file[0]["hash"];
    //   console.log(file);
    //   console.log(file.cid.string);
    // }
  };

  return (
    <Container style={{ marginTop: "1.5em" }}>
      <Jumbotron style={{ backgroundColor: "#003580", color: "#F2F6FA" }}>
        <Container>
          <Row className=" align-items-center">
            <h3 style={{ marginRight: "10px" }}>Account:</h3>
            <Blockies seed={account} />
            <h5 style={{ marginLeft: "10px", color: "#FEBA02" }}>{account}</h5>
          </Row>
          <Row>
            <h3>
              Network: <span style={{ color: "#FEBA02" }}>{network} </span>
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
  );
}
