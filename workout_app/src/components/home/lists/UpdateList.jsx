import { useNavigate, useParams } from "react-router-dom";
import "./NewList.css";
import CreatableSelect from "react-select/creatable";
import { useEffect, useRef, useState } from "react";
const VITE_API_URL = import.meta.env.VITE_API_URL;

function UpdateList() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [options, setOptions] = useState([]);
  const [listData, setListData] = useState(null);
  const [value, setValue] = useState([]);

  const listNameInputRef = useRef();
  const descriptionInputRef = useRef();
  const accessInputRef = useRef();

  const storedToken = localStorage.getItem("authToken");

  // Fetch available tags and list data
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch(`${VITE_API_URL}tags/all`);
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

    const fetchListData = async () => {
      try {
        const response = await fetch(`${VITE_API_URL}lists/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${storedToken}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch list");

        const data = await response.json();
        console.log(data);

        setListData(data.list);
        if (data.userId !== data.list.userId) {
          navigate("/");
        }

        // Set the form values using the fetched list data
        const selectedTags = data.list.Tags.map((tag) => ({
          value: tag.name,
          label: tag.name,
        }));
        setValue(selectedTags);
      } catch (error) {
        console.error("Error fetching list data:", error);
        alert("Error loading list data");
      }
    };

    fetchTags();
    fetchListData();
  }, [id]);

  // Form field handlers
  const handleChange = (newValue) => setValue(newValue);
  const handleCreate = (inputValue) => {
    const newOption = { value: inputValue.toLowerCase(), label: inputValue };
    setOptions((prev) => [...prev, newOption]);
    setValue((prev) => [...prev, newOption]);
  };

  const EditListHandler = async (event) => {
    event.preventDefault();

    const updatedList = {
      listName: listNameInputRef.current.value,
      description: descriptionInputRef.current.value,
      access: accessInputRef.current.value,
      tags: value.map((v) => ({ name: v.label })),
    };

    try {
      const response = await fetch(`${VITE_API_URL}lists/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedToken}`,
        },
        body: JSON.stringify(updatedList),
      });

      if (!response.ok) throw new Error("Failed to update list");

      const data = await response.json();
      console.log("Updated list:", data);

      navigate("/");
    } catch (error) {
      console.error(error);
      alert("There was an error updating the list.");
    }
  };

  // Loading state until listData is fetched
  if (!listData) return <div>Loading...</div>;

  return (
    <div className="full-screen">
      <div className="lists chart-container new-list">
        <form onSubmit={EditListHandler}>
          <h3>Edit list</h3>
          <div className="form-group">
            <label>List name:</label>
            <input
              type="text"
              ref={listNameInputRef}
              defaultValue={listData.listName}
            />
          </div>
          <div className="form-group">
            <label>Choose accessibility:</label>
            <select ref={accessInputRef} defaultValue={listData.access}>
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>
          <div className="form-group">
            <label>Tags:</label>
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
            <label>Description:</label>
            <textarea
              ref={descriptionInputRef}
              defaultValue={listData.description}
            />
          </div>
          <div className="buttons-white-theme">
            <button onClick={() => navigate("/")}>Home</button>
            <button className="main-button" type="submit">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateList;
