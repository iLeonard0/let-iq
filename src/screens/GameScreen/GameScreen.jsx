import { Box, Typography, Button, Divider } from "@mui/material";
import React, { useState } from "react";
import Header from "../../components/header/Header";
import { questoesJson } from "../../json/questoes";

export default function GameScreen() {
  const { disciplina, perguntas } = questoesJson[0];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [points, setPoints] = useState(0);

  const perguntaAtual = perguntas[currentIndex];
  const alternativas = perguntaAtual.alternativas;
  const respostaCorreta = alternativas.respostaCorreta;

  const handleOptionClick = (key) => {
    if (!answered) {
      setSelectedOption(key);
      setAnswered(true);

      if (key === respostaCorreta) {
        setPoints((prev) => prev + 10);
      }
    }
  };

  const handleNext = () => {
    if (currentIndex < perguntas.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setAnswered(false);
    } else {
      alert("Fim das perguntas!");
    }
  };

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#dcdcdc" }}>
      <Header points={points} />
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          px: 2,
        }}
      >
        <Box sx={{ px: 2, mb: 2, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Typography variant="h5" color="textSecondary">
            {disciplina}
          </Typography>
        </Box>
        <Box
          sx={{
            backgroundColor: "white",
            borderRadius: 8,
            boxShadow: 3,
            minHeight: "150px",
            p: 3,
            width: "100%",
            maxWidth: 700,
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="h6">{perguntaAtual.pergunta}</Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            width: "100%",
            maxWidth: 700,
            mt: 4,
          }}
        >
          {Object.entries(alternativas)
            .filter(([key]) => key !== "respostaCorreta")
            .map(([key, texto]) => (
              <Button
                key={key}
                variant="contained"
                disableElevation
                onClick={() => handleOptionClick(key)}
                sx={{
                  backgroundColor: !answered
                    ? "#fff"
                    : key === respostaCorreta
                      ? "#4caf50"
                      : selectedOption === key
                        ? "#f44336"
                        : "#fff",
                  color: "#000",
                  borderRadius: 3,
                  textTransform: "none",
                  boxShadow: "none",
                  justifyContent: "flex-start",
                  height: 48,
                  px: 2,
                }}
              >
                {key.toUpperCase()}) {texto}
              </Button>
            ))}

          {answered && (
            <Button
              variant="contained"
              onClick={handleNext}
              sx={{ mt: 2, borderRadius: 3, backgroundColor: "#2A2E5D", color: "white" }}
            >
              Próxima
            </Button>
          )}

          <Divider sx={{ mt: 2 }} />
        </Box>
      </Box>
    </Box>
  );
}
