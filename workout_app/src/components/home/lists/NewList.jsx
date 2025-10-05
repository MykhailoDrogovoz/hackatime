import { useNavigate } from "react-router-dom";
import "./NewList.css";
import CreatableSelect from "react-select/creatable";
import { useEffect, useRef, useState } from "react";
const VITE_API_URL = import.meta.env.VITE_API_URL;

function NewList() {
  const navigate = useNavigate();

  const [options, setOptions] = useState(null);

  const listNameInputRef = useRef();
  const descriptionInputRef = useRef();
  const accessInputRef = useRef();

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch(`${VITE_API_URL}tags/all`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();

        const formattedOptions = data.map((tag) => ({
          value: tag.name,
          label: tag.name,
        }));

        setOptions(formattedOptions);
      } catch (error) {
        console.error(error);
      }
    };
    fetchTags();
  }, []);

  const [value, setValue] = useState([]);

  const handleChange = (newValue) => {
    setValue(newValue);
  };

  const handleCreate = (inputValue) => {
    const newOption = { value: inputValue.toLowerCase(), label: inputValue };
    setOptions((prev) => [...prev, newOption]);
    setValue((prev) => [...prev, newOption]);
  };

  const homeRedirect = () => {
    navigate("/");
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");

    if (!storedToken) {
      navigate("/login");
      return;
    }

    const checkAuthorization = async () => {
      try {
        const response = await fetch(`${VITE_API_URL}user/profile`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${storedToken}`,
          },
        });

        if (!response.ok) {
          localStorage.removeItem("authToken");
          navigate("/login");
        }
        const data = await response.json();
        if (!data.user.customListsUnlocked) {
          homeRedirect();
        }
      } catch (error) {
        console.error("Authorization check failed:", error);
      }
    };

    checkAuthorization();
  }, []);

  const NewListHandler = async (event) => {
    event.preventDefault();

    const enteredListName = listNameInputRef.current.value;
    const enteredDescription = descriptionInputRef.current.value;
    const enteredAccess = accessInputRef.current.value;

    if (enteredListName.trim().length === 0) {
      alert("Please enter a valid title.");
      return;
    }

    const newList = {
      listName: enteredListName,
      description: enteredDescription,
      access: enteredAccess,
      tags: value.map((v) => ({ name: v.label })),
    };

    try {
      const storedToken = localStorage.getItem("authToken");

      const response = await fetch(`${VITE_API_URL}lists`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedToken}`,
        },
        body: JSON.stringify(newList),
      });

      if (!response.ok) throw new Error("Failed to create list");

      const data = await response.json();

      navigate("/");
    } catch (error) {
      console.error(error);
      alert("There was an error creating the list.");
    }
  };

  return (
    <div className="full-screen">
      <div className="lists chart-container new-list">
        <form action="" onSubmit={NewListHandler}>
          <h3>New list</h3>
          <div className="form-group">
            <label htmlFor="">List name:</label>
            <input type="text" ref={listNameInputRef} />
          </div>

          <div className="form-group">
            <label htmlFor="access">Choose accessiblity:</label>
            <select name="access" id="access" ref={accessInputRef} required>
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="">Tags:</label>
            <CreatableSelect
              isMulti
              isClearable
              onChange={handleChange}
              onCreateOption={handleCreate}
              options={options}
              value={value}
              placeholder="Select or create..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="">Description:</label>
            <textarea name="" id="" ref={descriptionInputRef}></textarea>
          </div>

          <div className="buttons-white-theme">
            <button onClick={homeRedirect} type="reset">
              Home
            </button>
            <button className="main-button" type="submit">
              Next
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewList;
