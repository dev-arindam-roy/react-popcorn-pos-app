import React, { useEffect, useState } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { FiLogIn } from "react-icons/fi";

const AuthLogin = ({ sendAuthInfo, onProcessLogin }) => {
  const [authInfo, setAuthInfo] = useState(null);
  const signInButtonHandler = () => {
    document.getElementById("signInFormHiddenSubmitBtn").click();
  };
  const signinFormHandler = (e) => {
    e.preventDefault();
    onProcessLogin(authInfo);
  };
  useEffect(() => {
    if (sendAuthInfo) {
      setAuthInfo(sendAuthInfo);
    } else {
      setAuthInfo(sendAuthInfo);
    }
  }, [sendAuthInfo]);
  return (
    <>
      <Modal
        backdrop="static"
        keyboard={false}
        show={!authInfo?.isAuth}
        dialogClassName="blur-backdrop"
        centered
        scrollable
      >
        <Modal.Header>
          <Modal.Title>
            <FiLogIn style={{ marginTop: "-2px" }} /> Sign-In
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={signinFormHandler}>
            <Row>
              <Col>
                <Form.Group className="mb-3" controlId="authName">
                  <label className="form-control-lb">Name:</label>
                  <Form.Control
                    type="text"
                    placeholder="Your Name"
                    maxLength={20}
                    required
                    value={authInfo?.name || ""}
                    onChange={(e) =>
                      setAuthInfo({ ...authInfo, name: e.target.value })
                    }
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="authRestaurantName">
                  <label className="form-control-lb">Restaurant Name:</label>
                  <Form.Control
                    type="text"
                    placeholder="Restaurant Name"
                    maxLength={30}
                    required
                    value={authInfo?.restaruntInfo?.name || ""}
                    onChange={(e) =>
                      setAuthInfo({
                        ...authInfo,
                        restaruntInfo: {
                          ...authInfo?.restaruntInfo,
                          name: e.target.value,
                        },
                      })
                    }
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="authUsername">
                  <label className="form-control-lb">Username:</label>
                  <Form.Control
                    type="text"
                    placeholder="Username"
                    maxLength={10}
                    required
                    value={authInfo?.username || ""}
                    onChange={(e) =>
                      setAuthInfo({ ...authInfo, username: e.target.value })
                    }
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="authPassword">
                  <label className="form-control-lb">Password:</label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    maxLength={16}
                    required
                    value={authInfo?.password || ""}
                    onChange={(e) =>
                      setAuthInfo({ ...authInfo, password: e.target.value })
                    }
                  />
                </Form.Group>
              </Col>
            </Row>
            <Button
              type="submit"
              id="signInFormHiddenSubmitBtn"
              variant="secondary"
              className="d-none"
            >
              Submit
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={signInButtonHandler}>
            <FiLogIn style={{ marginTop: "-2px" }} /> Let's Login
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AuthLogin;
