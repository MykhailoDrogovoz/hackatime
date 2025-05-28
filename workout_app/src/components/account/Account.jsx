import { useState } from "react";
import "./Account.css";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import data_file from "../../data.json";

function Account() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [token, setToken] = useState("");
  const navigate = useNavigate();

  const handleCloseError = () => {
    setError(null);
  };

  const [fields, setFields] = useState([
    { id: 1, label: "Username", name: "username", type: "name", value: "" },

    { id: 2, label: "Name", name: "firstName", type: "text", value: "" },
    { id: 3, label: "Surname", name: "lastName", type: "text", value: "" },
    { id: 4, label: "Email", name: "email", type: "email", value: "" },
    {
      id: 5,
      label: "Phone number",
      name: "phoneNumber",
      type: "phone",
      value: "",
    },
  ]);

  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const storedToken = localStorage.getItem("authToken");

      if (!storedToken) {
        navigate("/login");
        return null;
      }

      try {
        const response = await fetch(
          `http://${data_file.ip}:${data_file.port}/user/profile`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${storedToken}`,
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          if (
            response.status === 401 &&
            errorData.message &&
            errorData.message.toLowerCase().includes("expired")
          ) {
            localStorage.removeItem("authToken");

            navigate(
              "/login" +
                (errorData.message ? `?error=${errorData.message}` : "")
            );

            return;
          }
          setError({
            title: "Problems with backend",
            message: "Failed to fetch user data",
          });
          return;
        }

        const data = await response.json();
        console.log("Fetched user:", data);
        setToken(storedToken);

        setUserData(data.user);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUserData(token, navigate);
  }, []);

  useEffect(() => {
    if (!userData) return;

    setFields((prevFields) =>
      prevFields.map((field) => ({
        ...field,
        value: userData[field.name] || "",
      }))
    );
  }, [userData]);

  const logoutHandler = () => {
    setToken("");
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  return (
    <div className="full-screen center">
      <div className="account">
        <div className="account-list">
          <div className="account-list-header">
            <i className="fa fa-user-circle"></i>
            <div>
              <h3>{fields[0].value}</h3>
              <p>{fields[3].value}</p>
            </div>
          </div>
          <ul className="center">
            <div className="main">
              <h5>Account</h5>
              <i className="fa fa-chevron-right"></i>
            </div>
            <div>
              <h5>Settings</h5>
              <i className="fa fa-chevron-right"></i>
            </div>
            <div>
              <h5>Settings</h5>
              <i className="fa fa-chevron-right"></i>
            </div>
            <div>
              <h5>Settings</h5>
              <i className="fa fa-chevron-right"></i>
            </div>
          </ul>
        </div>
        <div className="account-main">
          <div className="center">
            <i className="fa fa-user-circle"></i>
            <i className="fa fa-pen"></i>
          </div>
          {/* <form action="">
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
          </form> */}
          <form>
            {fields.map((field) => (
              <div key={field.id} className="field">
                <label htmlFor={field.name}>{field.label}:</label>
                <input
                  type={field.type}
                  name={field.name}
                  value={field.value}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                />
              </div>
            ))}
            <button className="main-button">Edit</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Account;
