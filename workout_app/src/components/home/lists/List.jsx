import { Link } from "react-router-dom";
import "./List.css";
import { useEffect, useState } from "react";
const VITE_API_URL = import.meta.env.VITE_API_URL;

function List() {
  const [lists, setLists] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${VITE_API_URL}lists/all`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        setLists(data);
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

  return (
    <div className="lists chart-container">
      <div className="new-list-button">
        <h2>Your lists</h2>
        <button>
          <Link to="/new-list">+ Add new list </Link>
        </button>
      </div>
      <div className="lists-container">
        {lists?.map((list, index) => (
          <div className="list" key={index}>
            <div className="list-header">
              <i className="fa fa-pen"></i>
              <i
                className="fa fa-trash"
                onClick={() => {
                  handleDelete(list.listId);
                }}
              ></i>
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
    </div>
  );
}

export default List;
