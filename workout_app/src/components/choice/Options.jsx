import { useState } from "react";
import "./Options.css";
import WheelWrapper from "../wheel/WheelWrapper";
import DiceWrapper from "../dice/DiceWrapper";
import Randomizer from "../randomizer/Randomizer";
import Card from "../card/CardWrapper";

function Options() {
  const [activeTab, setActiveTab] = useState("options");
  const [showOptions, setShowOptions] = useState(true);

  const handleBack = () => {
    setShowOptions(true);
  };

  const renderContent = () => {
    return (
      <div className="tool-view">
        {activeTab === "roulette" && <WheelWrapper onBack={handleBack} />}
        {activeTab === "dice" && <DiceWrapper onBack={handleBack} />}
        {activeTab === "randomizer" && <Randomizer onBack={handleBack} />}
        {activeTab === "card" && <Card onBack={handleBack} />}
      </div>
    );
  };

  return (
    <div id="main-frame">
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
