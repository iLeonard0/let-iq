import React, { useEffect, useState } from "react";
import { Box, Typography, Button, CircularProgress, Paper } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { db } from "../../services/firebase";
import { doc, getDoc } from "firebase/firestore";
import Header from "../../components/header/Header";

export default function PontuacaoScreen() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const salaId = searchParams.get("salaId");
  const [pontuacao, setPontuacao] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPontuacao() {
      if (!salaId) return;
      setLoading(true);
      const salaRef = doc(db, "rooms", salaId);
      const salaSnap = await getDoc(salaRef);
      if (salaSnap.exists()) {
        const data = salaSnap.data();
        const jogadores = data.jogadores || [];
        const scores = jogadores.map(jogador => ({
          nome: jogador.displayName || jogador.nome || jogador.email || 'Jogador',
          pontos: jogador.pontos || 0,
          uid: jogador.uid
        }));
        scores.sort((a, b) => b.pontos - a.pontos);
        setPontuacao(scores);
      }
      setLoading(false);
    }
    fetchPontuacao();
  }, [salaId]);

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#dcdcdc" }}>
      <Header />
      <Box sx={{ flexGrow: 1, p: 2, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <Paper sx={{ p: 2, borderRadius: 4, minWidth: 320, maxWidth: 500, width: '100%', textAlign: 'center' }}>
          <Box display='flex'>
            <Typography variant="h6" sx={{ mb: 2, color: '#2A2E5D', fontWeight: 700 }}>
              Rank Final
            </Typography>
          </Box>
          {loading ? (
            <CircularProgress color="secondary" />
          ) : (
            <>
              {pontuacao.length === 0 ? (
                <Typography variant="body1">Nenhuma pontuação encontrada.</Typography>
              ) : (
                <Box>
                  {pontuacao.map((j, idx) => (
                    <Box key={j.uid} sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: idx === 0 ? '#F10B5C' : '#f5f5f5',
                      color: idx === 0 ? '#fff' : '#2A2E5D',
                      borderRadius: 2,
                      p: 2,
                      mb: 1,
                      fontWeight: idx === 0 ? 700 : 400
                    }}>
                      <span style={{ fontSize: 18 }}>{idx + 1}º</span>
                      <span style={{ flex: 1, textAlign: 'left', marginLeft: 12 }}>{j.nome}</span>
                      <span style={{ fontWeight: 700 }}>{j.pontos} pontos</span>
                    </Box>
                  ))}
                </Box>
              )}
            </>
          )}
          <Box display='flex' justifyContent='flex-end' mt={3} fullWidth sx={{ width: '100%' }}>
            <Button
              variant="outlined"
              sx={{ mt: 3, borderRadius: 3, color: '#F10B5C', borderColor: '#F10B5C' }}
              onClick={() => navigate("/")}
            >
              Voltar ao início
            </Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
