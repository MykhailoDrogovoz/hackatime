import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import PieGraph from './components/push-ups/PieGraph'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div id="main-frame">
        <PieGraph percentage={0}></PieGraph>
        <PieGraph percentage={25}></PieGraph>
        <PieGraph percentage={50}></PieGraph>
        <PieGraph percentage={65}></PieGraph>
        <PieGraph percentage={75}></PieGraph>
        <PieGraph percentage={100}></PieGraph>
      </div>
    </>
  );
}

export default App
