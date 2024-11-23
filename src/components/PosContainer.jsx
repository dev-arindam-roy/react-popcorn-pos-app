import React, { useEffect, useState } from "react";
import AppHeading from "./heading/AppHeading";
import AuthInfo from "./auth/AuthInfo";
import AuthSettings from "./auth/AuthSettings";
import AuthLogin from "./auth/AuthLogin";
import ProductItems from "./product-items/ProductItems";
import Bill from "./bill/Bill";
import GeneratePosBill from "./bill/GeneratePosBill";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";
//import ProductDataList from "../json-dbs/pizza-db.json";
//import ProductDataList from "../json-dbs/coffee-db.json";
//import ProductDataList from "../json-dbs/burger-db.json";
//import ProductDataList from "../json-dbs/icecream-db.json";
import ProductDataList from "../json-dbs/popcorn-db.json";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import "./Pos.css";

const lsKey = process.env.REACT_APP_LOCAL_STORAGE_KEY;

const authObj = {
  name: "",
  username: process.env.REACT_APP_AUTH_USERNAME,
  password: process.env.REACT_APP_AUTH_PASSWORD,
  restaruntInfo: {
    name: "",
    phno: "",
    email: "",
    address: "",
  },
  isAuth: false,
};

const billObj = {
  id: "",
  customer: {
    name: "",
    phno: "",
    email: "",
  },
  items: [],
  amount: 0,
  discount: 0,
  date: new Date().toLocaleDateString("en-GB"),
  time: moment().format("h:mm A"),
};

const billListObj = [];

