import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "./Config";

// Function to fetch products uploaded by a specific user
export const getProductsByUser = async (userId) => {
  try {
    const q = query(collection(db, "Products"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    const productsData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return productsData;
  } catch (error) {
    console.error("Error fetching products by user:", error);
    return [];
  }
};

// Function to remove a product by its ID
export const removeProduct = async (productId) => {
  try {
    await deleteDoc(doc(db, "Products", productId));
    console.log("Product removed successfully");
  } catch (error) {
    console.error("Error removing product:", error);
  }
};
