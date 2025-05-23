import { useState } from "react";
import "./Leaderboard.css";

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("score");
  const [order, setOrder] = useState("desc");
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

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
          <div className="stage-element third">
            <i className="fa fa-user-circle"></i>
            <div>
              <h2>3</h2>
              <h3>User 3</h3>
              <h3>9021 cal</h3>
            </div>
          </div>
          <div className="stage-element first">
            <i className="fa fa-crown"></i>
            <i className="fa fa-user-circle"></i>
            <div>
              <h2>1</h2>
              <h3>User 3</h3>
              <h3>9021 cal</h3>
            </div>
          </div>
          <div className="stage-element second">
            <i className="fa fa-user-circle"></i>
            <div>
              <h2>2</h2>
              <h3>User 3</h3>
              <h3>9021 cal</h3>
            </div>
          </div>
        </div>
        <table>
          <tr>
            <th>Username</th>
            <th>Total time</th>
            <th>Calories</th>
          </tr>
          <tr>
            <td>Maria Anders</td>
            <td>5021 h</td>
            <td>9000</td>
          </tr>
          <tr>
            <td>Francisco Chang</td>
            <td>5021 h</td>
            <td>8000</td>
          </tr>
          <tr>
            <td>Roland Mendel</td>
            <td>5021 h</td>
            <td>7000</td>
          </tr>
          <tr>
            <td>Helen Bennett</td>
            <td>5021 h</td>
            <td>6000</td>
          </tr>
          <tr>
            <td>Helen Bennett</td>
            <td>5021 h</td>
            <td>6000</td>
          </tr>
          <tr>
            <td>Helen Bennett</td>
            <td>5021 h</td>
            <td>6000</td>
          </tr>
          <tr>
            <td>Helen Bennett</td>
            <td>5021 h</td>
            <td>6000</td>
          </tr>
          <tr>
            <td>Helen Bennett</td>
            <td>5021 h</td>
            <td>6000</td>
          </tr>
        </table>
        <div className="buttons">
          <i className="fa fa-chevron-left"></i>
          <i className="fa fa-chevron-right"></i>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
