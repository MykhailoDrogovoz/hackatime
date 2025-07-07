import { useState } from "react";
import "./Leaderboard.css";
import { useEffect } from "react";
import Select from "react-select";
const VITE_API_URL = import.meta.env.VITE_API_URL;

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [firstPlace, setFirstPlace] = useState({});
  const [secondPlace, setSecondPlace] = useState({});
  const [thirdPlace, setThirdPlace] = useState();
  const [time, setTime] = useState("all-time");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [sortedBy, setSortedBy] = useState("calories");

  useEffect(() => {
    console.log("useEffect triggered with time:", time);
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${VITE_API_URL}user/leaderboard/${time}`);
        const data = await response.json();
        setFirstPlace(data.leaderboard[0]);
        setSecondPlace(data.leaderboard[1]);
        setThirdPlace(data.leaderboard[2]);
        setLeaderboard(data.leaderboard.slice(3));
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, [time]);

  const sortLeaderboard = (sortBy) => {
    const sortedLeaderboard = [...leaderboard].sort(
      (a, b) => b[sortBy] - a[sortBy]
    );
    setLeaderboard(sortedLeaderboard);
    setSortedBy(sortBy);
  };

  const options = [
    { value: "calories", label: "Calories" },
    { value: "totalTime", label: "Total Time" },
  ];

  const colourStyles = {
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
      console.log({ data, isDisabled, isFocused, isSelected });

      return {
        ...styles,
        backgroundColor: isFocused
          ? isSelected
            ? "#63856a"
            : "#63856a66"
          : isSelected
          ? "#63856a"
          : null,
        color: isSelected ? "#fff" : "#000",
        cursor: isDisabled ? "not-allowed" : "pointer",
        fontWeight: isSelected ? "bold" : "normal",
      };
    },
    control: (styles) => ({
      ...styles,
      border: "none",
      boxShadow: "none",
      borderRadius: "5px",
    }),
  };

  const handleSortChange = (selectedOption) => {
    sortLeaderboard(selectedOption.value);
  };

  const handleClear = () => {
    setTime("all-time");
    setSortedBy("calories");
    setError(null);
  };

  return (
    <div className="coin-container-cong full-screen">
      <div className="leaderboard">
        <h2>Leaderboard</h2>
        <div className="leaderboard-header">
          <div className="leaderboard-select-mobile">
            <Select
              isSearchable={false}
              value={options.find((option) => option.value === sortedBy)}
              onChange={handleSortChange}
              options={options}
              styles={colourStyles}
              className="sort-dropdown"
              classNamePrefix="select"
            />
            <p className="paragraph-1 clear">Clear</p>
          </div>
          <div className="time-container item">
            <div
              className={"paragraph-1 " + (time === "daily" && "main")}
              onClick={() => {
                setTime("daily");
              }}
            >
              Daily
            </div>
            <div
              className={"paragraph-1 " + (time === "last-week" && "main")}
              onClick={() => {
                setTime("last-week");
              }}
            >
              Last week
            </div>
            <div
              className={"paragraph-1 " + (time === "all-time" && "main")}
              onClick={() => {
                setTime("all-time");
              }}
            >
              All time
            </div>
          </div>
          <p
            className="paragraph-1 clear"
            onClick={() => {
              handleClear();
            }}
          >
            Clear
          </p>
        </div>
        <div className="top-3">
          {thirdPlace && (
            <div className="stage-element third">
              {thirdPlace.profileImage ? (
                <img
                  src={thirdPlace.profileImage}
                  alt=""
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: "50%",
                    objectFit: "cover",
                    margin: "20px auto",
                    border: "2px solid #fff",
                  }}
                />
              ) : (
                <i className="fa fa-user-circle"></i>
              )}
              <div>
                <h2>3</h2>
                <h3>{thirdPlace.username}</h3>
                <h3>
                  {sortedBy === "calories"
                    ? thirdPlace.calories + " cal"
                    : thirdPlace.totalTime + " sec"}
                </h3>
              </div>
            </div>
          )}
          {firstPlace && (
            <div className="stage-element first">
              <i className="fa fa-crown"></i>
              {firstPlace.profileImage ? (
                <img
                  src={firstPlace.profileImage}
                  alt=""
                  style={{
                    width: 100,
                    height: 150,
                    borderRadius: "50%",
                    objectFit: "cover",
                    margin: "10px auto 20px",
                    border: "2px solid #fff",
                  }}
                />
              ) : (
                <i className="fa fa-user-circle"></i>
              )}
              <div>
                <h2>1</h2>
                <h3>{firstPlace.username}</h3>
                <h3>
                  {sortedBy === "calories"
                    ? firstPlace.calories + " cal"
                    : firstPlace.totalTime + " sec"}
                </h3>
              </div>
            </div>
          )}

          {secondPlace && (
            <div className="stage-element second">
              {console.log(secondPlace)}
              {secondPlace.profileImage ? (
                <img
                  src={secondPlace.profileImage}
                  alt=""
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: "50%",
                    objectFit: "cover",
                    margin: "20px auto",
                    border: "2px solid #fff",
                  }}
                />
              ) : (
                <i className="fa fa-user-circle"></i>
              )}
              <div>
                <h2>2</h2>
                <h3>{secondPlace.username}</h3>
                <h3>
                  {sortedBy === "calories"
                    ? secondPlace.calories + " cal"
                    : secondPlace.totalTime + " sec"}
                </h3>
              </div>
            </div>
          )}
        </div>
        {leaderboard.length > 0 && (
          <>
            <table>
              <tr>
                <th>Username</th>
                <th>Total time</th>
                <th>Calories</th>
              </tr>
              {leaderboard.map((user) => {
                return (
                  <tr key={user.username}>
                    <td>{user.username}</td>
                    <td>{user.totalTime}</td>
                    <td>{user.calories}</td>
                  </tr>
                );
              })}
            </table>
            {totalPages > 1 && (
              <div className="buttons">
                <i className="fa fa-chevron-left"></i>
                <i className="fa fa-chevron-right"></i>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
