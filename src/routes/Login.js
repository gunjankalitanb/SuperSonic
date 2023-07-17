import React, { useState } from "react";

import { Link, useNavigate } from "react-router-dom";
import {
  getAuth,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";

const Login = () => {
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

  const handleLogin = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        setSuccessMsg("Login successful. You will now be redirected...");
        setEmail("");
        setPassword("");
        setErrorMsg("");
        setTimeout(() => {
          setSuccessMsg("");
          navigate("/Product");
        }, 3000);
      })
      .catch((error) => setErrorMsg(error.message));
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
                  <Link to="/Login" onClick={handleGoBack}>
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
                    <Link to="/Login" onClick={handleGoBack}>
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
                  <Link to="/Signup">Signup</Link>
                </div>
              </form>
              <input type="submit" value="Login" onClick={handleLogin} />
              {/* <input type="submit" value="Login" onClick={handleLogin} /> */}
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

export default Login;
