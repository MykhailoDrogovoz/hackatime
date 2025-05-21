import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  Text,
} from "recharts";
import "./Category.css";

const data = [
  { category: "aa", minutes: 30 },
  { category: "bb", minutes: 45 },
  { category: "cc", minutes: 25 },
  { category: "dd", minutes: 35 },
];

function Category() {
  return (
    <div className="full-screen">
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
            {/* <Tooltip /> */}
            <Bar
              radius={[0, 10, 10, 0]}
              dataKey="minutes"
              fill="#8884d8"
              name="Physical exercises"
              label={({ y, height, index, width }) => {
                const label = data[index].category;
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
                <div>
                  <Cell key={`cell-${index}`} fill="#8884d8" />
                </div>
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Category;
