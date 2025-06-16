import { Link, useNavigate } from "react-router-dom";
import "./List.css";
import { useEffect, useState } from "react";
const VITE_API_URL = import.meta.env.VITE_API_URL;

function List() {
  const [lists, setLists] = useState(null);
  // const [userId, setUserId] = useState(null);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedToken = localStorage.getItem("authToken");

        const response = await fetch(`${VITE_API_URL}lists/all`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${storedToken}`,
          },
        });
        if (response.status === 401) {
          navigate(
            "/login/" +
              (response.json().message
                ? `?error=${response.json().message}`
                : "")
          );
        }
        const data = await response.json();
        console.log(data);
        setLists(data.lists);
        // setUserId(data.userId);
        setUserData(data.user);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUserData();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${VITE_API_URL}lists/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      console.log("Delete response:", data);
      window.location.reload();
    } catch (error) {
      console.error("Error deleting list:", error);
    }
  };

  const takeList = (list) => {
    localStorage.setItem("taskList", JSON.stringify(list));
    window.location.reload();
  };

  const unlockFeature = async (feature) => {
    const token = localStorage.getItem("authToken");

    const res = await fetch(`${VITE_API_URL}user/unlock-feature`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ feature }),
    });

    const data = await res.json();

    if (data.success) {
      setUserData((prev) => ({
        ...prev,
        coins: data.coins,
        [`${feature}Unlocked`]: true,
      }));
    } else {
      alert(data.error || "Failed to unlock feature.");
    }
  };

  return (
    <div className="lists chart-container">
      {userData ? (
        <>
          <div className="new-list-button">
            <h2>Your lists</h2>
            {!userData.customListsUnlocked ? (
              <button
                className="locked"
                onClick={() => unlockFeature("customLists")}
              >
                <i className="fas fa-lock"></i>
                Add list (100 coins)
              </button>
            ) : (
              <button>
                <Link to="/new-list">+ Add new list </Link>
              </button>
            )}
          </div>
          <div className="lists-container">
            {lists?.map((list, index) => (
              <div className="list" key={index}>
                <div className="list-header">
                  {userData.userId === list.userId ? (
                    <div>
                      <i
                        className="fa fa-pen"
                        onClick={() => {
                          navigate(`/list/${list.listId}`);
                        }}
                      ></i>
                      <i
                        className="fa fa-trash"
                        onClick={() => {
                          handleDelete(list.listId);
                        }}
                      ></i>
                    </div>
                  ) : (
                    <div id="list-actions-disable"></div>
                  )}
                </div>
                <div className="list-body">
                  <p>Title:</p>
                  <h4>{list.listName}</h4>
                </div>
                <div className="list-body">
                  <p>Total time:</p>
                  <h4>20 minutes</h4>
                </div>
                <button
                  id="list-take"
                  onClick={() => {
                    takeList(list);
                  }}
                >
                  Take
                </button>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div></div>
      )}
    </div>
  );
}

export default List;
