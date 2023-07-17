import React, { useEffect, useState } from "react";
import { collection, query, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../Config";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsCollection = collection(db, "Products");
        const querySnapshot = await getDocs(productsCollection);
        const productsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleRemoveProduct = async (productId) => {
    try {
      await deleteDoc(doc(db, "Products", productId));
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== productId)
      );
    } catch (error) {
      console.error("Error removing product:", error);
    }
  };

  return (
    <div className="container">
      <h1 style={styles.heading}>Admin Products</h1>
      {products.length > 0 ? (
        <ul className="product-list" style={styles.productList}>
          {products.map((product) => (
            <li
              key={product.id}
              className="product-item"
              style={styles.productItem}
            >
              <img
                src={product.url}
                alt={product.title}
                style={styles.productImage}
              />
              <h3 className="product-name" style={styles.productName}>
                {product.title}
              </h3>
              <p
                className="product-description"
                style={styles.productDescription}
              >
                {product.description}
              </p>
              <p className="product-price" style={styles.productPrice}>
                &#x20B9; {product.price}
              </p>
              <button
                className="remove-product-button"
                style={styles.removeProductButton}
                onClick={() => handleRemoveProduct(product.id)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p style={styles.noProductsMessage}>No products uploaded yet.</p>
      )}
    </div>
  );
};

export default AdminProducts;

const styles = {
  heading: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  productList: {
    listStyle: "none",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gridGap: "20px",
  },
  productItem: {
    backgroundColor: "#f2f2f2",
    borderRadius: "8px",
    padding: "20px",
    textAlign: "center",
    boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
    position: "relative",

    width: "200px",
    height: "500px",
    margin: "10px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "10px",
  },
  productImage: {
    width: "20%",
    height: "100px",
    marginTop: "30px",

    borderRadius: "4px",
    objectFit: "cover",
  },
  productName: {
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  productDescription: {
    marginBottom: "10px",
  },
  productPrice: {
    fontSize: "16px",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  removeProductButton: {
    backgroundColor: "#ff4d4f",
    color: "white",
    border: "none",
    borderRadius: "4px",
    padding: "8px 16px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold",
    transition: "background-color 0.3s ease",
    width: "100%",
  },
  noProductsMessage: {
    textAlign: "center",
    marginTop: "40px",
    fontSize: "16px",
    fontStyle: "italic",
    color: "#888",
  },
};
