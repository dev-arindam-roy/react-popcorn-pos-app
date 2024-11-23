import React, { useEffect, useState } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { FiSettings, FiLogOut, FiMenu, FiSave } from "react-icons/fi";

const AuthSettings = ({
  sendAuthInfo,
  onShowSettingsModal,
  onCloseSettingsModal,
  sendIsSettingModalShow,
  onsettingsSaveChanges,
  onLogout,
}) => {
  const [authInfo, setAuthInfo] = useState(null);
  const [isModalShow, setIsModalShow] = useState(false);
  const submitTriggerButtonHandler = () => {
    document.getElementById("formHiddenSubmitBtn").click();
  };
  const signinFormHandler = (e) => {
    e.preventDefault();
    onsettingsSaveChanges(authInfo);
  };
  useEffect(() => {
    if (sendAuthInfo) {
      setAuthInfo(sendAuthInfo);
    } else {
      setAuthInfo(null);
    }
  }, [sendAuthInfo]);
  useEffect(() => {
    setIsModalShow(sendIsSettingModalShow);
  }, [sendIsSettingModalShow]);
  return (
    <>
      <div className="auth-settings">
        <DropdownButton id="dropdown-basic-button" title={<FiMenu />}>
          <Dropdown.Item href="#/settings" onClick={onShowSettingsModal}>
            <FiSettings /> Settings
          </Dropdown.Item>
          <Dropdown.Item href="#/logout" onClick={onLogout}>
            <FiLogOut /> Logout
          </Dropdown.Item>
        </DropdownButton>
      </div>
      <Modal
        backdrop="static"
        keyboard={false}
        show={isModalShow}
        onHide={onCloseSettingsModal}
        centered
        scrollable
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <FiSettings style={{ marginTop: "-2px" }} /> Settings
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
                <Form.Group className="mb-3" controlId="restaurantPhoneNumber">
                  <label className="form-control-lb">
                    Restaurant Phone Number:
                  </label>
                  <Form.Control
                    type="number"
                    placeholder="Restaurant Phone Number"
                    value={authInfo?.restaruntInfo?.phno || ""}
                    onChange={(e) =>
                      setAuthInfo({
                        ...authInfo,
                        restaruntInfo: {
                          ...authInfo.restaruntInfo,
                          phno: e.target.value,
                        },
                      })
                    }
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="restaurantEmailId">
                  <label className="form-control-lb">
                    Restaurant Email-Id:
                  </label>
                  <Form.Control
                    type="email"
                    placeholder="Restaurant Email-Id"
                    value={authInfo?.restaruntInfo?.email || ""}
                    onChange={(e) =>
                      setAuthInfo({
                        ...authInfo,
                        restaruntInfo: {
                          ...authInfo.restaruntInfo,
                          email: e.target.value,
                        },
                      })
                    }
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="restaurantAddress">
                  <label className="form-control-lb">Restaurant Address:</label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Restaurant Address"
                    value={authInfo?.restaruntInfo?.address || ""}
                    onChange={(e) =>
                      setAuthInfo({
                        ...authInfo,
                        restaruntInfo: {
                          ...authInfo.restaruntInfo,
                          address: e.target.value,
                        },
                      })
                    }
                  />
                </Form.Group>
              </Col>
            </Row>
            <Button
              type="submit"
              id="formHiddenSubmitBtn"
              variant="secondary"
              className="d-none"
            >
              Submit
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={submitTriggerButtonHandler}>
            <FiSave style={{ marginTop: "-2px" }} /> Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AuthSettings;
