import { useState } from "react";
import "./Leaderboard.css";
import { useEffect } from "react";
const VITE_API_URL = import.meta.env.VITE_API_URL;

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [firstPlace, setFirstPlace] = useState({});
  const [secondPlace, setSecondPlace] = useState({});
  const [thirdPlace, setThirdPlace] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("score");
  const [order, setOrder] = useState("desc");
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${VITE_API_URL}user/leaderboard`);
        const data = await response.json();
        console.log(data.sortedUsers);
        setFirstPlace(data.sortedUsers[0]);
        setSecondPlace(data.sortedUsers[1]);
        setThirdPlace(data.sortedUsers[2]);
        setLeaderboard(data.sortedUsers.slice(3));
        // setTotal(data.total);
        // setTotalPages(Math.ceil(data.total / limit));
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  return (
    <div className="coin-container-cong">
      <div className="leaderboard">
        <h2>Leaderboard</h2>
        <div className="leaderboard-header">
          <div className="item paragraph-1 sorted">
            Sorted by: Calories
            <i className="fa fa-chevron-down"></i>
          </div>
          <div className="time-container item">
            <div className="paragraph-1 main">Daily</div>
            <div className="paragraph-1">Last week</div>
            <div className="paragraph-1">All time</div>
          </div>
          <p className="paragraph-1">Filter</p>
          <p className="paragraph-1 clear">Clear</p>
        </div>
        <div className="top-3">
          {thirdPlace && (
            <div className="stage-element third">
              <i className="fa fa-user-circle"></i>
              <div>
                <h2>3</h2>
                <h3>{thirdPlace.username}</h3>
                <h3>{thirdPlace.calories} cal</h3>
              </div>
            </div>
          )}
          {firstPlace && (
            <div className="stage-element first">
              <i className="fa fa-crown"></i>
              <i className="fa fa-user-circle"></i>
              <div>
                <h2>1</h2>
                <h3>{firstPlace.username}</h3>
                <h3>{firstPlace.calories} cal</h3>
              </div>
            </div>
          )}

          {secondPlace && (
            <div className="stage-element second">
              <i className="fa fa-user-circle"></i>
              <div>
                <h2>2</h2>
                <h3>{secondPlace.username}</h3>
                <h3>{secondPlace.calories} cal</h3>
              </div>
            </div>
          )}
        </div>
        {leaderboard.length > 0 && (
          <>
            {console.log(leaderboard)}
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
                    <td>5021 h</td>
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
