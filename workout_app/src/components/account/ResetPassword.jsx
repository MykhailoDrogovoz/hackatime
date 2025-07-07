import { useState } from "react";
import { useParams } from "react-router-dom";
const VITE_API_URL = import.meta.env.VITE_API_URL;

function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setIsError(true);
      setMessage("Passwords do not match!");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${VITE_API_URL}user/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();
      if (response.ok) {
        setIsError(false);
        setMessage(data.message);
      } else {
        setIsError(true);
        setMessage(data.message || "Something went wrong!");
      }
    } catch (error) {
      setMessage("Error: Unable to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="full-screen login-container">
      <div className="lists chart-container new-list login reset-password">
        <h2>Reset Your Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="">Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="">Confirm your password:</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button className="main-button" type="submit" disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
        {message && (
          <p className={isError ? "message error" : "message success"}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default ResetPassword;
