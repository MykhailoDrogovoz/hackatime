import { useState } from "react";
import "./Account.css";

function Account() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <div className="full-screen center">
      <div className="account">
        <div className="account-list">
          <ul className="center">
            <h5 className="main">Account</h5>
            <h5>Settings</h5>
            <h5>Settings</h5>
            <h5>Settings</h5>
          </ul>
        </div>
        <div className="account-main">
          <div className="center">
            <i className="fa fa-user-circle"></i>
            <i className="fa fa-pen"></i>
          </div>
          <form action="">
            <div className="form-group">
              <label htmlFor="username ">Username:</label>
              <input type="text" name="username" id="username" />
            </div>

            <div className="form-group">
              <label htmlFor="">Email:</label>
              <input type="email" name="email" id="email" />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password:</label>
              <input type="password" name="password" id="password" />
            </div>

            <button className="main-button">Edit</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Account;
