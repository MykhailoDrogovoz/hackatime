import { useEffect, useState } from "react";
import "../../App.css";
import PieGraph from "./push-ups/PieGraph";
import Category from "./category/Category";
import { useNavigate } from "react-router-dom";
import List from "./lists/List";

function Home() {
  const [showOptions, setShowOptions] = useState(false);
  const [exType, setExType] = useState(null);
  const [number, setNumber] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");

    if (!storedToken) {
      navigate("/login");
    }
  });

  const [tags, setTags] = useState(() => {
    const storedTags = localStorage.getItem("taskList");
    // console.log(storedTags);
    return storedTags ? JSON.parse(storedTags) : { Tags: [] }; // Ensure tags is an object with Tags array
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

  const getTagsToRender = () => {
    const tagsArray = tags.Tags || [];
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
            key={index}
            percentage={0}
            handleClick={() => handleClick(tag.name)}
            name={tag.name}
            totalSets={tag.totalSets}
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
