import "./PieGraph.css"

function PieGraph(props) {
    return (
      <div className="coin-container">
        <div className="pie-graph-container">
          <h1>Pushups</h1>
          <div className="pie-graph" style={{'--percentage': `${props.percentage}%`}}>
            <div className="pie-center">{props.percentage}%</div>
          </div>
          <div>
            <p className="done">Today done:</p>
            <p className="goal">Today's goal</p>
            <p className="record">Your record</p>
            <button>Do it!</button>
          </div>
        </div>
        <div className="coin">ℭ</div>
      </div>
    );
}

export default PieGraph