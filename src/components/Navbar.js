import React, { useEffect } from "react";
import { Nav, Navbar, Button, Form, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import UserContext from "../contexts/UserContext";
import Logo from "./svg/Logo";

export default function NavbarComponent() {
  const userContext = React.useContext(UserContext);
  const { web3, contract, netId, accounts } = userContext;
  const [account, setAccount] = React.useState("");
  const [m_pending, setM_pending] = React.useState(false);

  useEffect(() => {
    const updateAccounts = async () => {
      const accounts = await web3.eth.getAccounts();
      setAccount(accounts[0]);
    };
    if (window.ethereum.isConnected()) updateAccounts();
  }, [accounts, web3]);

  const connectMetamask = async () => {
    if (window.ethereum.isConnected()) {
    } else {
      await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      if (accounts) {
        setAccount(accounts[0]);
      }
    }
  };

  function ButtonComponent() {
    if (account) {
      return (
        <Button variant="outline-success" disabled>
          Connected
        </Button>
      );
    } else {
      return (
        <Button variant="success" onClick={connectMetamask}>
          Connect to wallet
          {m_pending === true && <span> </span>}
          {m_pending === true && (
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
            />
          )}
        </Button>
      );
    }
  }

  return (
    <Navbar
      expand="lg"
      sticky="top"
      variant="dark"
      style={{ backgroundColor: "#003580", color: "#F2F6FA" }}
    >
      <Navbar.Brand as={Link} to="/">
        <Logo />
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link as={Link} to="/docs">
            My Documents
          </Nav.Link>
        </Nav>
        <Form inline>
          <ButtonComponent />
        </Form>
      </Navbar.Collapse>
    </Navbar>
  );
}
