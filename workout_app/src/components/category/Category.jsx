import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import './Category.css'

const data = [
  { category: "aa", minutes: 30 },
  { category: "bb", minutes: 45 },
  { category: "cc", minutes: 25 },
  { category: "dd", minutes: 35 },
];

function Category() {
    return(
        <div className='chart-container'>
            <h1 className="chart-title">Physical activities</h1>
            
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis dataKey="category"/>
                    <YAxis label={{value: 'Minutes', angle: -90, position:'insideLeft'}}/>
                    <Tooltip/>
                    <Legend/>
                    <Bar dataKey="minutes" fill="#8884d8" name="Physical excercises"/>
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}

export default Category