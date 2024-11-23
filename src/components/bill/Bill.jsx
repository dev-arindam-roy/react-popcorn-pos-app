import React, { useEffect, useState } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { FiTrash2, FiSave, FiCheck, FiFileText } from "react-icons/fi";
import { FaUserPlus } from "react-icons/fa6";
import { toWords } from "number-to-words";
import { formatNumberWord } from "../../helpers/Helpers";

const Bill = ({
  sendPosBill,
  onBillItemRemove,
  sendIsCustomerModalShow,
  onCloseCustomerModal,
  onShowCustomerModal,
  onSaveBillCustomerInfo,
  onApplyDiscount,
  onCancelBill,
  onCreateBill,
  onUpdateBillItemQuantites,
}) => {
  const [currentBill, setCurrentBill] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalItemAmount, setTotalItemAmount] = useState(0);
  const [isModalShow, setIsModalShow] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [itemsQtyList, setItemsQtyList] = useState([""]);

  const submitTriggerButtonHandler = () => {
    document.getElementById("formHiddenSubmitBtn").click();
  };

  const signinFormHandler = (e) => {
    e.preventDefault();
    onSaveBillCustomerInfo(currentBill);
  };

  const applyDiscountHandler = () => {
    onApplyDiscount(discount);
  };

  const itemQuantityUpdateHandler = (e, index) => {
    const newQty = parseFloat(e.target.value) || 1;
    setItemsQtyList((prevItems) => {
      const updatedItems = [...prevItems];
      updatedItems[index] = { ...updatedItems[index], qty: newQty };
      return updatedItems;
    });
  };

  const billItemQuatitySetHandler = () => {
    onUpdateBillItemQuantites(itemsQtyList, discount);
  };

  const calculateTotalItemAmount = (billItems) => {
    let total = 0;
    if (billItems && Array.isArray(billItems) && billItems.length > 0) {
      billItems.forEach((item) => {
        total += parseFloat(item.price) * parseFloat(item.qty);
      });
    }
    return total.toFixed(2);
  };

  const calculateTotalAmount = (billItems, discountAmount = 0) => {
    let total = 0;
    if (billItems && Array.isArray(billItems) && billItems.length > 0) {
      billItems.forEach((item) => {
        total += parseFloat(item.price) * parseFloat(item.qty);
      });
    }
    return (total - parseFloat(discountAmount)).toFixed(2);
  };

  useEffect(() => {
    if (sendPosBill) {
      setCurrentBill(sendPosBill);
      const _totalAmount = calculateTotalAmount(
        sendPosBill?.items,
        sendPosBill?.discount
      );
      const _totalItemAmount = calculateTotalItemAmount(sendPosBill?.items);
      setTotalItemAmount(_totalItemAmount);
      setTotalAmount(_totalAmount);
      setDiscount(sendPosBill?.discount);
      setItemsQtyList(sendPosBill?.items);
    }
  }, [sendPosBill]);

  useEffect(() => {
    setIsModalShow(sendIsCustomerModalShow);
  }, [sendIsCustomerModalShow]);

  return (
    <>
      <Card>
        <Card.Header>
          <Row>
            <Col md={6} className="bill-heading">
              Bill - {process.env.REACT_APP_AUTH_CURRENCY}
              {currentBill === null ? 0 : Math.round(currentBill?.amount)}
            </Col>
            <Col md={6} className="text-end">
              <FaUserPlus
                className={`add-bill-user ${
                  currentBill?.customer?.name ? " bill-user-active" : ""
                }`}
                onClick={onShowCustomerModal}
              />
            </Col>
          </Row>
        </Card.Header>
        <Card.Body style={{ fontFamily: "monospace" }}>
          <table className="table table-xs table-bordered">
            <thead>
              <tr>
                <th>SL.</th>
                <th style={{ minWidth: "150px" }}>Item</th>
                <th>Price</th>
                <th>QTY</th>
                <th>Total</th>
                <th className="text-end">#</th>
              </tr>
            </thead>
            <tbody>
              {currentBill &&
              currentBill?.items &&
              currentBill.items.length > 0 ? (
                currentBill.items.map((item, index) => {
                  return (
                    <tr key={"pos-bill-item-" + index}>
                      <td>{index + 1}</td>
                      <td>{item?.name}</td>
                      <td>{parseFloat(item?.price).toFixed(2)}</td>
                      <td>
                        <input
                          type="number"
                          className="tbl-txtb-qty"
                          value={itemsQtyList[index]?.qty || 1}
                          onChange={(e) => itemQuantityUpdateHandler(e, index)}
                        />
                      </td>
                      <td>
                        {(
                          parseFloat(item?.price) * parseFloat(item.qty)
                        ).toFixed(2)}
                      </td>
                      <td className="text-end">
                        <FiTrash2
                          className="text-danger remove-icon"
                          onClick={() => onBillItemRemove(item?.id)}
                        />
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6}>Please add billing items</td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr>
                <th colSpan={4}>Total Amount</th>
                <th colSpan={2}>{parseFloat(totalItemAmount).toFixed(2)}</th>
              </tr>
              <tr>
                <th colSpan={4}>Discount</th>
                <th colSpan={2}>
                  <input
                    type="number"
                    className="tbl-txtb-discount"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={applyDiscountHandler}
                    className={`apply-discount-btn ${
                      currentBill?.discount > 0 ? " active-green" : ""
                    }`}
                  >
                    <FiCheck />
                  </button>
                </th>
              </tr>
              <tr>
                <th colSpan={4}>Payable Amount</th>
                <th colSpan={2}>{Math.round(totalAmount)}</th>
              </tr>
              <tr>
                <th colSpan={6}>
                  In Words: {formatNumberWord(toWords(Math.round(totalAmount)))}
                </th>
              </tr>
            </tfoot>
          </table>
          {currentBill &&
            currentBill?.items &&
            currentBill.items.length > 0 && (
              <Row>
                <Col className="text-start">
                  <Button variant="primary" onClick={billItemQuatitySetHandler}>
                    <FiSave style={{ marginTop: "-2px" }} /> Save Bill
                  </Button>
                  <Button
                    variant="danger"
                    style={{ marginLeft: "6px" }}
                    onClick={onCancelBill}
                  >
                    <FiTrash2 style={{ marginTop: "-2px" }} /> Cancel Bill
                  </Button>
                </Col>
                <Col className="text-end">
                  <Button
                    variant="success"
                    onClick={onCreateBill}
                    disabled={
                      !currentBill?.customer?.name ||
                      currentBill?.items.length === 0
                    }
                  >
                    <FiFileText style={{ marginTop: "-2px" }} /> Create Bill
                  </Button>
                </Col>
              </Row>
            )}
        </Card.Body>
        <Card.Footer>
          <Row>
            <Col className="footer-bill-info-item text-start">
              Items:{" "}
              {currentBill && currentBill?.items
                ? currentBill?.items.length
                : 0}
            </Col>
            <Col className="footer-bill-info-date text-end">
              Date:{" "}
              {currentBill && currentBill?.date
                ? currentBill?.date
                : new Date().toLocaleDateString("en-GB")}
              {currentBill && currentBill?.time ? " " + currentBill?.time : " "}
            </Col>
          </Row>
        </Card.Footer>
      </Card>
      <Modal
        backdrop="static"
        keyboard={false}
        show={isModalShow}
        onHide={onCloseCustomerModal}
        centered
        scrollable
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <FaUserPlus style={{ marginTop: "-3px" }} /> Customer Information
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={signinFormHandler}>
            <Row>
              <Col>
                <Form.Group className="mb-3" controlId="customerName">
                  <label className="form-control-lb">Name:</label>
                  <Form.Control
                    type="text"
                    placeholder="Customer Name"
                    maxLength={20}
                    required
                    value={currentBill?.customer?.name || ""}
                    onChange={(e) =>
                      setCurrentBill({
                        ...currentBill,
                        customer: {
                          ...currentBill?.customer,
                          name: e.target.value,
                        },
                      })
                    }
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="customerPhno">
                  <label className="form-control-lb">Phone Number:</label>
                  <Form.Control
                    type="number"
                    placeholder="Phone NUmber"
                    maxLength={10}
                    required
                    value={currentBill?.customer?.phno || ""}
                    onChange={(e) =>
                      setCurrentBill({
                        ...currentBill,
                        customer: {
                          ...currentBill?.customer,
                          phno: e.target.value,
                        },
                      })
                    }
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="customerEmail">
                  <label className="form-control-lb">Email-Id:</label>
                  <Form.Control
                    type="email"
                    placeholder="Email"
                    maxLength={30}
                    value={currentBill?.customer?.email || ""}
                    onChange={(e) =>
                      setCurrentBill({
                        ...currentBill,
                        customer: {
                          ...currentBill?.customer,
                          email: e.target.value,
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
            <FiSave style={{ marginTop: "-2px" }} /> Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Bill;
