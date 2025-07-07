import { useState } from "react";
import "./ResetPassword.css";
const VITE_API_URL = import.meta.env.VITE_API_URL;

function ResetPasswordRequest() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        `${VITE_API_URL}user/request-password-token`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        setIsError(false);
        setMessage(data.message);
      } else {
        setIsError(true);
        setMessage(data.error || "Something went wrong!");
      }
    } catch (error) {
      setMessage("Error: Unable to send password reset email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="full-screen login-container">
      <div className="lists chart-container new-list login reset-password">
        <h2>Reset Your Password</h2>

        <div className="reset-password-request">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="">Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button className="main-button" type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
          {message && (
            <p className={isError ? "message error" : "message success"}>
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResetPasswordRequest;
