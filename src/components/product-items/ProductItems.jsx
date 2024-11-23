import React, { useEffect, useState } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";

const ProductItems = ({ sendProductList, onAddPosItem }) => {
  const [products, setProducts] = useState([]);
  const [copyProducts, setCopyProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = products.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (searchTerm !== "") {
      setProducts(filteredProducts);
    } else {
      const _copyProducts = [...copyProducts];
      setProducts(_copyProducts);
    }
  }, [searchTerm]);
  useEffect(() => {
    if (sendProductList) {
      setProducts(sendProductList);
      setCopyProducts(sendProductList);
    } else {
      setProducts([]);
      setCopyProducts([]);
    }
  }, [sendProductList]);
  return (
    <>
      <Card>
        <Card.Header>
          <Row>
            <Col md={6} className="product-list-heading">
              POS Items - ({copyProducts.length})
            </Col>
            <Col md={6}>
              <input
                type="text"
                className="form-control"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Col>
          </Row>
        </Card.Header>
        <Card.Body>
          <Row>
            {products.length > 0 ? (
              products.map((item, index) => {
                return (
                  <Col
                    key={`pos-item-${item?.id}-${index}`}
                    xs={12}
                    sm={6}
                    md={3}
                    className="mb-3 text-center"
                  >
                    <div
                      className="item-box"
                      onClick={() => onAddPosItem(item?.id)}
                    >
                      <div className="item-image">
                        <img
                          src={require(`../../item-images/${item?.image}`)}
                          alt={item?.name}
                        />
                      </div>
                      <div className="item-name">{item?.name}</div>
                      <div className="item-price">
                        {process.env.REACT_APP_AUTH_CURRENCY || "Rs."}
                        {parseFloat(item?.price).toFixed(2)}
                      </div>
                    </div>
                  </Col>
                );
              })
            ) : (
              <Col>
                <p>Sorry! No Products Available</p>
              </Col>
            )}
          </Row>
        </Card.Body>
        <Card.Footer></Card.Footer>
      </Card>
    </>
  );
};

export default ProductItems;
