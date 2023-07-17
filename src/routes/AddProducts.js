import React, { useEffect, useState } from "react";
import { storage } from "./Config";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db, auth } from "./Config";

const AddProducts = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);

  const [imageError, setImageError] = useState("");
  const [uploading, setUploading] = useState(false);

  const [successMsg, setSuccessMsg] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [products, setProducts] = useState([]);

  const types = ["image/jpg", "image/jpeg", "image/png", "image/PNG"];

  const handleProductImg = (e) => {
    let selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile && types.includes(selectedFile.type)) {
        setImage(selectedFile);
        setImageError("");
      } else {
        setImage(null);
        setImageError("Please select a valid image file type (png or jpg)");
      }
    } else {
      console.log("Please select your file");
    }
  };

  const handleAddProducts = async (e) => {
    e.preventDefault();
    const storageRef = ref(storage, `product-images/${image.name}`);
    try {
      setUploading(true);
      const snapshot = await uploadBytes(storageRef, image);
      const downloadURL = await getDownloadURL(snapshot.ref);
      const userId = auth.currentUser ? auth.currentUser.uid : null;
      if (userId) {
        await addDoc(collection(db, "Products"), {
          title,
          description,
          price: Number(price),
          url: downloadURL,
          userId,
        });
        setSuccessMsg("Product added successfully");
        setTitle("");
        setDescription("");
        setPrice("");
        document.getElementById("file").value = "";
        setImageError("");
        setUploadError("");
        setTimeout(() => {
          setSuccessMsg("");
        }, 3000);
        fetchProducts(); // Fetch products after adding a new one
      } else {
        console.log("User is not logged in.");
      }
    } catch (error) {
      setUploadError(error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveProduct = async (productId) => {
    try {
      await deleteDoc(doc(db, "Products", productId));
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== productId)
      );
      setSuccessMsg("Product removed successfully");
      setTimeout(() => {
        setSuccessMsg("");
      }, 3000);
    } catch (error) {
      console.error("Error removing product:", error);
    }
  };

  const fetchProducts = async () => {
    if (auth.currentUser) {
      const q = query(
        collection(db, "Products"),
        where("userId", "==", auth.currentUser.uid)
      );
      const querySnapshot = await getDocs(q);
      const productsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productsData);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [auth.currentUser]); // Run the effect whenever the user authentication state changes

  return (
    <div className="container">
      <br />
      <br />
      <h1>Add Products</h1>
      <hr />
      {successMsg && <div className="success-msg">{successMsg}</div>}
      <form
        autoComplete="off"
        className="form-group"
        onSubmit={handleAddProducts}
      >
        <label>Product Title</label>
        <input
          type="text"
          className="form-control"
          required
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        />
        <br />
        <label>Product Description</label>
        <input
          type="text"
          className="form-control"
          required
          onChange={(e) => setDescription(e.target.value)}
          value={description}
        />
        <br />
        <label>Product Price</label>
        <input
          type="number"
          className="form-control"
          required
          onChange={(e) => setPrice(e.target.value)}
          value={price}
        />
        <br />
        <label>Upload Product Image</label>
        <input
          type="file"
          id="file"
          className="form-control"
          required
          onChange={handleProductImg}
        />

        {imageError && <div className="error-msg">{imageError}</div>}
        <br />
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            type="submit"
            className="btn btn-success btn-md"
            disabled={uploading}
          >
            {uploading ? (
              <>
                Uploading...
                <div className="loader"></div>
              </>
            ) : (
              "SUBMIT"
            )}
          </button>
        </div>
      </form>

      {uploadError && <div className="error-msg">{uploadError}</div>}

      <h2>Your Products</h2>
      {products.length > 0 ? (
        <div className="product-list">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <img src={product.url} alt={product.title} />
              <h3>{product.title}</h3>
              <p>{product.description}</p>
              <p>Price: &#x20B9;{product.price}</p>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => handleRemoveProduct(product.id)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>No products uploaded yet.</p>
      )}
    </div>
  );
};

export default AddProducts;
