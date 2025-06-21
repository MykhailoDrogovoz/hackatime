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
const VITE_API_URL = import.meta.env.VITE_API_URL;

function Category() {
  const [data, setData] = useState([]);

  const fetchDoneSets = async (tagName) => {
    const storedToken = localStorage.getItem("authToken");
    const response = await fetch(`${VITE_API_URL}tags/get-sets/${tagName}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${storedToken}`,
      },
    });
    if (!response.ok) return 0;

    const data = await response.json();
    return data.userExercise?.setsCompleted || 0.5;
  };

  useEffect(() => {
    const taskList = JSON.parse(localStorage.getItem("taskList"));

    const fetchAllData = async () => {
      if (taskList?.Tags) {
        const newData = await Promise.all(
          taskList.Tags.map(async (tag) => {
            const minutes = await fetchDoneSets(tag.name);
            return {
              category: tag.name,
              minutes: minutes,
            };
          })
        );
        setData(newData);
      }
    };

    fetchAllData();
  }, []);

  return (
    <div className="chart-container">
      <h1 className="chart-title">Physical activities</h1>

      <ResponsiveContainer width="100%" height={200}>
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
            label={({ x, y, height, index, width, value }) => {
              const label = data[index]?.category || "";
              return (
                <text
                  y={y + height / 2}
                  fill="black"
                  textAnchor="start"
                  dominantBaseline="middle"
                  fontSize={12}
                >
                  {label.split(" ").map((word, i) => (
                    <tspan key={i} x={7} dy={i === 0 ? 0 : "1.2em"}>
                      {word}
                    </tspan>
                  ))}
                </text>
              );
            }}
          >
            {data.map((entry, index) => (
              <Cell x={100} key={`cell-${index}`} fill="#8884d8" />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default Category;
