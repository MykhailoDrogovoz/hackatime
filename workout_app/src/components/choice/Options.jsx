import { useState } from "react";
import "./Options.css";
import WheelWrapper from "../wheel/WheelWrapper";
import DiceWrapper from "../dice/DiceWrapper";
import Randomizer from "../randomizer/Randomizer";

function Options() {
    const [activeTab, setActiveTab] = useState("options");

    const renderContent = () => {
      switch (activeTab) {
        case "Roulette":
          return <WheelWrapper />;
        case "dice":
          return DiceWrapper;
        case "randomizer":
          return <Randomizer />;
        default:
          return <Options />;
      }
    };

  return (
    <>
      <div>
        <h2 className="account__title">Account</h2>
        <ol>
          <li
            className={activeTab === "roulette" ? "active" : ""}
            onClick={() => setActiveTab("roulette")}
            style={{ cursor: "pointer" }}
          >
            <i className="fa fa-roulette"></i>
            Roulette
          </li>
          <li
            className={activeTab === "dice" ? "active" : ""}
            onClick={() => setActiveTab("dice")}
            style={{ cursor: "pointer" }}
          >
            <i className="fa fa-dice"></i>
            Dice
          </li>
          <li
            className={activeTab === "randomizer" ? "active" : ""}
            onClick={() => setActiveTab("randomizer")}
            style={{ cursor: "pointer" }}
          >
            <i className="fa fa-heart"></i>
            Randomizer
          </li>
        </ol>
      </div>
      <div>{renderContent()}</div>
    </>
  );
}

export default Options;
