import { Box } from "@mui/material";
import React, { useEffect } from "react";
import './RouletteWheel.css'

export default function RouletteWheel() {

  useEffect(() => {
    const container = document.querySelector(".container");
    const btn = document.getElementById("spin");
    let number = Math.ceil(Math.random() * 10000);

    btn.onclick = function () {
      container.style.transform = "rotate(" + number + "deg)";
      number += Math.ceil(Math.random() * 10000);
    };
  }, []);

  return (
    <div>
      <button id="spin">Girar</button>
      <span className="arrow"></span>
      <div className="container">
        <div className="one">1</div>
        <div className="two">2</div>
        <div className="three">3</div>
        <div className="four">4</div>
        <div className="five">5</div>
        <div className="six">6</div>
        <div className="seven">7</div>
        <div className="eight">8</div>
      </div>
    </div>
  );
}