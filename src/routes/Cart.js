import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
} from "firebase/firestore";

import { auth, db } from "./Config";
import { FaShoppingCart } from "react-icons/fa";

const Cart = () => {
  const [user] = useAuthState(auth);
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    const fetchCartItems = async () => {
      if (user) {
        try {
          const cartItemsQuery = collection(db, "cart", user.uid, "items");
          const snapshot = await getDocs(cartItemsQuery);
          const items = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          setCartItems(items);
          updateTotalAmount(items);
        } catch (error) {
          console.log("Error fetching cart items:", error);
        }
      } else {
        setCartItems([]);
        setTotalAmount(0);
      }
    };

    fetchCartItems();
  }, [user]);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        console.log("Logout successful.");
      })
      .catch((error) => {
        console.log("Logout error:", error);
      });
  };

  const handleRemoveItem = async (itemId) => {
    if (user) {
      try {
        const cartItemRef = doc(db, "cart", user.uid, "items", itemId);
        await deleteDoc(cartItemRef);
        console.log("Item removed from cart successfully.");

        setCartItems((prevCartItems) =>
          prevCartItems.filter((item) => item.id !== itemId)
        );
        updateTotalAmount(cartItems);
      } catch (error) {
        console.log("Error removing item from cart:", error);
      }
    }
  };

  const updateTotalAmount = (items) => {
    const amount = items.reduce((total, item) => total + item.price, 0);
    setTotalAmount(amount);
  };

  const handlePayment = async () => {
    setLoading(true);

    try {
      if (user) {
        const paymentData = {
          userId: user.uid,
          items: cartItems,
          totalAmount: totalAmount,
          timestamp: new Date().toISOString(),
        };

        // Save payment data to Firebase
        const paymentRef = collection(db, "payments");
        await addDoc(paymentRef, paymentData);

        setLoading(false);
        setShowPaymentModal(false);
        setShowSuccessModal(true); // Show payment success dialogue

        // Remove purchased items from cart
        for (const item of cartItems) {
          const cartItemRef = doc(db, "cart", user.uid, "items", item.id);
          await deleteDoc(cartItemRef);
        }

        console.log("Items removed from cart successfully.");

        setCartItems([]);
        setTotalAmount(0);
      }
    } catch (error) {
      console.log("Error saving payment data:", error);
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="navbar-c">
        <div className="navbar-container-c">
          <div className="navbar-logo-c">
            <Link to="/">
              <div className="header-envato_market-c">SuperSonic</div>
            </Link>
          </div>
          <div className="navbar-actions-c">
            {user && (
              <div className="cart-icon-container">
                <Link to="/Cart" className="cart-icon">
                  <FaShoppingCart />
                  <span className="cartCount">{cartItems.length}</span>
                </Link>
              </div>
            )}
            {user ? (
              <>
                <button className="logout-button" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/Login"
                  className="header-buy-now e-btn--3d -color-primary"
                >
                  Login
                </Link>
                <Link
                  to="/Signup"
                  className="header-buy-now e-btn--3d -color-primary"
                >
                  Signup
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="my-cart-container">
        <h1>
          <Link to="/Product">Products</Link>/Cart
        </h1>
        {cartItems.length === 0 ? (
          <p>No items in the cart.</p>
        ) : (
          <>
            {cartItems.map((item) => (
              <div key={item.id} className="cart-card">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="cart-item-image"
                />
                <div>
                  <p>{item.title}</p>
                  <p>Price: &#x20B9;{item.price}</p>
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="delete-btn"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            <div className="total-amount">
              <p>Total Amount: &#x20B9;{totalAmount}</p>
              <button
                className="buy-button"
                onClick={() => setShowPaymentModal(true)}
              >
                Buy
              </button>
            </div>
          </>
        )}
      </div>
      {showPaymentModal && (
        <div className="payment-modal">
          <div className="payment-modal-content">
            <h2> Payment Gateway</h2>
            <p>Product: {cartItems.map((item) => item.title).join(", ")}</p>
            <p>Total Amount: &#x20B9;{totalAmount}</p>
            <button
              className="confirm-button"
              onClick={handlePayment}
              disabled={loading}
            >
              {loading ? "Processing..." : "Confirm Payment"}
            </button>
          </div>
        </div>
      )}
      {showSuccessModal && (
        <div className="success-modal">
          <div className="success-modal-content">
            <h2>Payment Successful</h2>
            <p>You will receive your order in 3-10 days.</p>
            <button
              className="ok-button"
              onClick={() => setShowSuccessModal(false)}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
