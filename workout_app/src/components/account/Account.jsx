import { useState } from "react";
import "./Account.css";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Settings from "./Settings";
import { useRef } from "react";
import Popup from "reactjs-popup";
const VITE_API_URL = import.meta.env.VITE_API_URL;
const cloudName = import.meta.env.VITE_cloudName;
const unsignedUploadPreset = import.meta.env.VITE_unsignedUploadPreset;

function Account() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("account");
  const [token, setToken] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [userData, setUserData] = useState(null);
  const fileInputRef = useRef(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const [fields, setFields] = useState([
    {
      id: 1,
      label: "Username",
      name: "username",
      type: "name",
      value: "",
      required: true,
    },
    { id: 2, label: "Name", name: "firstName", type: "text", value: "" },
    { id: 3, label: "Surname", name: "lastName", type: "text", value: "" },
    {
      id: 4,
      label: "Email",
      name: "email",
      type: "email",
      value: "",
      required: true,
    },
  ]);

  const onPenClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleImageUpload(file);
    }
  };

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
    window.dispatchEvent(new Event("coinsUpdated"));

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

      if (profileImage) {
        updatedData.profileImage = profileImage;
      }

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
        setUploadSuccess(true);
        setTimeout(() => setUploadSuccess(false), 2000);
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

  const handleImageUpload = async (file) => {
    setIsLoading(true);
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", unsignedUploadPreset);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (data.secure_url) {
        setProfileImage(data.secure_url);

        const response = await fetch(`${VITE_API_URL}user/edit`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ profileImage: data.secure_url }),
        });

        if (!response.ok) {
          alert("Image upload failed.");
        } else {
          setIsLoading(false);

          setUserData((prev) => ({ ...prev, profileImage: data.secure_url }));
          setUploadSuccess(true);
          setTimeout(() => setUploadSuccess(false), 2000);
        }
      } else {
        alert("Image upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Error uploading image");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="full-screen center">
      <Popup open={isLoading} closeOnDocumentClick={false} modal>
        <div className="loading-popup">
          <h3>Uploading...</h3>
          <div className="spinner"></div>
        </div>
      </Popup>

      <Popup open={uploadSuccess} closeOnDocumentClick={false} modal>
        <div className="success-popup">
          <h3>Profile has been updated successfully!</h3>
        </div>
      </Popup>
      <div className="account">
        <div className="account-list">
          <div className="account-list-header">
            {userData?.profileImage ? (
              <img
                src={userData.profileImage}
                alt="Profile"
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "2px solid #fff",
                }}
              />
            ) : (
              <i className="fa fa-user-circle"></i>
            )}
            <div>
              <h3>{fields[0].value}</h3>
              <p>{fields[3].value}</p>
            </div>
          </div>
          <ul className="center">
            <div
              className={activeTab === "account" ? "main active" : ""}
              onClick={() => setActiveTab("account")}
            >
              <h5>Account</h5>
              <i className="fa fa-chevron-right"></i>
            </div>
            <div
              className={activeTab === "settings" ? "main active" : ""}
              onClick={() => setActiveTab("settings")}
            >
              <h5>Settings</h5>
              <i className="fa fa-chevron-right"></i>
            </div>
            <div onClick={logoutHandler} className="logout-tab logout">
              <h5>Logout</h5>
              <i className="fa fa-sign-out-alt"></i>
            </div>
          </ul>
        </div>

        <div className="account-main">
          {activeTab === "account" && (
            <>
              <div
                className="center profile-image-container"
                style={{ position: "relative" }}
              >
                {userData?.profileImage ? (
                  <>
                    <img
                      src={userData.profileImage}
                      alt="Profile"
                      style={{
                        width: 150,
                        height: 150,
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                    />

                    <i className="fa fa-pen" onClick={onPenClick}></i>
                  </>
                ) : (
                  <>
                    <i className="fa fa-user-circle"></i>
                    <i className="fa fa-pen" onClick={onPenClick}></i>
                  </>
                )}

                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
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
                <button
                  className="main-button"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Edit"}
                </button>
              </form>
            </>
          )}

          {activeTab === "settings" && <Settings />}

          <a onClick={logoutHandler} className="mobile-logout">
            Logout
          </a>
        </div>
      </div>
    </div>
  );
}

export default Account;
