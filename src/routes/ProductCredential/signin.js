import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getAuth,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

const AdminLogin = () => {
  const [isForgotPasswordClicked, setIsForgotPasswordClicked] = useState(false);
  const [isPasswordResetEmailSent, setIsPasswordResetEmailSent] =
    useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    // Cleanup state on component mount
    return () => {
      setEmail("");
      setPassword("");
      setErrorMsg("");
      setSuccessMsg("");
    };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    // Fetch the vendor credentials from the database
    const vendorsRef = collection(db, "addProductCredential");
    const q = query(vendorsRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);
    const vendors = querySnapshot.docs.map((doc) => doc.data());

    console.log("vendors:", vendors);

    if (vendors.length === 0) {
      setErrorMsg("Invalid email or password");
      return;
    }

    const vendor = vendors.find(
      (v) => v.email.toLowerCase() === email.toLowerCase()
    );

    console.log("vendor:", vendor);

    if (!vendor || vendor.password.toLowerCase() !== password.toLowerCase()) {
      setErrorMsg("Invalid email or password");
      return;
    }

    setSuccessMsg("Login successful. You will now be redirected...");
    setEmail("");
    setPassword("");
    setErrorMsg("");

    navigate("/add-products"); // Navigate to the add-products page after successful login
  };

  const handleForgotPassword = () => {
    setIsForgotPasswordClicked(true);
  };

  const handleResetPassword = () => {
    if (email.trim() === "") {
      setError("Please provide a valid email address.");
      return;
    }

    sendPasswordResetEmail(auth, email)
      .then(() => {
        setIsPasswordResetEmailSent(true);
      })
      .catch((error) => {
        console.log("Error sending password reset email:", error);
        setError(
          "Failed to send password reset email. Please try again later."
        );
      });
  };

  const handleGoBack = () => {
    setIsForgotPasswordClicked(false);
    setIsPasswordResetEmailSent(false);
    setError("");
  };

  return (
    <div className="container-l">
      <div className="box">
        <div className="form">
          {isForgotPasswordClicked ? (
            <>
              <h2>Forgot Password</h2>
              {isPasswordResetEmailSent ? (
                <>
                  <p>Password reset email sent. Please check your inbox.</p>
                  <Link to="/adminLog" onClick={handleGoBack}>
                    Go back to Login
                  </Link>
                </>
              ) : (
                <>
                  {error && <p>{error}</p>}
                  <form
                    className="form-group"
                    autoComplete="off"
                    onSubmit={(e) => e.preventDefault()}
                  >
                    <label>Email:</label>
                    <input
                      type="email"
                      className="form-control"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <br />
                    <div className="btn-box">
                      <button
                        type="submit"
                        className="btn btn-success btn-md"
                        onClick={handleResetPassword}
                      >
                        Reset Password
                      </button>
                    </div>
                  </form>
                  <p>
                    Remembered your password?{" "}
                    <Link to="/adminLog" onClick={handleGoBack}>
                      Go back to Login
                    </Link>
                  </p>
                </>
              )}
            </>
          ) : (
            <>
              <h2>Welcome to SuperSonic</h2>
              <form
                className="form-group"
                autoComplete="off"
                onSubmit={handleLogin}
              >
                <div className="inputBox">
                  <input
                    type="email"
                    required="required"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <span>Email</span>
                  <i></i>
                </div>
                <div className="inputBox">
                  <input
                    type="password"
                    required="required"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <span>Password</span>
                  <i></i>
                </div>
                <div className="links">
                  <Link to="#" onClick={handleForgotPassword}>
                    Forgot Password?
                  </Link>
                  <Link to="/adminReg">Signup</Link>
                </div>
                <input type="submit" value="Login" onClick={handleLogin} />
              </form>
            </>
          )}
        </div>
      </div>

      {errorMsg && (
        <>
          <br />
          <div className="error-msg">{errorMsg}</div>
        </>
      )}
      {successMsg && (
        <>
          <br />
          <div className="success-msg">{successMsg}</div>
        </>
      )}
    </div>
  );
};

export default AdminLogin;
