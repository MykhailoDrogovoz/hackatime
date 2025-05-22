import { Link } from "react-router-dom";
import "./List.css";

function List() {
  return (
    <div className="lists chart-container">
      <div className="new-list-button">
        <h2>Your lists</h2>
        <button>
          <Link to="/new-list">+ Add new list </Link>
        </button>
      </div>
      <div className="lists-container">
        <div className="list">
          <div className="list-header">
            <i className="fa fa-pen"></i>
            <i className="fa fa-trash"></i>
          </div>
          <div className="list-body">
            <p>Title:</p>
            <h4>Morning warm-up</h4>
          </div>
          <div className="list-body">
            <p>Total time:</p>
            <h4>20 minutes</h4>
          </div>
          <button id="list-take">Take</button>
        </div>
        <div className="list">
          <div className="list-header">
            <i className="fa fa-pen"></i>
            <i className="fa fa-trash"></i>
          </div>
          <div className="list-body">
            <p>Title:</p>
            <h4>Morning warm-up</h4>
          </div>
          <div className="list-body">
            <p>Total time:</p>
            <h4>20 minutes</h4>
          </div>
          <button id="list-take">Take</button>
        </div>
        <div className="list">
          <div className="list-header">
            <i className="fa fa-pen"></i>
            <i className="fa fa-trash"></i>
          </div>
          <div className="list-body">
            <p>Title:</p>
            <h4>Morning warm-up</h4>
          </div>
          <div className="list-body">
            <p>Total time:</p>
            <h4>20 minutes</h4>
          </div>
          <button id="list-take">Take</button>
        </div>
        <div className="list">
          <div className="list-header">
            <i className="fa fa-pen"></i>
            <i className="fa fa-trash"></i>
          </div>
          <div className="list-body">
            <p>Title:</p>
            <h4>Morning warm-up</h4>
          </div>
          <div className="list-body">
            <p>Total time:</p>
            <h4>20 minutes</h4>
          </div>
          <button id="list-take">Take</button>
        </div>
        <div className="list">
          <div className="list-header">
            <i className="fa fa-pen"></i>
            <i className="fa fa-trash"></i>
          </div>
          <div className="list-body">
            <p>Title:</p>
            <h4>Morning warm-up</h4>
          </div>
          <div className="list-body">
            <p>Total time:</p>
            <h4>20 minutes</h4>
          </div>
          <button id="list-take">Take</button>
        </div>
      </div>
    </div>
  );
}

export default List;
