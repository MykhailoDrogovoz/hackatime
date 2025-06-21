import { useState } from "react";
import "./Account.css";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
const VITE_API_URL = import.meta.env.VITE_API_URL;

function Account() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const [token, setToken] = useState("");
  const navigate = useNavigate();

  const [fields, setFields] = useState([
    { id: 1, label: "Username", name: "username", type: "name", value: "", required: true },
    { id: 2, label: "Name", name: "firstName", type: "text", value: "" },
    { id: 3, label: "Surname", name: "lastName", type: "text", value: "" },
    { id: 4, label: "Email", name: "email", type: "email", value: "", required: true },
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
        const response = await fetch(`${VITE_API_URL}user/profile`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${storedToken}`,
          },
        });

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
            title: "Unauthorized",
            message: "Failed to fetch user data",
          });
          localStorage.removeItem("authToken");
          navigate("/login");
          console.log("jdkajlsd");
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
    localStorage.removeItem("userCoins");
    navigate("/login");
  };

  const handleChange = (id, newValue) => {
    setFields((prevFields) =>
      prevFields.map((field) =>
        field.id === id ? { ...field, value: newValue } : field
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emptyRequiredFields = fields.filter(
      (field) => field.required && !field.value.trim()
    );

    if (emptyRequiredFields.length > 0) {
      setError({
        title: "Validation Error",
        message: `${emptyRequiredFields.map((f) => f.label).join(", ")} ${
          emptyRequiredFields.length === 1 ? "is" : "are"
        } required.`,
      });
      return;
    }

    setLoading(true);

    try {
      const updatedData = {};
      fields.forEach((field) => {
        updatedData[field.name] = field.value;
      });

      const response = await fetch(`${VITE_API_URL}user/edit`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });

      const result = await response.json();

      if (!response.ok) {
        setError({
          title: "Update Failed",
          message: result?.message || "Could not update user data",
        });
      } else {
        setUserData((prev) => ({ ...prev, ...updatedData }));
        alert("Profile updated successfully!");
      }
    } catch (err) {
      console.error("Error updating user:", err);
      setError({
        title: "Error",
        message: "An unexpected error occurred while updating profile.",
      });
    } finally {
      setLoading(false);
    }
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
              <a onClick={logoutHandler}>Logout</a>
            </div>
          </ul>
        </div>

        <div className="account-main">
          <div className="center">
            <i className="fa fa-user-circle"></i>
            <i className="fa fa-pen"></i>
          </div>

          <form onSubmit={handleSubmit}>
            {fields.map((field) => (
              <div key={field.id} className="field">
                <label htmlFor={field.name}>{field.label}:</label>
                <input
                  type={field.type}
                  name={field.name}
                  value={field.value}
                  required={field.required}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                />
              </div>
            ))}
            <button className="main-button" type="submit" disabled={loading}>
              {loading ? "Saving..." : "Edit"}
            </button>
          </form>
          <a onClick={logoutHandler} className="mobile-logout">Logout</a>
        </div>
      </div>
    </div>
  );
}

export default Account;
