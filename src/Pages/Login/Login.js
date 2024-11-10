import React, { useState, useContext } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  sendEmailVerification,
} from "firebase/auth";
import { auth } from "../../Utils/firebaseConfig";
import { getDatabase, ref, set, get } from "firebase/database";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { UserContext } from "../../context/UserContext";

const Login = () => {
  const navigate = useNavigate();
  const { loginUser } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [loading, setLoading] = useState(false); // Loader state
  const [passwordMismatch, setPasswordMismatch] = useState(false); // Password mismatch state
  const [verificationSent, setVerificationSent] = useState(false); // Verification email sent state
  const [documentVerified, setDocumentVerified] = useState(false); // Document verification state

  // Handle Email/Password Login
  const handleEmailPasswordLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true); // Start loading
  
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      if (!user.emailVerified) {
        setErrorMessage("Please verify your email before logging in.");
        setLoading(false);
        return;
      }
  
      const db = getDatabase();
      const userRef = ref(db, "users/" + user.uid);
  
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        const userData = snapshot.val();
        console.log("Fetched user data:", userData);
        setDocumentVerified(userData.documentVerified); // Set documentVerified state
  
        // Pass user data and documentVerified to loginUser context
        loginUser({
          ...user,
          documentVerified: userData.documentVerified,
        });
      } else {
        console.error("No data available for this user.");
      }
  
      navigate("/");
    } catch (error) {
      console.error("Error signing in with email and password:", error.message);
      setErrorMessage("Login failed. Please check your credentials.");
    } finally {
      setLoading(false); // End loading
    }
  };

  // Handle Password Reset
  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true); // Start loading when reset process begins

    try {
      await sendPasswordResetEmail(auth, email);
      setErrorMessage("Password reset email sent. Please check your inbox.");
      setIsForgotPassword(false); // Navigate back to login after password reset request
    } catch (error) {
      console.error("Error sending password reset email:", error.message);
      switch (error.code) {
        case "auth/invalid-email":
          setErrorMessage("Invalid email address.");
          break;
        case "auth/user-not-found":
          setErrorMessage("No user found with this email address.");
          break;
        default:
          setErrorMessage("Failed to send password reset email.");
      }
    } finally {
      setLoading(false); // End loading
    }
  };

  // Handle Email/Password Sign-Up
  const handleEmailPasswordSignUp = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setPasswordMismatch(false);
    setLoading(true); // Start loading

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setErrorMessage("Invalid email address.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setPasswordMismatch(true); // Show password mismatch feedback
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Update user profile
      await updateProfile(user, { displayName: name });

      // Send email verification
      await sendEmailVerification(user);
      setVerificationSent(true);

      // Inform the user to check their email
      setErrorMessage(
        "A verification email has been sent. Please verify your email before you can log in."
      );

      // Store user data in the database
      const db = getDatabase();
      const userRef = ref(db, "users/" + user.uid);
      set(userRef, {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        documentVerified: false,
      });

      setLoading(false);
    } catch (error) {
      console.error("Error signing up:", error.code, error.message);
      switch (error.code) {
        case "auth/email-already-in-use":
          setErrorMessage("Email is already in use.");
          break;
        case "auth/invalid-email":
          setErrorMessage("Invalid email address.");
          break;
        case "auth/weak-password":
          setErrorMessage("Password is too weak.");
          break;
        default:
          setErrorMessage("Sign-up failed. Please check your details.");
      }
      setLoading(false); // End loading
    }
  };

  // Google Sign-In
  const handleGoogleSignIn = async () => {
    setErrorMessage("");
    setLoading(true); 
  
    const provider = new GoogleAuthProvider();
  
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
  
      console.log("Google User Info:", user);
      
      const db = getDatabase();
      const userRef = ref(db, "users/" + user.uid);
      
      const snapshot = await get(userRef);
  
      if (snapshot.exists()) {
        // User exists, fetch their data from Firebase and set in UserContext
        const userData = snapshot.val();
        loginUser({
          ...user,
          ...userData,  // This includes documentVerified and any other custom fields
        });
        console.log("Fetched existing user data:", userData);
      } else {
        // User doesn't exist, create a new user entry in the database
        const newUserData = {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          documentVerified: false, // Default to false for new users
        };
  
        await set(userRef, newUserData);
  
        loginUser({
          ...user,
          documentVerified: false,
        });
        console.log("Created new user data:", newUserData);
      }
  
      navigate("/");
    } catch (error) {
      console.error("Error signing in with Google:", error.message);
      setErrorMessage("Failed to sign in with Google. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="login-page">
      <div className="form-container">
        <div className="form">
          <h2>
            {isForgotPassword
              ? "Forgot Password"
              : isSigningUp
              ? "Sign Up"
              : "Login"}
          </h2>
          <p>
            {isForgotPassword
              ? "Enter your email to receive a password reset link."
              : isSigningUp
              ? "Create an account to join travel groups."
              : "Sign in to access your travel groups."}
          </p>

          {loading ? (
            <div className="loader"></div>
          ) : (
            <>
              {/* Password Reset Form */}
              {isForgotPassword ? (
                <form onSubmit={handlePasswordReset}>
                  <div>
                    <label>Email</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="login-input"
                    />
                  </div>
                  {errorMessage && (
                    <p className="login-error">{errorMessage}</p>
                  )}
                  <button type="submit" className="login-button">
                    Reset Password
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsForgotPassword(false)}
                    className="login-button"
                  >
                    Back to Login
                  </button>
                </form>
              ) : (
                <>
                  {/* Email/Password Login or Sign-Up Form */}
                  <form
                    onSubmit={
                      isSigningUp
                        ? handleEmailPasswordSignUp
                        : handleEmailPasswordLogin
                    }
                  >
                    {isSigningUp && (
                      <>
                        <div>
                          <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Name"
                            className="login-input-name"
                          />
                        </div>
                        {verificationSent && !errorMessage && (
                          <p>
                            An email verification link has been sent to {email}.
                            Please verify your email.
                          </p>
                        )}
                      </>
                    )}
                    <div>
                      {/* <label>Email</label> */}
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        className="login-input"
                      />
                    </div>
                    <div>
                      {/* <label>Password</label> */}
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        className="login-input"
                      />
                    </div>
                    {isSigningUp && (
                      <div>
                        {/* <label>Confirm Password</label> */}
                        <input
                          type="password"
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Confirm Password"
                          className="login-input"
                        />
                        {passwordMismatch && (
                          <p className="login-error">Passwords do not match.</p>
                        )}
                      </div>
                    )}

                    {errorMessage && (
                      <p className="login-error">{errorMessage}</p>
                    )}

                    <button type="submit" className="login-button">
                      {isSigningUp
                        ? "Sign Up with Email"
                        : "Sign In with Email"}
                    </button>
                  </form>
                  <div className="toggle-signup">
                    <p>
                      {isSigningUp
                        ? "Already have an account?"
                        : "Don't have an account?"}
                      <span onClick={() => setIsSigningUp(!isSigningUp)}>
                        {isSigningUp ? " Sign In" : " Sign Up"}
                      </span>
                    </p>
                  </div>
                  <div className="forgot-password">
                    {!isSigningUp && (
                      <p onClick={() => setIsForgotPassword(true)}>
                        Forgot Password?
                      </p>
                    )}
                  </div>
                  <div className="social-login">
                    <button
                      onClick={handleGoogleSignIn}
                      className="login-button google-signin-button"
                    >
                      Google
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;