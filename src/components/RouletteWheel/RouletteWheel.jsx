import { Box, Button, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import "./RouletteWheel.css";
import { useNavigate } from "react-router-dom";

export default function RouletteWheel() {
  const [selectedDiscipline, setSelectedDiscipline] = useState(null);
  const [spinning, setSpinning] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const btn = document.getElementById("spin");
    const container = document.querySelector(".container");
    let number = Math.ceil(Math.random() * 1000);

    btn.onclick = function () {
      if (!spinning) {
        setSpinning(true);
        container.style.transition = "transform 3s ease-out";
        container.style.transform = "rotate(" + number + "deg)";

        setTimeout(() => {  
          const selected = determineDiscipline(number % 360);
          setSelectedDiscipline(selected);
          setSpinning(false);
        }, 3000);

        number += Math.ceil(Math.random() * 1000);
      }
    };
  }, [spinning]);

  function determineDiscipline(degrees) {
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
        <div className="one"><img src="/devWebMobile.png" alt="devWebMobile" /></div>
        <div className="two"><img src="/bancoDeDados.png" alt="bancoDeDados" /></div>
        <div className="three"><img src="/ciberSegurança.png" alt="ciberSeguranca" /></div>
        <div className="four"><img src="/linguagensProgramacao.png" alt="linguagensProgramacao" /></div>
        <div className="five"><img src="/historiaProgramacao.png" alt="historiaProgramacao" /></div>
      </div>
      {selectedDiscipline && (
        <Box mt={2} display='flex' justifyContent='center' flexDirection='column'>
          <Typography variant="h6" textAlign='center'>
            A disciplina sorteada é: {selectedDiscipline}
          </Typography>
          <Button sx={{ mt: 1, backgroundColor: "#2A2E5D" }} variant="contained" onClick={handleAvancar}>
            Avançar
          </Button>
        </Box>
      )}
    </div>
  );
}
