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

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");

    if (!storedToken) {
      navigate("/login");
    }
  });

  const [tags, setTags] = useState(() => {
    const storedTags = localStorage.getItem("taskList");
    // console.log(storedTags);
    return storedTags ? JSON.parse(storedTags) : { Tags: [] };
  });

  const handleClick = (exType) => {
    console.log(exType);
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
        // console.log(data);
        setCompletedExercises(data.userExercises);
      } catch (error) {
        console.log(error);
      }
    };

    receivedExercises();
  }, []);

  const getTagsToRender = () => {
    console.log(completedExercises);
    const filteredTags = tags.Tags.filter(
      (tag) =>
        !completedExercises.some((completed) => completed.tagId === tag.tagId)
    ).concat(
      tags.Tags.filter((tag) =>
        completedExercises.some((completed) => completed.tagId === tag.tagId)
      )
    );

    console.log(filteredTags);
    const tagsArray = filteredTags || [];
    const placeholderTags = Array(6 - tagsArray.length).fill({
      name: null,
    });
    return [...tagsArray, ...placeholderTags];
  };

  return (
    <div className="home">
      <h1 className="main-title">Excercises</h1>
      <div id="charts">
        {getTagsToRender().map((tag, index) => (
          <PieGraph
            key={tag.name || `placeholder-${index}`}
            percentage={0}
            handleClick={() => handleClick(tag.name)}
            name={tag.name}
            totalSets={tag.totalSets}
            setIsExerciseDone={(bool) => {
              setIsExerciseDone(bool);
            }}
          />
        ))}
      </div>
      <div className="full-screen">
        <Category />
      </div>
      <div className="full-screen">
        <List />
      </div>
    </div>
  );
}

export default Home;
