import { useState } from "react";
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

  const handleClick = (exType) => {
    console.log(exType);
    setExType(exType);
    navigate("/options", { state: { exType: exType } });
  };

  const handleNumber = (number) => {
    setNumber(number);
  };

  const handleExType = (exType) => {
    setExType(exType);
  };

  return (
    <div className="home">
      <h1 className="main-title">Excercises</h1>
      <div id="charts">
        <PieGraph percentage={0} handleClick={handleClick}></PieGraph>
        <PieGraph percentage={25} handleClick={handleClick}></PieGraph>
        <PieGraph percentage={50} handleClick={handleClick}></PieGraph>
        <PieGraph percentage={65} handleClick={handleClick}></PieGraph>
        <PieGraph percentage={75} handleClick={handleClick}></PieGraph>
        <PieGraph percentage={100} handleClick={handleClick}></PieGraph>
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
