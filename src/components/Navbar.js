import React from "react";
import { Nav, Navbar, Button, Form, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";

import Logo from "./svg/Logo";

export default function NavbarComponent({
  account,
  connectMetamask,
  m_pending,
  m_error,
}) {
  function ButtonComponent() {
    if (account) {
      return (
        <Button variant="outline-success" onClick={connectMetamask}>
          Change account
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
          <Nav.Link as={Link} to="/about">
            About
          </Nav.Link>
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
