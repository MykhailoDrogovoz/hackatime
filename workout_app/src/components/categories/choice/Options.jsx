import { useEffect, useState } from "react";
import "./Options.css";
import WheelWrapper from "../wheel/WheelWrapper";
import DiceWrapper from "../dice/DiceWrapper";
import Randomizer from "../randomizer/Randomizer";
import Card from "../card/CardWrapper";
import Exercise from "../../exercise/Exercise";
import { useLocation, useNavigate } from "react-router-dom";
import Joyride from "react-joyride";

const VITE_API_URL = import.meta.env.VITE_API_URL;

function Options() {
  const location = useLocation();
  const { exType } = location.state || "";
  const [activeTab, setActiveTab] = useState("options");
  const [showOptions, setShowOptions] = useState(true);
  const navigate = useNavigate();
  const [options, setOptions] = useState([]);
  const [userOptions, setUserOptions] = useState([]);
  const [userCoins, setUserCoins] = useState(0);

  // Joyride control
  const [runTour, setRunTour] = useState(false);

  const steps = [
    {
      target: ".options_list",
      content:
        "There are option that will define how many times/seconds you should do proper exercise",
      disableBeacon: true,
    },
    {
      target: ".options_list .fa-lock",
      content:
        "Locked options cost coins. You can unlock them by earning coins!",
      disableBeacon: true,
    },
  ];

  useEffect(() => {
    if (!localStorage.getItem("authToken")) {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    const hasSeenTour = localStorage.getItem("seenOptionsTour");
    if (!hasSeenTour) {
      setRunTour(true);
      localStorage.setItem("seenOptionsTour", "true");
    }
  }, []);

  useEffect(() => {
    const fetchCoins = async () => {
      const response = await fetch(`${VITE_API_URL}user/profile`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      if (response.status === 401) {
        navigate(
          "/login/" +
            ((await response.json().message)
              ? `?error=${(await response.json()).message}`
              : "")
        );
      }
      const data = await response.json();
      setUserCoins(data.user.coins);
    };
    fetchCoins();
  }, []);

  useEffect(() => {
    const receivedOptions = async () => {
      try {
        const storedToken = localStorage.getItem("authToken");

        const response = await fetch(`${VITE_API_URL}games/all`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${storedToken}`,
          },
        });
        if (response.status === 401) {
          navigate(
            "/login/" +
              ((await response.json().message)
                ? `?error=${(await response.json()).message}`
                : "")
          );
        }

        if (response.ok) {
          const data = await response.json();
          const sortedData = data.sort((a, b) => a.coin_cost - b.coin_cost);
          setOptions(sortedData);
        } else {
          console.log("Error fetching options " + response.status);
        }
      } catch (error) {
        console.log(error);
      }
    };
    receivedOptions();
  }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    const receivedUserOptions = async () => {
      try {
        const response = await fetch(`${VITE_API_URL}games/get-user-options`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${storedToken}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setUserOptions(data);
        } else {
          console.log("Error fetching options " + response.status);
        }
      } catch (error) {
        console.log(error);
      }
    };
    receivedUserOptions();
  }, []);

  const handleBack = () => {
    setShowOptions(true);
  };

  const handleTake = (exNumber) => {
    navigate("/exercise", { state: { exType: exType, exNumber: exNumber } });
  };

  const buyOption = async (gameName) => {
    const response = await fetch(`${VITE_API_URL}games/buy-game/${gameName}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    });
    const data = await response.json();
  };

  const renderContent = () => {
    return (
      <div className="tool-view">
        {activeTab === "Roulette" && (
          <WheelWrapper onBack={handleBack} handleTake={handleTake} />
        )}
        {activeTab === "Dice" && (
          <DiceWrapper onBack={handleBack} handleTake={handleTake} />
        )}
        {activeTab === "Randomizer" && (
          <Randomizer onBack={handleBack} handleTake={handleTake} />
        )}
        {activeTab === "Card" && (
          <Card onBack={handleBack} handleTake={handleTake} />
        )}
      </div>
    );
  };

  return (
    <div id="main-frame" className="options">
      <Joyride
        steps={steps}
        run={runTour}
        showSkipButton
        continuous
        styles={{
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
      {showOptions ? (
        <>
          <h2 className="options_title">Options</h2>
          <ol className="options_list">
            {options.map((option) => (
              <li
                key={option.id}
                className={activeTab === option.name ? "active" : ""}
                onClick={() => {
                  if (
                    option.coin_cost > 0 &&
                    !userOptions.some((u) => u.gameId === option.id)
                  ) {
                    if (userCoins >= option.coin_cost) {
                      const confirmBuy = window.confirm(
                        `Are you sure you want to spend ${option.coin_cost} coins?`
                      );
                      if (confirmBuy) buyOption(option.name);
                    } else {
                      alert("You do not have enough coins!");
                    }
                    return;
                  }
                  setActiveTab(option.name);
                  setShowOptions(false);
                }}
                style={{ cursor: "pointer" }}
              >
                {option.name}
                {option.iconClass ? (
                  <i className={option.iconClass}></i>
                ) : option.iconSymbol ? (
                  <span
                    className="fas"
                    dangerouslySetInnerHTML={{ __html: option.iconSymbol }}
                  ></span>
                ) : null}
                {option.coin_cost > 0 &&
                !userOptions.some((u) => u.gameId === option.id) ? (
                  <i className="fas fa-lock"></i>
                ) : null}
              </li>
            ))}
          </ol>
        </>
      ) : (
        renderContent()
      )}
    </div>
  );
}

export default Options;
