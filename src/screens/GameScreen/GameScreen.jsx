import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../components/header/Header";

export default function GameScreen() {
  const location = useLocation();
  const navigate = useNavigate();
  const { disciplina, perguntas } = location.state.questoes;
  const questoes = location.state?.questoes;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [points, setPoints] = useState(0);
  const [timer, setTimer] = useState(30);
  const [timeoutReached, setTimeoutReached] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const perguntaAtual = perguntas[currentIndex];
  const alternativas = perguntaAtual.alternativas;
  const respostaCorreta = alternativas.respostaCorreta;

  useEffect(() => {
    setTimer(30);
    setTimeoutReached(false);
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          if (!answered) {
            setTimeoutReached(true);
            setAnswered(true);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex]);

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
      setOpenDialog(true);
    }
  };

  const handleReturnToRoleta = () => {
    setOpenDialog(false);
    navigate("/screens/QuizEditor/QuizEditor");
  };

  if (!questoes) {
    return (
      <Typography variant="h5" color="error">
        Erro: Nenhuma questão foi fornecida.
      </Typography>
    );
  }

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#dcdcdc" }}>
      <Header points={points} timer={timer} />
      
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
        {timeoutReached ? (
          <Box
            sx={{
              backgroundColor: "#ffebee",
              padding: 4,
              borderRadius: 4,
              textAlign: "center",
              boxShadow: 3,
              width: 600,
              maxWidth: 600
            }}
          >
            <Typography variant="h5" sx={{ color: "#f44336", mb: 2 }}>
              Tempo esgotado!
            </Typography>
            <Button
              variant="contained"
              color="error"
              onClick={handleNext}
              sx={{ borderRadius: 3 }}
            >
              Ir para a próxima questão
            </Button>
          </Box>
        ) : (
          <>
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
            {answered && !timeoutReached && (
              <Typography
                variant="h3"
                sx={{
                  mt: 4,
                  fontFamily: 'Titan One',
                  color: selectedOption === respostaCorreta ? "#4caf50" : "#f44336",
                }}
              >
                {selectedOption === respostaCorreta ? "CORRETO!" : "VOCÊ ERROU!"}
              </Typography>
            )}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                width: "100%",
                maxWidth: 700,
                mt: 4
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

              {answered && !timeoutReached && (
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
          </>
        )}
      </Box>

      <Dialog open={openDialog} onClose={handleReturnToRoleta}>
        <DialogTitle>
          <Typography variant="h6">
            Fim de Jogo!
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mt: 1 }}>
            Sua pontuação final foi de <strong>{points} pontos</strong>.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleReturnToRoleta} variant="contained" sx={{ backgroundColor: '#21399b' }}>
            Voltar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
