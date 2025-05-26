import { useState } from "react";
import "./Login.css";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
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

      <div className="form-group">
        <label htmlFor="confirmPassword">Confirm password:</label>
        <input type="password" name="confirmPassword" id="confirmPassword" />
      </div>

      <div className="buttons-white-theme">
        <button>Home</button>
        <button className="main-button">Next</button>
      </div>
    </form>
  );
}

export default Register;