const PosContainer = () => {
  const [authDetails, setAuthDetails] = useState(authObj);
  const [isSettingModalShow, setIsSettingModalShow] = useState(false);
  const [isCustomerModalShow, setIsCustomerModalShow] = useState(false);
  const [productList, setProductList] = useState([]);
  const [posBill, setPosBill] = useState(billObj);
  const [isShowCreateBillModal, setIsShowCreateBillModal] = useState(false);

  const [billList, setBillList] = useState(billListObj);

  /** AUTH */
  const emitOnProcessLoginHandler = (authParams) => {
    if (
      authParams?.username === process.env.REACT_APP_AUTH_USERNAME &&
      authParams?.password === process.env.REACT_APP_AUTH_PASSWORD
    ) {
      const _tempAuthParams = { ...authParams };
      _tempAuthParams.isAuth = true;
      setAuthDetails(_tempAuthParams);
      toast.dismiss();
      toast.success(`Hi, ${_tempAuthParams.username} - Welcome!`);
      localStorage.setItem(
        lsKey + "_auth_info_",
        JSON.stringify(_tempAuthParams)
      );
    } else {
      toast.error("Oops!! Username & Password combination is wrong");
    }
  };

  const emitOnLogoutHandler = () => {
    const _deepCopyAuthObj = JSON.parse(JSON.stringify(authObj));
    setAuthDetails(_deepCopyAuthObj);
    emitOnCancelBillHandler();
    localStorage.setItem(
      lsKey + "_auth_info_",
      JSON.stringify(_deepCopyAuthObj)
    );
    toast.dismiss();
    toast.success("You have successfully logged out!");
  };

  const checkAuth = () => {
    const storageAuthDetails =
      localStorage.getItem(lsKey + "_auth_info_") || null;
    if (storageAuthDetails) {
      setAuthDetails(JSON.parse(storageAuthDetails));
    } else {
      setAuthDetails(authObj);
    }
  };
  /** END AUTH */

  /** SETTINGS */
  const emitOnShowSettingsModalHandler = () => {
    setIsSettingModalShow(true);
  };

  const emitOnCloseSettingsModalHandler = () => {
    setIsSettingModalShow(false);
  };

  const emitOnsettingsSaveChangesHandler = (authSettingParams) => {
    const _tempAuthSettingParams = { ...authSettingParams };
    setAuthDetails(_tempAuthSettingParams);
    toast.dismiss();
    toast.success("Your settings has been saved successfully!");
    localStorage.setItem(
      lsKey + "_auth_info_",
      JSON.stringify(_tempAuthSettingParams)
    );
    emitOnCloseSettingsModalHandler();
  };
  /** END SETTINGS */

  /** BILL */
  const emitOnAddPosItemHandler = (productId) => {
    if (!productId) {
      toast.dismiss();
      toast.error("Oops! Something went wrong!");
      return;
    }

    const productIndex = productList.findIndex(
      (item) => item.id === parseInt(productId)
    );
    if (productIndex === -1) {
      toast.dismiss();
      toast.error("Oops! Something went wrong!");
      return;
    }

    const selectedProduct = productList[productIndex];
    const updatedPosBill = { ...posBill };

    // Initialize bill if it's empty
    if (updatedPosBill?.items?.length === 0) {
      updatedPosBill.id = uuidv4();
      updatedPosBill.date = moment().format("DD/MM/YYYY");
      updatedPosBill.time = moment().format("h:mm A");
      updatedPosBill.items = [];
    }

    // Check if the product already exists in the bill
    const billItemIndex = updatedPosBill.items.findIndex(
      (item) => item.id === parseInt(productId)
    );
    if (billItemIndex !== -1) {
      // Increment quantity
      updatedPosBill.items[billItemIndex].qty += 1;
    } else {
      // Add new item to the bill with quantity 1
      updatedPosBill.items.push({ ...selectedProduct, qty: 1 });
    }

    updatedPosBill.amount = calculateTotalBill(updatedPosBill.items);
    setPosBill(updatedPosBill);
    billSaveToLocalStorage(updatedPosBill);
    toast.dismiss();
    toast.success(`${selectedProduct?.name} - is added to billing`);
  };

  const emitOnBillItemRemoveHandler = (billProductItemId) => {
    if (!billProductItemId) {
      toast.dismiss();
      toast.error("Oops! Something went wrong!");
      return;
    }
    const _tempPosBill = { ...posBill };
    const billItemIndex = _tempPosBill?.items.findIndex(
      (item) => item.id === parseInt(billProductItemId)
    );
    if (billItemIndex === -1) {
    }
    Swal.fire({
      title: "Are you sure?",
      text: "You want to remove this item?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#0d6efd",
      cancelButtonColor: "#dc3545",
      confirmButtonText: "Yes",
      allowOutsideClick: false,
      allowEscapeKey: false,
    }).then((result) => {
      if (result.isConfirmed) {
        const deletingProduct = _tempPosBill?.items[billItemIndex];
        const updatedBillItems = _tempPosBill?.items.filter(
          (_, index) => index !== billItemIndex
        );
        _tempPosBill.items = updatedBillItems;
        _tempPosBill.amount = calculateTotalBill(updatedBillItems);
        setPosBill(_tempPosBill);
        billSaveToLocalStorage(_tempPosBill);
        Swal.fire({
          title: "Please wait...",
          html: "System is <strong>processing</strong> your request",
          timer: 2000,
          timerProgressBar: true,
          allowOutsideClick: false,
          allowEscapeKey: false,
          didOpen: () => {
            Swal.showLoading();
          },
        }).then(() => {
          Swal.close();
          toast.success(
            `${deletingProduct?.name} - has been removed from billing`
          );
        });
      }
    });
  };

  const emitOnCloseCustomerModalHandler = () => {
    setIsCustomerModalShow(false);
  };

  const emitOnShowCustomerModalHandler = () => {
    setIsCustomerModalShow(true);
  };

  const emitOnSaveBillCustomerInfoHandler = (billInfo) => {
    const _tempPosBill = { ...posBill };
    _tempPosBill.customer = billInfo.customer;
    setPosBill(_tempPosBill);
    setIsCustomerModalShow(false);
    billSaveToLocalStorage(_tempPosBill);
    toast.dismiss();
    toast.success("Customer information is added successfully");
  };

  const emitOnApplyDiscountHandler = (discountAmount) => {
    if (!discountAmount || discountAmount === "") {
      discountAmount = parseFloat(0).toFixed(2);
    }
    Swal.fire({
      title: "Are you sure?",
      text: `You want to apply the discount ${process.env.REACT_APP_AUTH_CURRENCY}${discountAmount} ?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#0d6efd",
      cancelButtonColor: "#dc3545",
      confirmButtonText: "Yes",
      allowOutsideClick: false,
      allowEscapeKey: false,
    }).then((result) => {
      if (result.isConfirmed) {
        const _tempPosBill = { ...posBill };
        const _billItems = _tempPosBill.items;
        if (parseFloat(calculateTotalBill(_billItems)) >= discountAmount) {
          _tempPosBill.discount = parseFloat(discountAmount).toFixed(2);
          _tempPosBill.amount = calculateTotalBill(_billItems, discountAmount);
          billSaveToLocalStorage(_tempPosBill);
          setPosBill(_tempPosBill);
          if (discountAmount > 0) {
            Swal.fire({
              icon: "success",
              title: "Done!",
              text: "Discount has been applied successfully!",
              showConfirmButton: true,
            });
          }
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops!",
            text: "Discount is grater than total bill amount!",
            showConfirmButton: true,
          });
        }
      }
    });
  };

  const emitOnCancelBillHandler = () => {
    Swal.fire({
      title: "Are you sure?",
      text: `You want to cancel the current bill ?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#0d6efd",
      cancelButtonColor: "#dc3545",
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      allowOutsideClick: false,
      allowEscapeKey: false,
    }).then((result) => {
      if (result.isConfirmed) {
        const _deepCopyBillObj = JSON.parse(JSON.stringify(billObj));
        setPosBill(_deepCopyBillObj);
        billSaveToLocalStorage(_deepCopyBillObj);
        Swal.fire({
          icon: "success",
          title: "Done!",
          text: "Bill has been cancelled successfully!",
          showConfirmButton: true,
        });
      }
    });
  };

  const emitOnUpdateBillItemQuantitesHandler = (
    itemQuantities,
    discount = 0
  ) => {
    if (!discount || discount === "" || discount === 0) {
      discount = parseFloat(0).toFixed(2);
    }
    Swal.fire({
      title: "Are you sure?",
      text: `You want to update the current bill ?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#0d6efd",
      cancelButtonColor: "#dc3545",
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      allowOutsideClick: false,
      allowEscapeKey: false,
    }).then((result) => {
      if (result.isConfirmed) {
        const _tempPosBill = { ...posBill };
        const _tempPosBillItems = _tempPosBill?.items;
        _tempPosBillItems.forEach((item, index) => {
          _tempPosBillItems[index] = {
            ...item,
            qty:
              itemQuantities[index]?.qty && !isNaN(itemQuantities[index]?.qty)
                ? itemQuantities[index]?.qty
                : 1,
          };
        });
        _tempPosBill.items = _tempPosBillItems;
        _tempPosBill.discount = parseFloat(discount).toFixed(2);
        if (parseFloat(calculateTotalBill(_tempPosBill.items)) >= _tempPosBill.discount) {
          _tempPosBill.amount = calculateTotalBill(
            _tempPosBill.items,
            discount
          );
          setPosBill(_tempPosBill);
          billSaveToLocalStorage(_tempPosBill);
          Swal.fire({
            icon: "success",
            title: "Done!",
            text: "Bill has been updated successfully!",
            showConfirmButton: true,
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops!",
            text: "Discount is grater than total bill amount!",
            showConfirmButton: true,
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.reload();
            }
          });
        }
      }
    });
  };
  /** END BILL */

  /** CREATE BILL */
  const emitOnCreateBillHandler = () => {
    setIsShowCreateBillModal(true);
  };

  const emitOnCloseCreateateBillModalHandler = () => {
    setIsShowCreateBillModal(false);
  };

  const emitOnPaymentReceivedOrderCloseHandler = (finalBill) => {
    toast.dismiss();
    if (finalBill) {
      Swal.fire({
        title: "Are you sure?",
        text: "You have received the payment & close the order?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#0d6efd",
        cancelButtonColor: "#dc3545",
        confirmButtonText: "Yes",
        allowOutsideClick: false,
        allowEscapeKey: false,
      }).then((result) => {
        if (result.isConfirmed) {
          const _tempBillList = [...billList];
          const newBill = {
            id: uuidv4(),
            date: moment().format("DD/MM/YYYY"),
            time: moment().format("h:mm A"),
            items: finalBill?.items,
            amount: finalBill?.amount,
            discount: finalBill?.discount,
            customer: finalBill?.customer,
          };
          _tempBillList.push(newBill);
          setBillList(_tempBillList);
          billListSaveToLocalStorage(_tempBillList);
          const _deepCopyBillObj = JSON.parse(JSON.stringify(billObj));
          setPosBill(_deepCopyBillObj);
          billSaveToLocalStorage(_deepCopyBillObj);
          emitOnCloseCreateateBillModalHandler();
          Swal.fire({
            title: "Please wait...",
            html: "System is <strong>processing</strong> your request",
            timer: 2000,
            timerProgressBar: true,
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: () => {
              Swal.showLoading();
            },
          }).then(() => {
            Swal.close();
            Swal.fire({
              icon: "success",
              title: "Done!",
              text: "Order has been successfully closed",
              showConfirmButton: true,
            });
          });
        }
      });
    } else {
      toast.error("Oops!! Something went wrong!");
    }
  };
  /** END CREATE BILL */

  /** FUNCTIONS */
  const calculateTotalBill = (orderItems, discountAmount = 0) => {
    if (isNaN(discountAmount)) {
      discountAmount = 0;
    }
    let total = 0;
    if (Array.isArray(orderItems) && orderItems.length > 0) {
      orderItems.forEach((item) => {
        total += parseFloat(item.price) * parseFloat(item.qty);
      });
    }
    return (total.toFixed(2) - parseFloat(discountAmount).toFixed(2)).toFixed(
      2
    );
  };

  const loadPosBillFromLocalStorage = () => {
    const storageBillDetails =
      localStorage.getItem(lsKey + "_bill_info_") || null;
    if (storageBillDetails) {
      setPosBill(JSON.parse(storageBillDetails));
    } else {
      setPosBill(billObj);
    }
  };

  const billSaveToLocalStorage = (posBillInfo) => {
    localStorage.setItem(lsKey + "_bill_info_", JSON.stringify(posBillInfo));
  };

  const billListSaveToLocalStorage = (billList) => {
    localStorage.setItem(lsKey + "_bill_list_", JSON.stringify(billList));
  };
  /** END FUNCTIONS */

  /** LOADS */
  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    setProductList(ProductDataList);
  }, [ProductDataList]);

  useEffect(() => {
    loadPosBillFromLocalStorage();
  }, []);
  /** END LOADS */

  return (
    <>
      <Container fluid className="mt-3">
        <Row>
          <Col xs={12} sm={12} md={6}>
            <AppHeading />
          </Col>
          <Col xs={12} sm={12} md={6}>
            <Row>
              <Col xs={12} sm={12} md={10}>
                <AuthInfo sendAuthInfo={authDetails} />
              </Col>
              <Col xs={12} sm={12} md={2}>
                <AuthSettings
                  sendAuthInfo={authDetails}
                  sendIsSettingModalShow={isSettingModalShow}
                  onShowSettingsModal={emitOnShowSettingsModalHandler}
                  onCloseSettingsModal={emitOnCloseSettingsModalHandler}
                  onsettingsSaveChanges={emitOnsettingsSaveChangesHandler}
                  onLogout={emitOnLogoutHandler}
                />
              </Col>
            </Row>
          </Col>
        </Row>
        <Row className="mt-5">
          <Col xs={12} sm={12} md={7}>
            <ProductItems
              sendProductList={productList}
              onAddPosItem={emitOnAddPosItemHandler}
            />
          </Col>
          <Col xs={12} sm={12} md={5}>
            <Bill
              sendPosBill={posBill}
              onBillItemRemove={emitOnBillItemRemoveHandler}
              sendIsCustomerModalShow={isCustomerModalShow}
              onCloseCustomerModal={emitOnCloseCustomerModalHandler}
              onShowCustomerModal={emitOnShowCustomerModalHandler}
              onSaveBillCustomerInfo={emitOnSaveBillCustomerInfoHandler}
              onApplyDiscount={emitOnApplyDiscountHandler}
              onCancelBill={emitOnCancelBillHandler}
              onUpdateBillItemQuantites={emitOnUpdateBillItemQuantitesHandler}
              onCreateBill={emitOnCreateBillHandler}
            />
          </Col>
        </Row>
        <Row className="mt-5 mb-3">
          <Col>
            <p className="text-end dev-footer">
              Developed & Managed By: Arindam Roy | 9836395513
            </p>
          </Col>
        </Row>
      </Container>
      <AuthLogin
        sendAuthInfo={authDetails}
        onProcessLogin={emitOnProcessLoginHandler}
      />
      <GeneratePosBill
        sendAuthDetails={authDetails}
        sendIsShowCreateBillModal={isShowCreateBillModal}
        sendPosBill={posBill}
        onCloseCreateateBillModal={emitOnCloseCreateateBillModalHandler}
        onPaymentReceivedOrderClose={emitOnPaymentReceivedOrderCloseHandler}
      />
    </>
  );
};

export default PosContainer;
