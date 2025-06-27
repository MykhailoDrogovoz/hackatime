import { useEffect, useState } from "react";
import "../../App.css";
import PieGraph from "./push-ups/PieGraph";
import Category from "./category/Category";
import { useNavigate } from "react-router-dom";
import List from "./lists/List";
import Joyride from "react-joyride";
const VITE_API_URL = import.meta.env.VITE_API_URL;

function Home() {
  const [runTour, setRunTour] = useState(false);
  const [exType, setExType] = useState(null);
  const [number, setNumber] = useState(0);
  const navigate = useNavigate();
  const [isExerciseDone, setIsExerciseDone] = useState(false);
  const [completedExercises, setCompletedExercises] = useState([]);
  const [userId, setUserId] = useState();
  const [stepIndex, setStepIndex] = useState(0);
  const taskList = localStorage.getItem("taskList");
  const hasTaskList = !!taskList;

  const noListTourSeen = localStorage.getItem("seenNoListTour");
  const hasListTourSeen = localStorage.getItem("seenHasListTour");

  const steps = hasTaskList
    ? hasListTourSeen
      ? [] // Don't run any steps if already seen
      : [
          {
            target: "#charts",
            content: "Welcome! Let's take a quick tour of your dashboard.",
            disableBeacon: true,
          },
          {
            target: ".pie-graph-container",
            content:
              "Here are your exercises data. You can view the pie chart to see the distribution of your exercises.",
            disableBeacon: true,
          },
          {
            target: ".chart-container",
            content:
              "This section shows your progress in different exercise in this list.",
            disableBeacon: true,
          },
        ]
    : noListTourSeen
    ? []
    : [
        {
          target: ".list-wrapper",
          content:
            "To begin, you need to select or create a list. Please click on a list to activate it.",
          disableBeacon: true,
        },
        {
          target: ".add-list",
          content:
            "Don’t see a list you like? You can create your own for 100 coins.",
          disableBeacon: true,
        },
        {
          target: ".first-list",
          content: "Select a list to start",
          disableBeacon: true,
        },
      ];

  const handleJoyrideCallback = (data) => {
    const { status, index, type } = data;

    if (["finished", "skipped"].includes(status)) {
      setRunTour(false);
      if (hasTaskList) {
        localStorage.setItem("seenHasListTour", true);
      } else {
        localStorage.setItem("seenNoListTour", true);
      }
      setStepIndex(0);
    } else if (type === "step:after") {
      setStepIndex(index + 1);
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    if (!storedToken) {
      navigate("/login");
    }
  }, []);

  const [tags, setTags] = useState(() => {
    const storedTags = localStorage.getItem("taskList");
    return storedTags ? JSON.parse(storedTags) : { Tags: [] };
  });

  const handleClick = (exType) => {
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
  }, []);

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

  useEffect(() => {
    const seenNoListTour = localStorage.getItem("seenNoListTour");
    const seenHasListTour = localStorage.getItem("seenHasListTour");

    const shouldRunTour =
      (!hasTaskList && !seenNoListTour) || (hasTaskList && !seenHasListTour);

    if (shouldRunTour) {
      setTimeout(() => {
        setRunTour(true);
      }, 100);
    }
  }, [tags]);

  return (
    <div className="home">
      <Joyride
        steps={steps}
        run={runTour}
        autoStart={true}
        stepIndex={stepIndex}
        callback={handleJoyrideCallback}
        continuous
        showProgress
        showSkipButton
        styles={{
          options: {
            zIndex: 10000,
          },
          buttonNext: {
            backgroundColor: "#ff4d4f",
            color: "#fff",
            padding: "8px 16px",
            borderRadius: "6px",
            cursor: "pointer",
            boxShadow: "none",
            height: "auto",
            width: "auto",
          },
          buttonBack: {
            color: "#999",
            marginRight: "10px",
            cursor: "pointer",
            boxShadow: "none",
            height: "auto",
            width: "auto",
          },
          buttonSkip: {
            color: "#bbb",
            cursor: "pointer",
            boxShadow: "none",
            height: "auto",
            width: "auto",
            margin: 0,
          },
          buttonClose: {
            color: "#ff4d4f",
            cursor: "pointer",
            boxShadow: "none",
            margin: 0,
            fontSize: "16px",
            textAlign: "right",
          },
        }}
      />

      {hasTaskList && (
        <>
          <h1 className="main-title">Exercises</h1>
          <div id="charts">
            {Array.isArray(tagsToRender) ? (
              <>
                {tagsToRender.map((tag, index) => (
                  <PieGraph
                    key={tag.name || `placeholder-${index}`}
                    percentage={0}
                    handleClick={() => handleClick(tag.name)}
                    name={tag.name}
                    totalSets={tag.totalSets}
                    setIsExerciseDone={(bool) => setIsExerciseDone(bool)}
                    secondsPerSet={tag.secondsPerSet}
                    totalSeconds={tag.totalSeconds}
                    calories={tag.calories}
                  />
                ))}
              </>
            ) : (
              tagsToRender
            )}
          </div>
        </>
      )}

      {hasTaskList && (
        <div className="full-screen category-wrapper">
          <Category />
        </div>
      )}

      <div className="full-screen list-wrapper">
        <List />
      </div>
    </div>
  );
}

export default Home;
