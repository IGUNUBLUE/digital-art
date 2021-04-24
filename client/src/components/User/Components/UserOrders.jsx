/*eslint-disable*/
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "../../../scss/components/_userOrder.scss";

export default function UserOrders() {
  const userOrders = useSelector((store) => store.reducerOrderUser.userOrders);
  const [active, setActive] = useState(null);

  const handleActive = (e, index) => {
    e.preventDefault();
    if (active === index) {
      setActive(null);
    } else {
      setActive(index);
    }
  };

  let createdAt;
  let createdDate;
  let createdTime;
  const setDate = (order) => {
    createdAt = new Date(order.date);
    createdDate = createdAt.toLocaleDateString("en-US");
    createdTime = createdAt.toLocaleTimeString("en-US");
    return ( <h4>{createdDate} at {createdTime}</h4>)
  };
  return (
    <div className="profile-body">
      <div className="title">
        <h1>Orders</h1>
        <h2>Check your previous purchases </h2>
      </div>
      <hr className="divisor" />
      <div className="tableheader">
        <h4>Date</h4>
        <h4>State</h4>
        <h4>Price</h4>
      </div>
<div className="results">


      {userOrders.length !== 0 &&
        userOrders.map((order, index) => (
          <>
            <div
              className="orderPreview"
              onClick={(e) => handleActive(e, index)}
            >
              <div className="option">
                  {setDate(order)}
              </div>
              <div className="option">
                <h4 className="orderID1"> {order.state}</h4>
              </div>
              <div className="option">
                <h4 className="orderID1">${order.total}</h4>
              </div>
            </div>
            <div className="orderDescription">
              {active === index &&
                order.products.length !== 0 &&
                order.products.map((n) => (
                  <div className="description">
                    <div className="productinfo">
                      <h4 className="pr1">Description: {n.name}</h4>
                      <Link className="link" to={`/product/${n.id}`}>
                      <img src={n.preview} alt={n.name} width="50" />
                      </Link>
                      <h4 className="pr1">${n.price}</h4>
                    </div>
                  </div>
                ))}
              <hr />
            </div>
          </>
        ))}
        </div>
    </div>
  );
}