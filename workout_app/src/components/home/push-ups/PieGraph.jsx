import "./PieGraph.css";
import { useEffect, useState } from "react";
import Popup from "reactjs-popup";
const VITE_API_URL = import.meta.env.VITE_API_URL;

function PieGraph(props) {
  const exType = "Pushups";

  const [tags, setTags] = useState(0);

  const [doneSets, setDoneSets] = useState([]);

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const tagName = props.name;

    const fetchDoneSets = async () => {
      const storedToken = localStorage.getItem("authToken");
      const response = await fetch(`${VITE_API_URL}tags/get-sets/${tagName}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedToken}`,
        },
      });
      if (!response.ok) {
      }
      const data = await response.json();
      if (!data.userExercise) {
        setDoneSets(0);
      } else {
        setDoneSets(data.userExercise.setsCompleted);
        console.log(data.userExercise.setsCompleted, props.name);
        setProgress(
          Math.round((data.userExercise.setsCompleted / props.totalSets) * 100)
        );
      }
    };
    if (tagName) {
      fetchDoneSets();
    }
  }, []);

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

        // console.log(formattedOptions);
        setTags(formattedOptions);
      } catch (error) {
        console.error(error);
      }
    };
    fetchTags();
  }, []);

  const [selectedTag, setSelectedTag] = useState(null);

  const selectedTagHandle = (label) => {
    if (label === selectedTag) {
      setSelectedTag(null);
    } else {
      setSelectedTag(label);
    }
  };

  const addListTag = () => {
    const fetchTags = async () => {
      const taskList = JSON.parse(localStorage.getItem("taskList"));
      console.log(selectedTag);
      try {
        const response = await fetch(
          `${VITE_API_URL}lists/add-to-list/${taskList.listId}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ tag: selectedTag }),
          }
        );
        const updatedList = await response.json();

        localStorage.setItem("taskList", JSON.stringify(updatedList));

        console.log("Updated list with tag:", updatedList);
        window.location.reload();
      } catch (error) {
        console.error(error);
      }
    };
    fetchTags();
  };

  if (progress === 100) {
    props.setIsExerciseDone(true);
  }

  return (
    <div
      className={
        "coin-container" +
        (progress === 100 || props.name == null ? " disable" : "")
      }
    >
      <div className="coin">ℭ</div>
      <div className="pie-graph-container">
        {props.name ? (
          <div>
            <h1>{props.name}</h1>
            <div className="display-flex">
              <div
                className="pie-graph"
                style={{ "--percentage": `${progress}%` }}
              >
                <div className="pie-center">{progress}%</div>
              </div>
              <div>
                <p className="done">Today done: {doneSets}</p>
                <p className="goal">Today's goal: {props.totalSets}</p>
                {/* <p className="record">Your record</p> */}
                <button
                  onClick={() => props.handleClick(exType)}
                  className={progress === 100 ? "disable" : ""}
                >
                  Do it!
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="new-exercise">
            <Popup
              trigger={
                <button
                  onClick={() => {
                    console.log(tags);
                  }}
                >
                  + Add exercise
                </button>
              }
              modal
              closeOnDocumentClick={false}
              overlayStyle={{
                backgroundColor: "rgba(0, 0, 0, 0.8)",
              }}
              position="right center"
            >
              {(close) => (
                <div className="exercise-popup-content">
                  <h2>Select an Exercise</h2>
                  <input
                    type="search"
                    name="search"
                    id="search-input"
                    placeholder="Search..."
                  />
                  <div className="tag-list">
                    {tags.length > 0 ? (
                      tags.map((tag) => (
                        <div key={tag.value} className="tag-item">
                          <label>{tag.label}</label>
                          <div>
                            <i
                              className={`fa fa-square-${
                                selectedTag === tag.label ? "minus" : "plus"
                              }`}
                              onClick={() => selectedTagHandle(tag.label)}
                            />
                          </div>
                        </div>
                      ))
                    ) : (
                      <p>Loading exercises...</p>
                    )}
                  </div>
                  <div className="modal-footer">
                    <button className="close-btn" onClick={close}>
                      Close
                    </button>
                    <button
                      className="add-btn"
                      onClick={() => {
                        addListTag();
                      }}
                    >
                      Add Exercise
                    </button>
                  </div>
                </div>
              )}
            </Popup>
          </div>
        )}
      </div>
    </div>
  );
}

export default PieGraph;
