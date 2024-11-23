import React, { useEffect, useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import * as htmlToImage from "html-to-image";
import download from "downloadjs";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { toWords } from "number-to-words";
import { formatNumberWord } from "../../helpers/Helpers";
import { FiFileText, FiArrowRight, FiArchive, FiCamera } from "react-icons/fi";

const GeneratePosBill = ({
  sendIsShowCreateBillModal,
  onCloseCreateateBillModal,
  sendPosBill,
  sendAuthDetails,
  onPaymentReceivedOrderClose,
}) => {
  const [isTheModalShow, setIsTheModalShow] = useState(false);
  const [getAuthInfo, setGetAuthInfo] = useState(null);
  const [finalBill, setFinalBill] = useState(null);
  const [totalItemAmount, setTotalItemAmount] = useState(0);
  const printRef = useRef();
  const printHandler = useReactToPrint({
    content: () => printRef.current,
  });
  const screenShotHandler = () => {
    htmlToImage
      .toPng(document.getElementById("printArea"))
      .then(function (dataUrl) {
        download(
          dataUrl,
          new Date().toISOString().replace(/[:.]/g, "-") + ".png"
        );
      });
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
  useEffect(() => {
    setIsTheModalShow(sendIsShowCreateBillModal);
  }, [sendIsShowCreateBillModal]);
  useEffect(() => {
    if (sendPosBill) {
      setFinalBill(sendPosBill);
      const _totalItemAmount = calculateTotalItemAmount(sendPosBill?.items);
      setTotalItemAmount(_totalItemAmount);
    } else {
      setFinalBill(null);
      setTotalItemAmount(0);
    }
  }, [sendPosBill]);
  useEffect(() => {
    if (sendAuthDetails) {
      setGetAuthInfo(sendAuthDetails);
    } else {
      setGetAuthInfo(null);
    }
  }, [sendAuthDetails]);
  return (
    <>
      <Modal
        backdrop="static"
        keyboard={false}
        size="lg"
        show={isTheModalShow}
        onHide={onCloseCreateateBillModal}
        centered
        scrollable
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <FiFileText style={{ marginTop: "-4px" }} /> Payable Bill -{" "}
            <span className="createbill-header-amount">
              {process.env.REACT_APP_AUTH_CURRENCY}
              {Math.round(parseFloat(finalBill?.amount).toFixed(2))}
            </span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body ref={printRef} id="printArea">
          <Card>
            <Card.Header style={{ paddingTop: "10px" }}>
              <Row>
                <Col
                  md={7}
                  style={{ width: "65%", float: "left", textAlign: "left" }}
                >
                  <div className="createbill-header-restaurant-name">
                    {getAuthInfo &&
                      getAuthInfo?.restaruntInfo?.name &&
                      getAuthInfo?.restaruntInfo?.name}
                  </div>
                  {(getAuthInfo?.restaruntInfo?.phno ||
                    getAuthInfo?.restaruntInfo?.email) && (
                    <div className="createbill-header-restaurant-box">
                      {getAuthInfo?.restaruntInfo?.email && (
                        <div className="createbill-header-restaurant-email">
                          <span>Email-Id:</span>{" "}
                          {getAuthInfo?.restaruntInfo?.email}
                        </div>
                      )}
                      {getAuthInfo?.restaruntInfo?.phno && (
                        <div className="createbill-header-restaurant-phno">
                          <span>Phone No:</span>{" "}
                          {getAuthInfo?.restaruntInfo?.phno}
                        </div>
                      )}
                      <div style={{ clear: "both" }}></div>
                      {getAuthInfo?.restaruntInfo?.address && (
                        <div className="createbill-header-restaurant-address">
                          <span>Address:</span>{" "}
                          {getAuthInfo?.restaruntInfo?.address}
                        </div>
                      )}
                    </div>
                  )}
                </Col>
                <Col
                  md={5}
                  style={{ width: "35%", float: "right", textAlign: "right" }}
                >
                  <div className="bill-customer-name">
                    {finalBill &&
                      finalBill?.customer?.name &&
                      finalBill?.customer?.name}
                  </div>
                  {(finalBill?.customer?.phno ||
                    finalBill?.customer?.email) && (
                    <div className="createbill-header-customer-box">
                      {finalBill?.customer?.phno && (
                        <div className="createbill-header-customer-phno">
                          {finalBill?.customer?.phno}
                        </div>
                      )}
                      {finalBill?.customer?.email && (
                        <div className="createbill-header-customer-email">
                          {finalBill?.customer?.email}
                        </div>
                      )}
                    </div>
                  )}
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
                  </tr>
                </thead>
                <tbody>
                  {finalBill &&
                  finalBill?.items &&
                  finalBill.items.length > 0 ? (
                    finalBill.items.map((item, index) => {
                      return (
                        <tr key={"pos-bill-item-" + index}>
                          <td>{index + 1}</td>
                          <td>{item?.name}</td>
                          <td>{parseFloat(item?.price).toFixed(2)}</td>
                          <td>{parseFloat(item?.qty).toFixed(2)}</td>
                          <td>
                            {(
                              parseFloat(item?.price) * parseFloat(item.qty)
                            ).toFixed(2)}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={5}>No Bill Items Found!</td>
                    </tr>
                  )}
                </tbody>
                <tfoot>
                  <tr>
                    <th colSpan={4}>Total Amount</th>
                    <th>
                      {process.env.REACT_APP_AUTH_CURRENCY}
                      {parseFloat(totalItemAmount).toFixed(2)}
                    </th>
                  </tr>
                  <tr>
                    <th colSpan={4}>Discount</th>
                    <th>
                      {process.env.REACT_APP_AUTH_CURRENCY}
                      {parseFloat(finalBill?.discount).toFixed(2)}
                    </th>
                  </tr>
                  <tr>
                    <th colSpan={4}>Payable Amount</th>
                    <th>
                      {process.env.REACT_APP_AUTH_CURRENCY}
                      {Math.round(parseFloat(finalBill?.amount).toFixed(2))}
                    </th>
                  </tr>
                  <tr>
                    <th colSpan={6}>
                      In Words:
                      {finalBill?.amount && !isNaN(parseFloat(finalBill.amount))
                        ? formatNumberWord(
                            toWords(
                              Math.round(
                                parseFloat(finalBill.amount).toFixed(2)
                              )
                            )
                          )
                        : "Invalid amount"}
                    </th>
                  </tr>
                </tfoot>
              </table>
            </Card.Body>
            <Card.Footer style={{ paddingBottom: "20px" }}>
              <Row>
                <Col
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#ccc",
                  }}
                >
                  {new Date()
                    .toLocaleString("en-GB", {
                      dateStyle: "short",
                      timeStyle: "short",
                      hour12: true,
                    })
                    .replace(",", "")
                    .toLocaleUpperCase()}
                </Col>
                <Col
                  className="text-end"
                  style={{
                    fontSize: "14px",
                    fontWeight: "400",
                    color: "#ccc",
                    fontStyle: "oblique",
                  }}
                >
                  Thanks! Have a Nice Day. We are glad to serve you.
                </Col>
              </Row>
            </Card.Footer>
          </Card>
        </Modal.Body>
        <Modal.Footer>
          <div className="container-fluid">
            <div className="row">
              <div className="col text-start" style={{ paddingLeft: "0px" }}>
                <Button type="button" variant="primary" onClick={printHandler}>
                  <FiArchive style={{ marginTop: "-2px" }} /> Take Print
                </Button>
                <Button
                  type="button"
                  variant="warning"
                  style={{ marginLeft: "6px" }}
                  onClick={screenShotHandler}
                >
                  <FiCamera style={{ marginTop: "-2px" }} /> Take Screenshot
                </Button>
              </div>
              <div className="col text-end" style={{ paddingRight: "0px" }}>
                <Button
                  type="button"
                  variant="success"
                  onClick={() => onPaymentReceivedOrderClose(finalBill)}
                >
                  <FiArrowRight style={{ marginTop: "-2px" }} /> Payment
                  Received & Order Close
                </Button>
              </div>
            </div>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default GeneratePosBill;
