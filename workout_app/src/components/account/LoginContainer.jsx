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
        const data = await response.json();
        console.log(data);
        if (data.success) {
          setIsRegister(false);
          setIsAuthenticated(true);
          localStorage.setItem("authToken", data.accessToken);
          navigate("/account");
        } else {
          setError(data.error);
        }
      } catch (error) {
        console.error(error);
      }
    };
    addUser();
    useState(() => {
      setToken(localStorage.getItem("authToken"));
      return null;
    }, []);
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
        localStorage.setItem("authToken", data.accessToken);

        if (!response.ok) {
          const errorMessage = await response.text();
          console.log(errorMessage);

          setError({
            title: "An error occurred",
            message: errorMessage || "Invalid email or password.",
          });
          return;
        }
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

    useState(() => {
      setToken(localStorage.getItem("authToken"));
      return null;
    }, []);
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");

    if (storedToken) {
      navigate("/account");
    }
  });

  return (
    <div className="full-screen">
      <div className="lists chart-container new-list login">
        <div className="login-header">
          <h3
            className={!isRegister && "main left"}
            onClick={
              isRegister
                ? () => {
                    setIsRegister(false);
                  }
                : () => {}
            }
          >
            Sign in
          </h3>
          <h3
            className={isRegister && "main"}
            onClick={
              isRegister
                ? () => {}
                : () => {
                    setIsRegister(true);
                  }
            }
          >
            Sign up
          </h3>
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
