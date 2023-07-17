import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

import { db } from "./Config";

const Signup = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const auth = getAuth();

  const handleSignup = (e) => {
    e.preventDefault();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        const userDocRef = doc(db, "userCredential", user.uid);
        const userDoc = {
          fullName,
          email,
        };

        setDoc(userDocRef, userDoc)
          .then(() => {
            console.log("User data saved to Firestore");
          })
          .catch((error) => {
            console.log("Error saving user data:", error);
          });

        console.log(userCredential);
        setSuccessMsg("Signup Successful. Redirecting to Login...");
        setFullName("");
        setEmail("");
        setPassword("");
        setErrorMsg("");
        setTimeout(() => {
          setSuccessMsg("");
          navigate("/Login"); // Navigate to the login page after successful signup
        }, 3000);
      })
      .catch((error) => {
        setErrorMsg(error.message);
      });
  };

  return (
    <div className="container-s">
      <div className="box-s">
        <div className="form">
          <br />
          <br />
          <h1>Sign Up</h1>
          <hr />
          {successMsg && (
            <>
              <div className="success-msg">{successMsg}</div>
              <br />
            </>
          )}
          <form
            className="form-group"
            autoComplete="off"
            onSubmit={handleSignup}
          >
            <label>Full Name:</label>
            <input
              type="text"
              className="form-control"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            <br />
            <label>Email:</label>
            <input
              type="email"
              className="form-control"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <br />
            <label>Password:</label>
            <input
              type="password"
              className="form-control"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <br />
            <div className="btn-box">
              <span>
                Already have an account? Login{" "}
                <Link to="/Login" className="link">
                  Here
                </Link>
              </span>
              <button type="submit" className="btn btn-success btn-md">
                SIGN UP
              </button>
            </div>
          </form>
          {errorMsg && (
            <>
              <br />
              <div className="error-msg">{errorMsg}</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Signup;
