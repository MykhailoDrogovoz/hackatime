import { useEffect, useState } from "react";
import "../../App.css";
import { useNavigate } from "react-router-dom";
import Joyride from "react-joyride";
const VITE_API_URL = import.meta.env.VITE_API_URL;

function StoreItem() {
  return (
    <div className="storeItem">
      <div>
        Name
        <span>Price</span>
      </div>
      <div className="img">
        <img
          src="https://pics.clipartpng.com/Pile_of_Coins_PNG_Clip_Art-1995.png"
          alt=""
        />
      </div>
      <button>Buy</button>
    </div>
  );
}

export default StoreItem;
