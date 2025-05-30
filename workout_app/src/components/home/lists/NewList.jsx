import { useNavigate } from "react-router-dom";
import "./NewList.css";
import CreatableSelect from "react-select/creatable";
import { useEffect, useRef, useState } from "react";
import data_file from "../../../data.json";

function NewList() {
  const navigate = useNavigate();

  const [options, setOptions] = useState(null);

  const listNameInputRef = useRef();
  const descriptionInputRef = useRef();

  const submitHandler = (event) => {
    const enteredListName = listNameInputRef.current.value;
    const enteredDescription = descriptionInputRef.current.value;
    event.preventDefault();

    if (
      enteredListName.trim().length == 0 ||
      enteredDescription.trim().length == 0
    ) {
      setError({
        title: "Invalid input",
        message:
          "Please enter a valid title or amount or date (non-empty values)",
      });
      return;
    }

    const newList = {
      listName: enteredListName,
      description: enteredDescription,
    };

    console.log(newList);
    saveUserDataHandler(newList);
  };

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch(
          `http://${data_file.ip}:${data_file.port}/tags/all`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );
        const data = await response.json();

        const formattedOptions = data.map((tag) => ({
          value: tag.name,
          label: tag.name,
        }));

        console.log(formattedOptions);

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

  const NewListHandler = async (event) => {
    event.preventDefault();

    const enteredListName = listNameInputRef.current.value;
    const enteredDescription = descriptionInputRef.current.value;

    if (
      enteredListName.trim().length === 0 ||
      enteredDescription.trim().length === 0
    ) {
      alert("Please enter a valid title and description."); // Or better error UI
      return;
    }

    const newList = {
      listName: enteredListName,
      description: enteredDescription,
      tags: value.map((v) => ({ name: v.label })),
    };

    console.log(newList);

    try {
      const response = await fetch(
        `http://${data_file.ip}:${data_file.port}/lists`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newList),
        }
      );

      if (!response.ok) throw new Error("Failed to create list");

      const data = await response.json();
      console.log("Created list:", data);

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
            <button onClick={homeRedirect}>Home</button>
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
