import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
} from "recharts";
import "./Category.css";
import { useEffect, useState } from "react";

function Category() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const taskList = JSON.parse(localStorage.getItem("taskList"));
    if (taskList?.Tags) {
      const newData = taskList.Tags.map((tag) => ({
        category: tag.name,
        minutes: 20, // You can change this to the actual time if available
      }));
      setData(newData);
    }
  }, []);

  return (
    <div className="chart-container">
      <h1 className="chart-title">Physical activities</h1>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} layout="vertical">
          <XAxis type="number" axisLine={false} tick={false} label={false} />
          <YAxis
            dataKey="category"
            type="category"
            axisLine={false}
            tick={false}
          />
          <Bar
            radius={[0, 10, 10, 0]}
            dataKey="minutes"
            fill="#8884d8"
            name="Physical exercises"
            label={({ y, height, index, width }) => {
              const label = data[index]?.category || "";
              return (
                <text
                  x={width - 10}
                  y={y + height / 2}
                  fill="white"
                  textAnchor="end"
                  dominantBaseline="middle"
                  fontSize={14}
                >
                  {label}
                </text>
              );
            }}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill="#8884d8" />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default Category;
