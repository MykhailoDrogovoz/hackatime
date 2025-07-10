import React, { useState, useContext, useEffect } from "react";
import { ThemeContext } from "../../components/ThemeContext";
import { useNavigate } from "react-router-dom";
const VITE_API_URL = import.meta.env.VITE_API_URL;

function Settings() {
  const navigate = useNavigate;
  const { isGradient, toggleTheme } = useContext(ThemeContext);
  const [emailNotifications, setEmailNotifications] = useState(true);

  const handleDarkModeToggle = () => toggleTheme();

  const handleEmailNotifToggle = () => setEmailNotifications((prev) => !prev);

  const handleSave = (e) => {
    e.preventDefault();
    alert(
      `Settings saved!\nDark Mode: ${isGradient}\nEmail Notifications: ${emailNotifications}`
    );
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action is irreversible."
    );

    if (!confirmed) return;

    try {
      const res = await fetch(`${VITE_API_URL}user/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to delete account.");
      }

      alert("Your account has been deleted.");
      localStorage.clear();
      navigate("/");
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="settings-tab">
      <h1>Settings</h1>

      <form onSubmit={handleSave} className="settings-form">
        <div className="field">
          <p>Enable Dark Mode</p>
          <label class="switch">
            <input
              className="dark-mode"
              type="checkbox"
              checked={isGradient}
              onChange={handleDarkModeToggle}
            />
            <span class="slider-1 round"></span>
          </label>
        </div>

        <div className="field">
          <p>Receive Email Notifications</p>
          <label class="switch">
            <input
              className="email-notifications"
              type="checkbox"
              checked={emailNotifications}
              onChange={handleEmailNotifToggle}
            />
            <span class="slider-2 round"></span>
          </label>
        </div>

        <div className="field">
          <a onClick={handleDeleteAccount} className="delete-account">
            Delete account
          </a>
        </div>
      </form>
    </div>
  );
}

export default Settings;
