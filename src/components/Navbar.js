import React from "react";
import { NavDropdown, Nav, Navbar, Button, Form } from "react-bootstrap";
import { Route, Link } from "react-router-dom";

import Logo from "./svg/Logo";

export default function NavbarComponent() {
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
          {/* <FormControl type="text" placeholder="Search" className="mr-sm-2" /> */}
          <Button
            variant="success"
            onClick={function () {
              console.log("click");
            }}
          >
            Connect to wallet
          </Button>
        </Form>
      </Navbar.Collapse>
    </Navbar>
  );
}
