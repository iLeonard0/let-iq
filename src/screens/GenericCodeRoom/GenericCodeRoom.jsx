import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../../services/firebase";
import { useNavigate } from "react-router-dom";

export default function EnterRoom() {
  const [codigo, setCodigo] = useState("");
  const isButtonDisabled = codigo.trim().length < 4;
  const navigate = useNavigate();

  const buscarSalaPorCodigo = async () => {
    try {
      const docRef = doc(db, "rooms", codigo.trim());
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) { 
        console.log("Sala encontrada:", docSnap.data()); 
        navigate(`/screens/GameScreen/GameScreen/${codigo.trim()}`);
        return docSnap.data();
      } else {
        console.log("Nenhuma sala com esse código.");
        alert("Nenhuma sala com esse código.");
        return null;
      }
    } catch (error) {
      alert("Erro ao buscar sala!");
      console.error("Erro ao buscar sala:", error);
      return null;
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        minHeight: "100svh",
        textAlign: "center",
        backgroundColor: "#f5f5f5",
        pb: 12,
        pr: 2,
        pl: 2,
      }}
    >
      <Box
        component="img"
        src="/public/letiq-logo.png"
        alt="LetIQ Logo"
        sx={{
          height: "170px",
          width: "auto",
          mb: 3,
        }}
      />
      <Paper
        elevation={6}
        sx={{
          padding: 4,
          borderRadius: "20px",
          maxWidth: "450px",
          width: "100%",
          textAlign: "center",
          backgroundColor: "#ffffff",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          pt: 0.5,
        }}
      >
        <Box display="flex" flexDirection="column" sx={{ pt: 2.5, pb: 2.5 }}>
          <Typography variant="h5" fontWeight="bold">
            Entre em uma sala
          </Typography>
        </Box>
        <Box  sx={{ minWidth: "100%" }}>
          <TextField
            onChange={(e) => setCodigo(e.target.value)}
            variant="outlined"
            onWheel={(e) => e.target.blur()}
            label="Código da Sala"
            type="number"
            sx={{
              width: "90%",
              marginBottom: 2,
              marginTop: 0,
            }}
          />

          <Button
            sx={{
              backgroundColor: isButtonDisabled ? "#d3d3d3" : "#21399b",
              color: isButtonDisabled ? "#a9a9a9" : "white",
              width: "91%",
              borderRadius: "10px",
              padding: 1,
              fontSize: "1rem",
              fontWeight: "bold",
              textTransform: "none",
              transition: "transform 0.2s cubic-bezier(.4,2,.6,1)",
              "&:hover": {
                backgroundColor: isButtonDisabled ? "#d3d3d3" : "#1a2e7b",
                transform: "scale(1.05)",
              },
            }}
            variant="contained"
            disabled={isButtonDisabled}
            onClick={buscarSalaPorCodigo}
          >
            Entrar
          </Button>
        </Box>
      </Paper>
      <Box
        sx={{
          position: "fixed",
          bottom: 16,
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
            color: "#21399b",
            background: "none",
            fontSize: "1rem",
            fontWeight: 500,
            textTransform: "none",
            boxShadow: "none",
            borderRadius: "8px",
            minWidth: 0,
            padding: 0.5,
            opacity: 0.85,
            transition:
              "background 0.2s, color 0.2s, transform 0.2s cubic-bezier(.4,2,.6,1)",
            "&:hover": {
              background: "#f5f5f5",
              color: "#1a2e7b",
              transform: "scale(1.05)",
            },
          }}
        >
          Ou crie seu próprio Quiz
        </Button>
      </Box>
    </Box>
  );
}
