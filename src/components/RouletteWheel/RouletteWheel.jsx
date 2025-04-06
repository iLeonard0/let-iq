import { Box, Button, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import "./RouletteWheel.css";
import { useNavigate } from "react-router-dom";

export default function RouletteWheel() {
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [spinning, setSpinning] = useState(false);
  const navigate = useNavigate();

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

  function handleAvancar() {
    navigate("/screens/GameScreen/GameScreen");
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
        <Box mt={2} display='flex' justifyContent='center' flexDirection='column'>
          <Typography variant="body2" textAlign='center'>
            O número selecionado é: {selectedNumber}
          </Typography>
          <Button sx={{mt: 1}} variant="contained" color="primary" onClick={() => handleAvancar()}>Avançar</Button>
        </Box>
      )}
    </div>
  );
}
