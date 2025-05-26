import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Divider,
} from "@mui/material";
import { useLocation } from "react-router-dom";
import Header from "../../components/header/Header";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../services/firebase";
import { doc, updateDoc, onSnapshot, getDoc } from "firebase/firestore";
import LinearProgress from '@mui/material/LinearProgress';

export default function GameScreen() {
  const location = useLocation();

  const { perguntas } = location.state.questoes;
  const { user } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [respostasJogadores, setRespostasJogadores] = useState({});
  const [mostrarResposta, setMostrarResposta] = useState(false);
  const [quizEnded, setQuizEnded] = useState(false);

  const questoes = location.state?.questoes;
  const perguntaAtual = perguntas[currentIndex];
  const alternativas = perguntaAtual?.alternativas;
  const respostaCorreta = perguntaAtual?.respostaCorreta;
  const host = location.state.questoes.host;
  const isHost = user && host && user.uid === host.uid;
  const totalJogadores = (location.state.questoes.jogadores || []).length;
  const podeMostrarResposta = mostrarResposta || (Object.keys(respostasJogadores).length === totalJogadores && totalJogadores > 0);

  const [tempoRestante, setTempoRestante] = useState(perguntaAtual?.tempo || 30);

  useEffect(() => {
    if (!perguntaAtual?.tempo || podeMostrarResposta) {
      return;
    }
    setTempoRestante(perguntaAtual.tempo);
    const interval = setInterval(() => {
      setTempoRestante((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [currentIndex, perguntaAtual, podeMostrarResposta]);

  useEffect(() => {
    if (currentIndex === 0) return;
    setTempoRestante(perguntas[currentIndex]?.tempo || 30);
  }, [currentIndex, perguntas]);

  useEffect(() => {
    const salaId = location.state.salaId || location.state.questoes.salaId;

    if (!salaId) return;

    const salaRef = doc(db, "rooms", salaId);

    const unsubscribe = onSnapshot(salaRef, (docSnap) => {
      if (docSnap.exists()) {

        const perguntasArr = docSnap.data().perguntas || [];
        const questaoId = perguntas[currentIndex]?.id;
        const questao = perguntasArr.find(q => q.id === questaoId);

        setMostrarResposta(!!(questao && questao.mostrarResposta));
        setRespostasJogadores((questao && questao.respostasJogadores) ? questao.respostasJogadores : {});

        if (typeof docSnap.data().currentIndex === 'number' && docSnap.data().currentIndex !== currentIndex) {
          setCurrentIndex(docSnap.data().currentIndex);
          setSelectedOption(null);
        }
        if (docSnap.data().status === 'ended') {
          setQuizEnded(true);
        }
      }
    });

    return () => unsubscribe();
  }, [currentIndex, perguntas, location.state.salaId, location.state.questoes.salaId]);

  const handleMostrarResposta = async () => {
    const salaId = location.state.salaId || location.state.questoes.salaId;
    const questaoId = perguntas[currentIndex].id;

    if (!salaId || !questaoId) return;

    const salaRef = doc(db, "rooms", salaId);
    let perguntasArr = [];

    try {
      const salaSnap = await getDoc(salaRef);
      if (salaSnap.exists()) {
        perguntasArr = salaSnap.data().perguntas || [];
        perguntasArr = perguntasArr.map(q => q.id === questaoId ? { ...q, mostrarResposta: true } : q);
        await updateDoc(salaRef, { perguntas: perguntasArr });
        return;
      }
    } catch (error) {
      console.error("Erro ao atualizar a questão:", error);
    }
    try {
      await updateDoc(doc(db, "salas", salaId, "questoes", questaoId), { mostrarResposta: true });
    } catch (error) {
      console.error("Erro ao atualizar a questão:", error);
    }
  };

  useEffect(() => {
    const salaId = location.state.salaId || location.state.questoes.salaId;

    if (!salaId) return;

    const salaRef = doc(db, "rooms", salaId);

    const unsubscribe = onSnapshot(salaRef, (docSnap) => {
      if (docSnap.exists()) {
        const perguntasArr = docSnap.data().perguntas || [];
        const questaoId = perguntas[currentIndex].id;
        const questao = perguntasArr.find(q => q.id === questaoId);

        setMostrarResposta(!!(questao && questao.mostrarResposta));
        setRespostasJogadores((questao && questao.respostasJogadores) ? questao.respostasJogadores : {});
      }
    });

    return () => unsubscribe();
  }, [currentIndex, perguntas, location.state.salaId, location.state.questoes.salaId]);

  const enviarResposta = async (idx) => {
    let jogadorUid = user && user.uid ? user.uid : sessionStorage.getItem("currentUid");
    if (!jogadorUid) return;

    const salaId = location.state.salaId || location.state.questoes.salaId;
    if (!salaId) return;

    const salaRef = doc(db, "rooms", salaId);
    const salaSnap = await getDoc(salaRef);

    if (salaSnap.exists()) {
      const data = salaSnap.data();
      const perguntasArr = data.perguntas || [];
      const jogadoresArr = data.jogadores || [];
      const questaoId = perguntas[currentIndex].id;
      const questaoFirestore = perguntasArr.find(q => q.id === questaoId);
      const respostasFirestore = questaoFirestore?.respostasJogadores || {};
      const perguntasAtualizadas = perguntasArr.map(q => {
        if (q.id === questaoId) {
          return {
            ...q,
            respostasJogadores: { ...respostasFirestore, [jogadorUid]: idx }
          };
        }
        return q;
      });

      let jogadoresAtualizados = jogadoresArr.map(j => {
        const respostaJogador = (perguntasAtualizadas.find(q => q.id === questaoId)?.respostasJogadores || {})[j.uid];
        const jaPontuou = (questaoFirestore?.respostasJogadores || {})[j.uid] !== undefined;
        if (
          respostaJogador === perguntaAtual.respostaCorreta &&
          !jaPontuou
        ) {
          return { ...j, pontos: (j.pontos || 0) + 10 };
        }
        return j;
      });

      await updateDoc(salaRef, {
        perguntas: perguntasAtualizadas,
        jogadores: jogadoresAtualizados
      });
    }
  };

  const handleOptionClick = (idx) => {
    if (!isHost && !quizEnded && !podeMostrarResposta && selectedOption === null) {
      setSelectedOption(idx);
      enviarResposta(idx);
    }
  };

  const handleNext = async () => {
    const salaId = location.state.salaId || location.state.questoes.salaId;
    if (isHost && salaId) {
      const salaRef = doc(db, "rooms", salaId);
      if (currentIndex + 1 >= perguntas.length) {
        await updateDoc(salaRef, { status: "ended" });
      } else {
        await updateDoc(salaRef, { currentIndex: currentIndex + 1 });
      }
    }
    setCurrentIndex((prev) => prev + 1);
    setSelectedOption(null);
    setTempoRestante(perguntas[currentIndex + 1]?.tempo || 30); 
  };

  if (quizEnded || !perguntaAtual) {
    return (
      <Box sx={{ height: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#dcdcdc" }}>
        <Header />
        <Box sx={{ flexGrow: 1, display: "flex", textAlign: 'center', flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
          <Typography variant="h3" sx={{ mb: 2, color: '#F10B5C', fontWeight: 100, fontFamily: 'Titan One, sans-serif', letterSpacing: 1 }}>
              Fim do Quiz!
            </Typography>
          <Button
            variant="outlined"
            color="primary"
            sx={{ borderRadius: 3, color: "#F10B5C", borderColor: "#F10B5C" }}
            onClick={() => window.location.href = "/pontuacao?salaId=" + (location.state.salaId || location.state.questoes.salaId)}
          >
            Visualizar Pontuação
          </Button>
        </Box>
      </Box>
    );
  }

  if (!questoes) {
    return (
      <Typography variant="h5" color="error">
        Erro: Nenhuma questão foi fornecida.
      </Typography>
    );
  }

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#dcdcdc" }}>
      <Header />

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
        <>
          <Box sx={{ width: '95%', maxWidth: 700, mt: 5, mb: 2, alignSelf: 'center' }}>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5, textAlign: 'right' }}>
              Tempo restante: {tempoRestante}s
            </Typography>
            <LinearProgress
              variant="determinate"
              value={perguntaAtual?.tempo ? (tempoRestante / perguntaAtual.tempo) * 100 : 100}
              sx={{ height: 10, borderRadius: 5, background: '#eee', '& .MuiLinearProgress-bar': { background: '#F10B5C' } }}
            />
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
              position: 'relative',
            }}
          >
            <Typography variant="h6">{perguntaAtual.pergunta}</Typography>
            {podeMostrarResposta && !isHost && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 2,
                  background: 'rgba(255,255,255,0.85)',
                  borderRadius: 8,
                }}
              >
                <Typography
                  variant="h4"
                  sx={{
                    fontFamily: 'Titan One',
                    color: selectedOption === respostaCorreta ? "#4caf50" : "#f44336",
                  }}
                >
                  {selectedOption === respostaCorreta ? "CORRETO!" : "VOCÊ ERROU!"}
                </Typography>
              </Box>
            )}
            {tempoRestante === 0 && !podeMostrarResposta && !isHost && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  zIndex: 2,
                  background: 'rgba(255,255,255,0.85)',
                  borderRadius: 8,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ fontFamily: 'Titan One', color: '#2A2E5D', textAlign: 'center' }}
                >
                  Seu tempo acabou!<br />
                </Typography>
                <Typography variant="body2" sx={{ color: '#2A2E5D', textAlign: 'center' }}>
                  Aguarde o host para ver a resposta.
                </Typography>
              </Box>
            )}
          </Box>
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
              .map(([key, texto], idx) => {
                let backgroundColor = "#fff";
                let border = 'none';
                let color = '#000';
                if (podeMostrarResposta) {
                  if (selectedOption === respostaCorreta && idx === respostaCorreta) {
                    backgroundColor = "#4caf50";
                    color = '#fff';
                  } else if (selectedOption !== respostaCorreta) {
                    if (idx === respostaCorreta) {
                      backgroundColor = "#4caf50";
                      color = '#fff';
                    } else if (selectedOption === idx) {
                      backgroundColor = "#f44336";
                      color = '#fff';
                      border = '2px solid #f44336';
                    }
                  }
                } else if (selectedOption === idx) {
                  backgroundColor = "#e0e0e0";
                  border = '2px solid #F10B5C';
                }
                return (
                  <Box key={key} sx={{ position: 'relative', width: '100%' }}>
                    <Button
                      variant="contained"
                      disableElevation
                      onClick={() => !isHost && !podeMostrarResposta && handleOptionClick(idx)}
                      disabled={isHost ? false : (!podeMostrarResposta && (selectedOption !== null || (tempoRestante === 0 && selectedOption === null)))}
                      sx={{
                        backgroundColor,
                        color,
                        borderRadius: 3,
                        textTransform: "none",
                        boxShadow: "none",
                        justifyContent: "flex-start",
                        height: 48,
                        px: 2,
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        cursor: isHost ? 'default' : (podeMostrarResposta ? 'pointer' : (tempoRestante === 0 && !podeMostrarResposta ? 'not-allowed' : 'pointer')),
                        pointerEvents: isHost ? 'auto' : 'auto',
                        border,
                        opacity: podeMostrarResposta ? 1 : undefined,
                      }}
                    >
                      <span style={{ flex: 1, textAlign: 'left' }}>{String.fromCharCode(65 + idx)}) {texto}</span>
                    </Button>
                  </Box>
                );
              })}

            {isHost && !podeMostrarResposta && (
              <Button
                variant="outlined"
                onClick={handleMostrarResposta}
                sx={{ mt: 2, borderRadius: 3, color: '#F10B5C', borderColor: '#F10B5C' }}
              >
                Mostrar resposta agora
              </Button>
            )}
            {isHost && podeMostrarResposta && (
              <Button
                variant="contained"
                onClick={handleNext}
                sx={{ mt: 2, borderRadius: 3, backgroundColor: "#F10B5C", color: "white" }}
              >
                {currentIndex + 1 >= perguntas.length ? 'Finalizar Quiz' : 'Próxima Pergunta'}
              </Button>
            )}

            <Divider sx={{ mt: 2 }} />
          </Box>
        </>
      </Box>
    </Box>
  );
}
