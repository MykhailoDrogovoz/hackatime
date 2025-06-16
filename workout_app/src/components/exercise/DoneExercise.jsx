import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./DoneExercise.css";

const VITE_API_URL = import.meta.env.VITE_API_URL;

function Exercise() {
  const location = useLocation();
  const navigate = useNavigate();
  const { exType, exNumber } = location.state || {};
  const [reward, setReward] = useState(false);
  const [coins, setCoins] = useState(() => {
    return JSON.parse(localStorage.getItem("userCoins")) || 0;
  });
  const [exerciseCoins, setExerciseCoins] = useState();
  const [hasCompleted, setHasCompleted] = useState(false);

  const [completedExercises, setCompletedExercises] = useState([]);

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

  // Check if reward has been claimed (use localStorage to persist across refreshes)
  useEffect(() => {
    if (localStorage.getItem(`rewardClaimed_${exType}`)) {
      setReward(false);
    } else {
      if (exNumber && !hasCompleted) {
        completeSet(exNumber, exType);
      }
    }
  }, [exType, exNumber, hasCompleted]);

  // Fetch user data and coin balance
  useEffect(() => {
    const fetchUserData = async () => {
      const storedToken = localStorage.getItem("authToken");

      if (!storedToken) return;

      try {
        const response = await fetch(`${VITE_API_URL}user/profile`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${storedToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setCoins(data.user.coins); // Set the coins from the backend
        } else {
          console.error("Failed to fetch user data:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const completeSet = async (exNumber, exType) => {
    const storedToken = localStorage.getItem("authToken");
    const tagId = JSON.parse(localStorage.getItem("taskList")).Tags.find(
      (ex) => ex.name === exType
    ).tagId;
    if (!storedToken) {
      console.error("User is not authenticated!");
      return;
    }

    try {
      const setsCompleted = exNumber;
      const response = await fetch(`${VITE_API_URL}tags/complete-set`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedToken}`,
        },
        body: JSON.stringify({ setsCompleted, tagId }),
      });

      if (!response.ok) {
        console.error("Error completing the set:", response.statusText);
        return;
      }

      const data = await response.json();
      console.log("Set completed:", data);
      if (data.coins) {
        setReward(true);
        setExerciseCoins(data.coins);
      }
      setHasCompleted(true);
    } catch (error) {
      console.error("Error completing set:", error);
    }
  };

  // Reward coins for completing all sets
  const handleCoinReward = async () => {
    const newCoinBalance = coins + exerciseCoins;
    setCoins(newCoinBalance);

    localStorage.setItem("userCoins", JSON.stringify(newCoinBalance));

    const storedToken = localStorage.getItem("authToken");

    if (!storedToken) {
      console.error("User is not authenticated!");
      return;
    }

    try {
      const response = await fetch(`${VITE_API_URL}tags/claim-reward`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedToken}`,
        },
        body: JSON.stringify({ coins: exerciseCoins }),
      });

      if (response.ok) {
        const data = await response.json();
        setReward(false);
        localStorage.setItem(`rewardClaimed_${exType}`, "true");
        window.dispatchEvent(new Event("coinsUpdated"));
        console.log("Coins successfully updated:", data);
      } else {
        console.error(
          "Failed to update coins in the database:",
          response.statusText
        );
      }
    } catch (error) {
      console.error("Error updating coins:", error);
    }
  };

  const handleNext = () => {
    const taskList = JSON.parse(localStorage.getItem("taskList"));
    const tags = taskList?.Tags || [];

    const filteredTags = tags.filter(
      (tag) =>
        !completedExercises.some((completed) => completed.tagId === tag.tagId)
    );

    console.log(filteredTags);
    const currentIndex = filteredTags.findIndex((tag) => tag.name === exType);

    if (currentIndex !== -1 && currentIndex < filteredTags.length - 1) {
      const nextExercise = filteredTags[currentIndex + 1];
      console.log(nextExercise);
      // Redirect to the next exercise
      navigate("/options", {
        state: { exType: nextExercise.name },
      });
    } else {
      alert("No more exercises!");
    }
  };

  return (
    <div id="main-frame" className="exercise-frame done">
      <div>
        <h2>Congratulations!</h2>
        <p>You have completed all {exType} exercises.</p>

        {reward && (
          <div className="coin-container-cong">
            <p>You have earned {exerciseCoins} coins!</p>
            <img src="/coin.png" alt="coin" />
            <p onClick={handleCoinReward}>Take your reward</p>
          </div>
        )}

        <button>
          <Link to="/">Home</Link>
        </button>
        <button className="main-button" onClick={handleNext}>
          Next
        </button>
      </div>
    </div>
  );
}

export default Exercise;
