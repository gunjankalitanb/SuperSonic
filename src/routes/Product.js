import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  serverTimestamp,
  onSnapshot,
  query,
} from "firebase/firestore";

import { auth, db } from "./Config";
import { FaShoppingCart } from "react-icons/fa";
import { FaBars } from "react-icons/fa";

function CartItems({ cartItems }) {
  const totalPrice = cartItems.reduce((total, item) => total + item.price, 0);
}

function Product() {
  const [user] = useAuthState(auth);
  const [fullName, setFullName] = useState("");
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [showCart, setShowCart] = useState(false);
  // const [showDropdown, setShowDropdown] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDocRef = doc(db, "userCredential", user.uid);
        const userDocSnapshot = await getDoc(userDocRef);
        if (userDocSnapshot.exists()) {
          setFullName(userDocSnapshot.data().fullName);
        }
      } catch (error) {
        console.log("Error fetching user data:", error);
      }
    };

    const fetchProducts = async () => {
      try {
        const productsCollection = collection(db, "Products");
        const productsSnapshot = await getDocs(productsCollection);
        const productsData = productsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(productsData);
      } catch (error) {
        console.log("Error fetching products:", error);
      }
    };

    const fetchCartItems = () => {
      if (user) {
        const cartItemsQuery = query(collection(db, "cart", user.uid, "items"));
        const unsubscribe = onSnapshot(cartItemsQuery, (snapshot) => {
          const items = snapshot.docs.map((doc) => doc.data());
          setCartItems(items);
          setCartItemCount(items.length);
        });
        return unsubscribe;
      }
    };

    if (user) {
      fetchUserData();
      const unsubscribe = fetchCartItems();
      return () => {
        unsubscribe();
      };
    }

    fetchProducts();
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

  const handleAddToCart = async (product) => {
    if (user) {
      try {
        const cartRef = collection(db, "cart", user.uid, "items");

        const cartItem = {
          productId: product.id,
          title: product.title,
          price: product.price,
          imageUrl: product.url,
          timestamp: serverTimestamp(),
        };

        await addDoc(cartRef, cartItem);
        console.log("Item added to cart successfully.");
        setCartItemCount(cartItemCount + 1); // Increment the count by 1
      } catch (error) {
        console.log("Error adding item to cart:", error);
      }
    } else {
      console.log("User is not logged in.");
    }
  };

  const handleCartIconClick = () => {
    setShowCart(!showCart);
  };
  // const handleDropdownClick = () => {
  //   setShowDropdown(!showDropdown);
  // };

  const handleSidebarToggle = () => {
    setShowSidebar(!showSidebar);
  };

  return (
    <div>
      <div className="navbar-p">
        <div className="navbar-container-p">
          <div className="navbar-logo-p">
            <Link to="/">
              {" "}
              <a className="header-envato_market-p" href="#">
                SuperSonic
              </a>
            </Link>
          </div>
          <div className="navbar-actions-p">
            {user && (
              <div className="cart-icon-container">
                <Link
                  to="/cart"
                  className="cart-icon"
                  onClick={handleCartIconClick}
                >
                  <FaShoppingCart />
                  <span className="cartCount">{cartItemCount}</span>
                </Link>
                {showCart && <CartItems cartItems={cartItems} />}
              </div>
            )}
            <div className="dropdown-container">
              <FaBars className="dropdown-icon" onClick={handleSidebarToggle} />
              {showSidebar && (
                <div className="dropdown-content">
                  <Link to="/order" className="dropdown-link">
                    My Orders
                  </Link>
                </div>
              )}
            </div>

            {user ? (
              <>
                <button className="logout-button" onClick={handleLogout}>
                  Logout
                </button>
                <span
                  style={{
                    fontStyle: "italic",
                    position: "relative",
                    right: "50%",
                    fontFamily: "Poppins",
                    fontSize: "14px",
                    color: "white",
                  }}
                >
                  Welcome, {fullName}
                </span>
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

      <div className="product-container">
        <ul className="product-list">
          {products.map((product) => (
            <li key={product.id} className="product-item">
              <img
                src={product.url}
                alt={product.title}
                className="product-image"
              />
              <h3 className="product-name">{product.title}</h3>
              <p className="product-price">&#x20B9;{product.price}</p>
              <button
                className="add-to-cart"
                onClick={() => handleAddToCart(product)}
              >
                Add to Cart
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Product;
