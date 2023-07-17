import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "./Config";
import { Link } from "react-router-dom";

const MyOrder = () => {
  const [user] = useAuthState(auth);
  const [orders, setOrders] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [cancelOrderDetails, setCancelOrderDetails] = useState({
    orderId: "",
    itemId: "",
  });

  useEffect(() => {
    const fetchOrders = async () => {
      if (user) {
        try {
          const ordersQuery = query(
            collection(db, "payments"),
            where("userId", "==", user.uid)
          );
          const snapshot = await getDocs(ordersQuery);
          const ordersData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setOrders(ordersData);
        } catch (error) {
          console.log("Error fetching orders:", error);
        }
      }
    };

    fetchOrders();
  }, [user]);

  const handleCancelOrder = async () => {
    try {
      const { orderId, itemId } = cancelOrderDetails;

      // Remove the entire document related to the canceled order item
      await deleteDoc(doc(db, "payments", orderId));

      setOrders((prevOrders) => {
        // Filter out the canceled order from the list
        const updatedOrders = prevOrders.filter(
          (order) => order.id !== orderId
        );
        return updatedOrders;
      });

      console.log("Order canceled successfully.");
    } catch (error) {
      console.log("Error canceling order:", error);
    }

    // Reset the cancel order details and hide the confirmation dialog
    setCancelOrderDetails({ orderId: "", itemId: "" });
    setShowConfirmation(false);
  };

  const showCancelConfirmation = (orderId, itemId) => {
    // Display the confirmation dialog
    setCancelOrderDetails({ orderId, itemId });
    setShowConfirmation(true);
  };

  return (
    <div>
      <div className="navbar-p">
        <div className="navbar-container-p">
          <div className="navbar-logo-p">
            <Link to="/">
              <a className="header-envato_market-p" href="#">
                SuperSonic
              </a>
            </Link>
          </div>
          <div className="navbar-actions-p"></div>
        </div>
      </div>
      <div className="my-order-container">
        <h1 className="my-order-heading">My Orders</h1>

        {orders.map((order) => (
          <div key={order.id} className="order-details">
            <h3>Order ID: {order.id}</h3>
            <p>Total Amount: &#x20B9;{order.totalAmount}</p>
            <ul className="item-list">
              {order.items.map((item) => (
                <li key={item.id} className="item">
                  <div className="item-info">
                    <h4>{item.title}</h4>
                    <p>Price: &#x20B9;{item.price}</p>
                    <p>Estimated Delivery: {getRandomDeliveryTime()}</p>
                    <button
                      className="cancel-order-button"
                      onClick={() => showCancelConfirmation(order.id, item.id)}
                    >
                      Cancel
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {showConfirmation && (
          <div className="confirmation-modal">
            <div className="confirmation-modal-content">
              <h2>Are you sure you want to cancel the order?</h2>
              <p>This action cannot be undone.</p>
              <div className="confirmation-buttons">
                <button className="confirm-button" onClick={handleCancelOrder}>
                  Yes
                </button>
                <button
                  className="cancel-button"
                  onClick={() => setShowConfirmation(false)}
                >
                  No
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper function to generate random delivery time
const getRandomDeliveryTime = () => {
  const minDays = 3;
  const maxDays = 15;
  const deliveryDays =
    Math.floor(Math.random() * (maxDays - minDays + 1)) + minDays;
  return `Estimated delivery in ${deliveryDays} days`;
};

export default MyOrder;
