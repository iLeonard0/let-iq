import { Box, Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import "./RouletteWheel.css";
import { useRouter } from "next/router";

export default function RouletteWheel() {
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [spinning, setSpinning] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const btn = document.getElementById("spin");
    const container = document.querySelector(".container");
    let number = Math.ceil(Math.random() * 10000);

    btn.onclick = function () {
      if (!spinning) {
        setSpinning(true);
        container.style.transition = "transform 3s ease-out";
        container.style.transform = "rotate(" + number + "deg)";

        setTimeout(() => {
          const selected = determineNumber(number % 360);
          setSelectedNumber(selected);
          setSpinning(false);
        }, 3000);

        number += Math.ceil(Math.random() * 10000);
      }
    };
  }, [spinning]);

  function determineNumber(degrees) {
    const sectorSize = 360 / 8; 
    return Math.floor(degrees / sectorSize) + 1;
  }

  return (
    <div>
      <button id="spin" disabled={spinning}>Girar</button>
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
      {selectedNumber && (
        <Box mt={2}>
          <p>O número selecionado é: {selectedNumber}</p>
          <Button variant="contained" color="primary" onClick={() => router.push("/next-page")}>Avançar</Button>
        </Box>
      )}
    </div>
  );
}
