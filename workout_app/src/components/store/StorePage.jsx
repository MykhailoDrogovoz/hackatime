import { useEffect, useState } from "react";
import "../../App.css";
import { useNavigate } from "react-router-dom";
import Joyride from "react-joyride";
import StoreItem from "./StoreItem";
const VITE_API_URL = import.meta.env.VITE_API_URL;
import "./Store.css";

function StorePage() {
  return (
    <div className="full-screen list-wrapper" id="store">
      <div className="lists chart-container">
        <h2>Store</h2>
        <div className="storeItems">
          <StoreItem />
          <StoreItem />
          <StoreItem />
          <StoreItem />
        </div>
      </div>
    </div>
  );
}

export default StorePage;
