import React, { useState, useContext, useEffect } from "react";
import { ThemeContext } from "../../components/ThemeContext";

function Settings() {
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

        <button type="submit" className="main-button">
          Save Settings
        </button>
      </form>
    </div>
  );
}

export default Settings;
