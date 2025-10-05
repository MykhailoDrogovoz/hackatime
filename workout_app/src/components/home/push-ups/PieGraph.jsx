import "./PieGraph.css";
import { useEffect, useState } from "react";
import Popup from "reactjs-popup";
const VITE_API_URL = import.meta.env.VITE_API_URL;

function PieGraph(props) {
  const exType = "Pushups";

  const [tags, setTags] = useState(0);

  const [doneSets, setDoneSets] = useState([]);

  const [progress, setProgress] = useState(0);

  const [userId, setUserId] = useState();
  const taskList = JSON.parse(localStorage.getItem("taskList")) || [];

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
        setProgress(
          Math.round(
            (data.userExercise.setsCompleted /
              (props.totalSeconds
                ? props.totalSeconds * props.totalSets
                : props.totalSets)) *
              100
          )
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

        setTags(formattedOptions);
      } catch (error) {
        console.error(error);
      }
    };
    fetchTags();
  }, []);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await fetch(`${VITE_API_URL}user/profile`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        const data = await response.json();
        setUserId(data.user.userId);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUserId();
  });

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

  const disable_do_it = () => {
    if (progress === 100) {
      alert("You already have completed all sets of this exercise!");
    } else {
      props.handleClick(exType);
    }
  };

  return (
    <div
      className={
        "coin-container" +
        (progress >= 100 || props.name == null ? " disable" : "")
      }
    >
      <img
        src={
          progress >= 100 || props.name == null
            ? "/coin_disable.svg"
            : "/coin.svg"
        }
        alt="coins"
        className="coin-img coin"
      />

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
                <p className="goal">
                  Today's goal:{" "}
                  {props.totalSeconds
                    ? props.totalSeconds *
                        props.totalSets *
                        props.secondsPerSet +
                      " seconds"
                    : props.totalSets + " times"}
                </p>
                <p className="record">
                  Calories per time: {props.calories} cal
                </p>
                <button
                  onClick={() => {
                    progress >= 100
                      ? disable_do_it(exType)
                      : props.handleClick(exType);
                  }}
                  className={progress >= 100 ? "disable" : ""}
                >
                  Do it!
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="new-exercise">
            {taskList.userId === userId ? (
              <Popup
                trigger={<button>+ Add exercise</button>}
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
            ) : (
              <div>
                <p>You do not have access to add new exercise</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default PieGraph;
