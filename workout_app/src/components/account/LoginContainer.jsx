import { useEffect, useState } from "react";
import "./Login.css";
import Login from "./Login";
import Register from "./Register";
import { useNavigate } from "react-router-dom";
const VITE_API_URL = import.meta.env.VITE_API_URL;

function LoginContainer() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isRegister, setIsRegister] = useState(false);

  const navigate = useNavigate();

  const handleRegister = (user) => {
    const addUser = async () => {
      try {
        const response = await fetch(`${VITE_API_URL}user/register`, {
          method: "POST",
          body: JSON.stringify(user),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log(data.accessToken);

          setIsRegister(false);
          setIsAuthenticated(true);
          localStorage.setItem("authToken", data.accessToken);
          localStorage.setItem("userCoins", data.newUser.coins);
          navigate("/account");
        } else {
          setError(data.error);
        }
      } catch (error) {
        console.error(error);
      }
    };
    addUser();
  };

  const handleLogin = async (user) => {
    const getUser = async () => {
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
          const errorMessage = await response.text();
          console.log(errorMessage);

          setError({
            title: "An error occurred",
            message: errorMessage || "Invalid email or password.",
          });
          return;
        }
        localStorage.setItem("authToken", data.accessToken);
        localStorage.setItem("userCoins", data.user.coins);
        navigate("/account");
      } catch (error) {
        console.log(error);
        setError({
          title: "Server Unreachable",
          message: "Failed to add user, please try again later.",
        });
      }
    };
    getUser(user);
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");

    if (storedToken) {
      navigate("/account");
    }
  }, []);

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
          <Register onAddUser={handleRegister} />
        ) : (
          <Login onLoginUser={handleLogin} />
        )}
      </div>
    </div>
  );
}

export default LoginContainer;
