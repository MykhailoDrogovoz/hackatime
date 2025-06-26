import { useEffect, useState } from "react";
import "../../App.css";
import PieGraph from "./push-ups/PieGraph";
import Category from "./category/Category";
import { useNavigate } from "react-router-dom";
import List from "./lists/List";
const VITE_API_URL = import.meta.env.VITE_API_URL;

function Home() {
  const [showOptions, setShowOptions] = useState(false);
  const [exType, setExType] = useState(null);
  const [number, setNumber] = useState(0);
  const navigate = useNavigate();
  const [isExerciseDone, setIsExerciseDone] = useState(false);
  const [completedExercises, setCompletedExercises] = useState([]);
  const [userId, setUserId] = useState();

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");

    if (!storedToken) {
      navigate("/login");
    }
  });

  const [tags, setTags] = useState(() => {
    const storedTags = localStorage.getItem("taskList");
    return storedTags ? JSON.parse(storedTags) : { Tags: [] };
  });

  const handleClick = (exType) => {
    // setExType(exType);
    navigate("/options", {
      state: { exType: exType },
    });
  };

  const handleNumber = (number) => {
    setNumber(number);
  };

  const handleExType = (exType) => {
    setExType(exType);
  };

  useEffect(() => {
    const receivedExercises = async () => {
      try {
        const storedToken = localStorage.getItem("authToken");
        const response = await fetch(
          `${VITE_API_URL}tags/get-all-userExercises`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${storedToken}`,
            },
          }
        );

        const data = await response.json();
        setCompletedExercises(data.userExercises);
      } catch (error) {
        console.log(error);
      }
    };

    receivedExercises();
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
        localStorage.setItem("userId", data.user.userId);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUserId();
  });

  const getTagsToRender = () => {
    if (!localStorage.getItem("taskList")) {
      return (
        <div id="charts" className="no-exercises">
          <p>You did not select any list. First of all select a list.</p>
        </div>
      );
    }

    const filteredTags = tags.Tags.filter(
      (tag) =>
        !completedExercises.some((completed) => completed.tagId === tag.tagId)
    ).concat(
      tags.Tags.filter((tag) =>
        completedExercises.some((completed) => completed.tagId === tag.tagId)
      )
    );

    const tagsArray = filteredTags || [];
    const placeholderTags = Array(6 - tagsArray.length).fill({
      name: null,
    });
    return [...tagsArray, ...placeholderTags];
  };

  let allPlaceholders = false;
  const tagsToRender = getTagsToRender();

  if (userId !== tags.userId) {
    allPlaceholders =
      tagsToRender.length === 6 &&
      tagsToRender.every((tag) => tag.name === null);
  }

  if (allPlaceholders) {
    return (
      <div className="home">
        <h1 className="main-title">Exercises</h1>
        <div id="charts" className="no-exercises">
          <p>
            This list does not consist of any exercises, please use another one
          </p>
        </div>
        <div className="full-screen">
          <List />
        </div>
      </div>
    );
  }

  return (
    <div className="home">
      <h1 className="main-title">Exercises</h1>
      <div id="charts">
        {Array.isArray(getTagsToRender()) ? (
          <>
            {getTagsToRender().map((tag, index) => (
              <>
                <PieGraph
                  key={tag.name || `placeholder-${index}`}
                  percentage={0}
                  handleClick={() => handleClick(tag.name)}
                  name={tag.name}
                  totalSets={tag.totalSets}
                  setIsExerciseDone={(bool) => {
                    setIsExerciseDone(bool);
                  }}
                  secondsPerSet={tag.secondsPerSet}
                  totalSeconds={tag.totalSeconds}
                  calories={tag.calories}
                />
              </>
            ))}
          </>
        ) : (
          getTagsToRender()
        )}
      </div>
      {localStorage.getItem("taskList") && (
        <div className="full-screen">
          <Category />
        </div>
      )}

      <div className="full-screen">
        <List />
      </div>
    </div>
  );
}

export default Home;
