import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { getDoc, doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../../services/firebase";
import { useNavigate } from "react-router-dom";
import Header from "../../components/header/Header";

export default function EnterRoom() {
  const [codigo, setCodigo] = useState(() => localStorage.getItem("salaCodigo") || "");
  const [nome, setNome] = useState(() => localStorage.getItem("playerName") || "");
  const [nomeErro, setNomeErro] = useState("");
  const navigate = useNavigate();
  const isButtonDisabled = codigo.trim().length < 4 || nome.trim().length < 2;

  const buscarSalaPorCodigo = async () => {
    const docRef = doc(db, "rooms", codigo.trim());
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const jogadoresAtuais = docSnap.data().jogadores || [];
      if (jogadoresAtuais.map(j => j.toLowerCase()).includes(nome.trim().toLowerCase())) {
        setNomeErro("Já existe um jogador com esse usuário.");
        return;
      }
      // Adiciona o jogador ao array no Firestore
      await updateDoc(docRef, {
        jogadores: arrayUnion(nome.trim())
      });
      localStorage.setItem("salaCodigo", codigo.trim());
      localStorage.setItem("playerName", nome.trim());
      navigate(`/screens/QuizEditor/ResumoLobby/${codigo.trim()}`);
    } else {
      alert("Nenhuma sala com esse código.");
      localStorage.removeItem("salaCodigo");
      localStorage.removeItem("playerName");
    }
  };

  return (
    <>
      <Header />
      <Box
        sx={{
          minHeight: "100vh",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          position: "relative",
          backgroundColor: "#f5f5f5",
          p: 2,
          overflow: "auto"
        }}
      >
        <Paper
          elevation={6}
          sx={{
            padding: 4,
            borderRadius: "20px",
            maxWidth: "450px",
            width: "100%",
            backgroundColor: "#ffffff",
            margin: "auto",
            mt: 15,
            mb: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            boxShadow: 3,
          }}
        >
          <Typography variant="h1" gutterBottom sx={{
            fontSize: "2rem",
            lineHeight: "2rem",
            fontWeight: "700",
            textAlign: "center",
            mb: 6
          }}>
            Entrar na Sala
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" gutterBottom sx={{
                display: "flex",
                fontWeight: "bold",
                marginBottom: 0,
                fontSize: "1.2rem",
              }}>
                Nome de Usuário
              </Typography>
              <TextField
                value={nome}
                onChange={(e) => { setNome(e.target.value); setNomeErro(""); }}
                sx={{ width: "100%" }}
                error={!!nomeErro}
              />
              {nomeErro && (
                <Typography variant="body2" sx={{ color: 'red', mt: 0.5 }}>
                  {nomeErro}
                </Typography>
              )}
            </Box>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom sx={{
                display: "flex",
                fontWeight: "bold",
                marginBottom: 0,
                fontSize: "1.2rem",
              }}>
                Código da Sala
              </Typography>
              <TextField
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                type="number"
                onWheel={(e) => e.target.blur()}
                className="custom-textfield"
                sx={{
                  width: "100%",
                  marginBottom: 0.5,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "5px",
                  },
                }}
              />
            </Box>
            <Box>
              <Button
                variant="contained"
                disabled={isButtonDisabled}
                onClick={buscarSalaPorCodigo}
                sx={{
                  backgroundColor: isButtonDisabled ? "#d3d3d3" : "#F10B5C",
                  color: isButtonDisabled ? "#a9a9a9" : "white",
                  width: "100%",
                  borderRadius: "10px",
                  padding: 1,
                  fontWeight: "bold",
                  textTransform: "none",
                  transition: "transform 0.2s cubic-bezier(.4,2,.6,1)",
                  "&:hover": {
                    backgroundColor: isButtonDisabled ? "#d3d3d3" : "#d80f55",
                    transform: "scale(1.05)",
                  },
                }}
              >
                Entrar
              </Button>
            </Box>
          </Box>
        </Paper>
        <Box
          sx={{
            position: "fixed",
            bottom: 8,
            left: 0,
            width: "100%",
            display: "flex",
            justifyContent: "center",
            pointerEvents: "none",
            zIndex: 1200,
          }}
        >
          <Button
            href="/screens/LoginSign/SignIn"
            sx={{
              pointerEvents: "auto",
              color: "#000",
              textAlign: 'center',
              background: "none",
              fontSize: "1rem",
              fontWeight: 500,
              textTransform: "none",
              boxShadow: "none",
              borderRadius: "8px",
              minWidth: 0,
              padding: 1,
              opacity: 0.85,
              transition:
                "background 0.2s, color 0.2s, transform 0.2s cubic-bezier(.4,2,.6,1)",
              "&:hover": {
                background: "#f5f5f5",
                color: "#000",
                transform: "scale(1.05)",
              },
            }}
          >
            Crie seu quiz Gratuitamente aqui
          </Button>
        </Box>
      </Box>
    </>
  );
}
