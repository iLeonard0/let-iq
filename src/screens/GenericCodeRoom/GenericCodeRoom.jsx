import { Box, Button, Paper, TextField, Typography, Snackbar, Alert } from "@mui/material";
import { useState } from "react";
import { getDoc, doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../../services/firebase";
import { useNavigate } from "react-router-dom";
import Header from "../../components/header/Header";
import { useAuth } from "../../context/AuthContext";

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export default function EnterRoom() {
  const [codigo, setCodigo] = useState("");
  const [nome, setNome] = useState("");
  const [nomeErro, setNomeErro] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'error' });
  const navigate = useNavigate();
  const { user } = useAuth();
  const isButtonDisabled = codigo.trim().length < 5 || nome.trim().length < 2;

  const buscarSalaPorCodigo = async () => {
    const docRef = doc(db, "rooms", codigo.trim());
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();

      if (data.status === "started") {
        setSnackbar({ open: true, message: "Não é possível entrar em uma sala já iniciada.", severity: 'error' });
        return;
      }

      const jogadoresAtuais = data.jogadores || [];

      if (jogadoresAtuais.map(j => (j.nome || j).toLowerCase()).includes(nome.trim().toLowerCase())) {
        setNomeErro("Já existe um jogador com esse usuário.");
        return;
      }

      // Gera UID do usuário (autenticado ou convidado)
      let jogadorUid = null;
      if (user && user.uid) {
        jogadorUid = user.uid;
      } else {
        // Se já existe um UID para este nome nesta sala, reutiliza, senão gera novo
        const jogadorExistente = jogadoresAtuais.find(j => (j.nome || j) === nome.trim());
        if (jogadorExistente && jogadorExistente.uid) {
          jogadorUid = jogadorExistente.uid;
        } else {
          // jogadorUid = crypto.randomUUID();
          jogadorUid = uuidv4(); // Gera um novo UUID
        }
      }

      // Adiciona o jogador sempre com uid
      const jogador = { nome: nome.trim(), pontos: 0, uid: jogadorUid };
      await updateDoc(docRef, {
        jogadores: arrayUnion(jogador)
      });

      // Apenas para identificar o usuário atual na sessão (para mostrar "você" no lobby)
      sessionStorage.setItem("currentUid", jogadorUid);
      sessionStorage.setItem("playerName", nome.trim());
      sessionStorage.setItem("salaCodigo", codigo.trim());
      
      navigate(`/screens/QuizEditor/ResumoLobby/${codigo.trim()}`);
    } else {
      setSnackbar({ open: true, message: "Nenhuma sala com esse código.", severity: 'error' });
      sessionStorage.removeItem("salaCodigo");
      sessionStorage.removeItem("playerName");
      sessionStorage.removeItem("currentUid");
    }
  };

  return (
    <>
      <Header />
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          position: "relative",
          backgroundColor: "#f5f5f5",
          p: 2,
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
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3500}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
