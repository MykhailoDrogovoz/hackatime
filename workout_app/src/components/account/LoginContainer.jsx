import { useEffect, useState } from "react";
import "./Login.css";
import Login from "./Login";
import Register from "./Register";
import { useNavigate } from "react-router-dom";
const VITE_API_URL = import.meta.env.VITE_API_URL;

function LoginContainer() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isRegister, setIsRegister] = useState(false);

  const navigate = useNavigate();

  const handleRegister = (user) => {
    const addUser = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${VITE_API_URL}user/register`, {
          method: "POST",
          body: JSON.stringify(user),
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        console.log(response, response.ok);
        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          setError(data.error || "Registration failed.");
        }
      } catch (error) {
        console.error(error);
        setError("Server error, please try again later.");
      } finally {
        setLoading(false);
      }
    };
    addUser();
  };

  const handleLogin = async (user) => {
    setLoading(true);
    try {
      const response = await fetch(`${VITE_API_URL}user/login`, {
        method: "POST",
        body: JSON.stringify(user),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.error;
        setError(errorMessage || "Invalid email or password.");
        setLoading(false);
        return;
      }

      localStorage.setItem("authToken", data.accessToken);
      localStorage.setItem("userCoins", data.user.coins);

      navigate("/account");
      setTimeout(() => {
        window.dispatchEvent(new Event("coinsUpdated"));
      }, 100);
    } catch (error) {
      console.log(error);
      setError({
        title: "Server Unreachable",
        message: "Password is not correct.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");

    if (storedToken) {
      navigate("/account");
    }
  }, []);

  useEffect(() => {
    if (error) {
      alert(error.message);
    }
  }, [error]);

  return (
    <div className="full-screen login-container">
      <div className="lists chart-container new-list login">
        <div className="login-header">
          {["Sign in", "Sign up"].map((label, index) => {
            const isSignIn = index === 0;
            const active =
              (isSignIn && !isRegister) || (!isSignIn && isRegister);

            let className = "";
            if (active) className += " main";
            if (!isRegister && label === "Sign in") className += " left";

            return (
              <h3
                key={label}
                className={className}
                onClick={() => {
                  if ((isSignIn && isRegister) || (!isSignIn && !isRegister)) {
                    setIsRegister(!isRegister);
                  }
                }}
              >
                {label}
              </h3>
            );
          })}
        </div>
        {isRegister ? (
          <Register
            onAddUser={handleRegister}
            loading={loading}
            setLoading={setLoading}
            isAuthenticated={isAuthenticated}
          />
        ) : (
          <Login
            onLoginUser={handleLogin}
            loading={loading}
            setLoading={setLoading}
          />
        )}
      </div>
    </div>
  );
}

export default LoginContainer;
