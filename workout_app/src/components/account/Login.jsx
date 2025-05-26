import { useState } from "react";
import "./Login.css";

function Login() {
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
        <label htmlFor="">Email:</label>
        <input type="email" />
      </div>
      <div className="form-group">
        <label htmlFor="">Password:</label>
        <input type="password" />
      </div>
      <div className="form-group">
        <p>
          Forgot your password? <a href="">Reset</a>
        </p>
      </div>
      <div className="buttons-white-theme">
        <button>Home</button>
        <button className="main-button">Next</button>
      </div>
    </form>
  );
}

export default Login;
