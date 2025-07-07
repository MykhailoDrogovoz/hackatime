import React, { useState } from "react";
import "./EmailVerifier.css";
import { redirect, useLocation, useNavigate } from "react-router-dom";

const VITE_API_URL = import.meta.env.VITE_API_URL;

const VerifyEmail = () => {
  const [statusMessage, setStatusMessage] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const navigate = useNavigate();

  const token = queryParams.get("token");
  const username = queryParams.get("username");
  const password = queryParams.get("password");

  const handleVerify = async () => {
    setIsVerifying(true);
    setStatusMessage("");
    try {
      const response = await fetch(`${VITE_API_URL}user/verify-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, username, password }),
      });

      const data = await response.json();
      if (response.status === 201) {
        setStatusMessage({ type: "success", text: data.message });
        console.log(data);
        if (data.token) {
          localStorage.setItem("authToken", data.token);
          localStorage.setItem("userCoins", data.newUser.coins);
          window.dispatchEvent(new Event("coinsUpdated"));

          navigate("/account");
        }
      } else {
        if (data.error === "jwt expired") {
          setStatusMessage({
            type: "error",
            text: "This link doesn't work anymore.",
          });
        } else {
          setStatusMessage({
            type: "error",
            text: data.message || "Verification failed.",
          });
        }
      }
    } catch (error) {
      setStatusMessage({
        type: "error",
        text: "Something went wrong. Please try again.",
      });
      console.log(error);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="full-screen email-ver">
      <div className="verify-email-container">
        <div className="icon">
          <img src="/mail_ver.png" alt="" />
        </div>
        <h2>Email Verification</h2>
        <p>Click the button below to verify your email address.</p>
        <button onClick={handleVerify} disabled={isVerifying}>
          {isVerifying ? "Verifying..." : "Verify Email"}
        </button>
        {statusMessage && (
          <div
            className={
              statusMessage.type === "success"
                ? "status-success"
                : "status-error"
            }
          >
            {statusMessage.text}
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
