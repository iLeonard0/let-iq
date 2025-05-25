import React, { useEffect, useState } from "react";
import { Box, Typography, Paper, List, ListItem, ListItemText, Divider, Button, CircularProgress } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../../services/firebase";
import { useAuth } from "../../../context/AuthContext";
import Header from "../../../components/header/Header";

export default function ResumoLobby() {
  const { quizKey } = useParams();
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [jogadores, setJogadores] = useState([]);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleStartQuiz = async () => {
    if (!quizKey) return;
    const salaRef = doc(db, "rooms", quizKey);
    await updateDoc(salaRef, { started: true, currentIndex: 0 });
  };

  useEffect(() => {
    if (!quizKey) return;
    const salaRef = doc(db, "rooms", quizKey);
    const unsub = onSnapshot(salaRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setQuizData(data);
        setJogadores(data.jogadores || []);

        // Redireciona para GameScreen sempre que started for true
        if (data.started) {
          navigate("/screens/GameScreen/GameScreen", {
            replace: true,
            state: { questoes: data, salaId: quizKey },
          })
        } else if (data.ended) {
          navigate("/screens/GameScreen/ResultadosQuiz", {
            replace: true,
            state: { quizData: data, jogadores: data.jogadores || [] },
          })
        }
      }
      setLoading(false);
    });
    return () => unsub();
  }, [quizKey, navigate]);

  if (loading) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="100vh">
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Carregando informações do lobby...</Typography>
      </Box>
    );
  }

  if (!quizData) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="100vh" sx={{ background: '#f5f5f5' }}>
        <Box sx={{
          p: 4,
          borderRadius: 4,
          boxShadow: 3,
          background: '#fff',
          minWidth: 320,
          maxWidth: 400,
          width: '100%',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          <Typography variant="h4" color="#F10B5C" fontWeight={700} mb={2}>
            Quiz não encontrado
          </Typography>
          <Typography variant="body2" color="textSecondary" mb={3}>
            Não foi possível localizar o quiz solicitado.<br />Verifique se a chave está correta e tente novamente.
          </Typography>
          <Button
            onClick={() => navigate("/screens/GenericCodeRoom/GenericCodeRoom")}
            sx={{ mt: 1, backgroundColor: "#F10B5C", borderRadius: 2, fontWeight: 600, px: 4 }}
            variant="contained"
          >
            Voltar
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", background: "#f5f5f5", overflow: "auto" }}>
      <Header />
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="flex-start" pt={4} sx={{ mt: { xs: 8, sm: 10 }, width: '100vw', overflow: 'hidden' }}>
        <Paper sx={{ p: 4, borderRadius: 4, minWidth: 350, maxWidth: 600, width: "100%", mb: 4, overflow: 'visible' }}>
          <Typography variant="h4" fontWeight={700} mb={2} color="#000">
            Resumo do Quiz
          </Typography>
          <Typography variant="subtitle1" mb={2}>
            Chave da sala: <b>{quizKey}</b>
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="h6" mb={1}>
            Perguntas:
          </Typography>
          <List dense>
            {quizData.perguntas && quizData.perguntas.length > 0 ? (
              quizData.perguntas.map((q, idx) => (
                <ListItem key={idx}>
                  <ListItemText primary={`Q${idx + 1}: ${q.pergunta}`} />
                </ListItem>
              ))
            ) : (
              <Typography color="textSecondary">Nenhuma pergunta cadastrada.</Typography>
            )}
          </List>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6" mb={1}>
            Jogadores aguardando:
          </Typography>
          <List dense>
            {jogadores.length > 0 ? (
              jogadores.map((j, idx) => (
                <ListItem key={idx} sx={{
                  borderRadius: 2,
                  mb: 1,
                  background: '#fff',
                  boxShadow: 0,
                  border: '1px solid #e3e3e3',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  pl: 2,
                }}>
                  <Box sx={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    background: '#2A2E5D',
                    mr: 1,
                  }} />
                  <ListItemText
                    primary={<Typography fontWeight={600} color="#2A2E5D">{j}</Typography>}
                  />
                </ListItem>
              ))
            ) : (
              <Typography color="textSecondary" sx={{ px: 2, py: 1 }}>Nenhum jogador conectado ainda.</Typography>
            )}
          </List>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Button
              variant="contained"
              sx={{ mt: 3, borderRadius: 2, backgroundColor: "#F10B5C" }}
              onClick={handleStartQuiz}
              disabled={
                !quizData || !user || quizData.host?.uid !== user.uid || jogadores.length === 0
              }
            >
              Iniciar Quiz
            </Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
