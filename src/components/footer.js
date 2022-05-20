import { Container, Row, Col } from "react-bootstrap";

export default function Footer() {
  return (
    // <footer style={{ backgroundColor: "#f5f5f5" }}>
    <footer className="bg-dark">
      <Container fluid>
        <Row className="text-center mt-4">
          <Col md="4">
            <ul
              style={{
                display: "block",
                margin: "0",
                padding: "0",
                listStyle: "none",
              }}
            >
              <li className="list-unstyled fw-bold text-primary text-opacity-75">
                COMPANY
              </li>
              <li className="list-unstyled">
                <a href="#!" className="text-decoration-none text-muted">
                  Leadership
                </a>
              </li>
              <li className="list-unstyled">
                <a href="#!" className="text-decoration-none text-muted">
                  History
                </a>
              </li>
              <li className="list-unstyled">
                <a href="#!" className="text-decoration-none text-muted">
                  Careers
                </a>
              </li>
            </ul>
          </Col>
          <Col md="4">
            <ul
              style={{
                display: "block",
                margin: "0",
                padding: "0",
                listStyle: "none",
              }}
            >
              <li className="list-unstyled fw-bold text-primary text-opacity-75">
                RESOURCES
              </li>
              <li className="list-unstyled">
                <a href="#!" className="text-decoration-none text-muted">
                  FAQs
                </a>
              </li>
              <li className="list-unstyled">
                <a href="#!" className="text-decoration-none text-muted">
                  Solutions
                </a>
              </li>
              <li className="list-unstyled">
                <a href="#!" className="text-decoration-none text-muted">
                  Press Room
                </a>
              </li>
            </ul>
          </Col>
          <Col md="4">
            <ul
              style={{
                display: "block",
                margin: "0",
                padding: "0",
                listStyle: "none",
              }}
            >
              <li className="list-unstyled fw-bold text-primary text-opacity-75">
                SUPPORT
              </li>
              <li className="list-unstyled">
                <a href="#!" className="text-decoration-none text-muted">
                  Customer Service
                </a>
              </li>
              <li className="list-unstyled">
                <a href="#!" className="text-decoration-none text-muted">
                  Support Request
                </a>
              </li>
              <li className="list-unstyled">
                <a
                  href="#!"
                  className="text-decoration-none text-muted disabled"
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </Col>
        </Row>
      </Container>
      <hr />

      <Container fluid className="pb-4">
        <Row className="text-center justify-content-center text-muted fw-light">
          <Col md={8}>
            <a href="#!" className="text-decoration-none text-muted">
              Security
            </a>{" "}
            |{" "}
            <a href="#!" className="text-decoration-none text-muted">
              Terms and Conditions
            </a>{" "}
            |{" "}
            <a href="#!" className="text-decoration-none text-muted">
              Privacy Policy
            </a>
          </Col>
          <Col md={8}>
            &copy; {new Date().getFullYear()} Copyright: BadBank, LLC. All
            rights reserved. All trademarks are the property of their respective
            owners.
          </Col>
        </Row>
      </Container>
    </footer>
  );
}
