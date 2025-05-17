import { useState } from "react";
import "./Options.css";
import WheelWrapper from "../wheel/WheelWrapper";
import DiceWrapper from "../dice/DiceWrapper";
import Randomizer from "../randomizer/Randomizer";
import Card from "../card/CardWrapper";
import Exercise from "../../exercise/Exercise";
import { useLocation, useNavigate, useParams } from "react-router-dom";

function Options() {
  const location = useLocation();
  const { exType } = location.state || "";
  console.log(exType);
  const [activeTab, setActiveTab] = useState("options");
  const [showOptions, setShowOptions] = useState(true);
  const navigate = useNavigate();

  const handleBack = () => {
    setShowOptions(true);
  };

  const handleTake = (exNumber) => {
    navigate("/exercise", { state: { exType: exType, exNumber: exNumber } });
  };

  const renderContent = () => {
    return (
      <div className="tool-view">
        {activeTab === "roulette" && (
          <WheelWrapper onBack={handleBack} handleTake={handleTake} />
        )}
        {activeTab === "dice" && (
          <DiceWrapper onBack={handleBack} handleTake={handleTake} />
        )}
        {activeTab === "randomizer" && (
          <Randomizer onBack={handleBack} handleTake={handleTake} />
        )}
        {activeTab === "card" && (
          <Card onBack={handleBack} handleTake={handleTake} />
        )}
      </div>
      // <Exercise exType={props.exType}></Exercise>
    );
  };

  return (
    <div id="main-frame" className="options">
      {showOptions ? (
        <>
          <h2 className="options_title">Options</h2>
          <ol className="options_list">
            <li
              className={activeTab === "roulette" ? "active" : ""}
              onClick={() => {
                setActiveTab("roulette");
                setShowOptions(false);
              }}
              style={{ cursor: "pointer" }}
            >
              Roulette <i className="fas fa-bullseye"></i>
            </li>
            <li
              className={activeTab === "dice" ? "active" : ""}
              onClick={() => {
                setActiveTab("dice");
                setShowOptions(false);
              }}
              style={{ cursor: "pointer" }}
            >
              Dice <i className="fas fa-dice"></i>
            </li>
            <li
              className={activeTab === "randomizer" ? "active" : ""}
              onClick={() => {
                setActiveTab("randomizer");
                setShowOptions(false);
              }}
              style={{ cursor: "pointer" }}
            >
              Randomizer <i className="fas fa-random"></i>
            </li>
            <li
              className={activeTab === "randomizer" ? "active" : ""}
              onClick={() => {
                setActiveTab("card");
                setShowOptions(false);
              }}
              style={{ cursor: "pointer" }}
            >
              Card <span className="fas">&#127136;</span>
            </li>
          </ol>
        </>
      ) : (
        renderContent()
      )}
    </div>
  );
}

export default Options;
