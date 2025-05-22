import { useNavigate } from "react-router-dom";
import "./NewList.css";
import CreatableSelect from "react-select/creatable";
import { useState } from "react";

function NewList() {
  const navigate = useNavigate();

  const [options, setOptions] = useState([
    { value: "Push ups", label: "Push ups" },
    { value: "Squats", label: "Squats" },
    { value: "Oblique Crunches", label: "Oblique Crunches" },
    { value: "Planks", label: "Planks" },
  ]);

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

  const NewListHandler = () => {
    alert("New list added");
    homeRedirect();
  };

  return (
    <div className="full-screen">
      <div className="lists chart-container new-list">
        <form action="">
          <div className="form-group">
            <label htmlFor="">List name:</label>
            <input type="text" />
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
            <textarea name="" id=""></textarea>
          </div>

          <div className="buttons-white-theme">
            <button onClick={homeRedirect}>Home</button>
            <button className="main-button" onClick={NewListHandler}>
              Next
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewList;
