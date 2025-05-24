import React, { useState } from "react";
import { Box, Button, TextField, Typography, Paper, useMediaQuery, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Header from "../../../components/header/Header";
import { resetPassword } from "../../../services/authService";

export default function ChangePassword() {
  const [email, setEmail] = useState("");

  const isButtonDisabled = !(email.trim());
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const handleSendResetLink = async (e) => {
    e.preventDefault();
    try {
      await resetPassword(email);
      alert("Link de redefinição enviado para o seu email.");
      navigate("/screens/LoginSign/SignIn");
    } catch {
      alert("Erro ao enviar link de redefinição. Tente novamente.");
    }
  };

  const handleCancel = () => {
    navigate("/screens/LoginSign/SignIn");
  };

  return (
    <>
      <Header />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          minHeight: "100svh",
          backgroundColor: "#f5f5f5",
          padding: isMobile ? 1 : 2,
        }}
      >
        <Paper
          elevation={6}
          sx={{
            padding: 4,
            borderRadius: "20px",
            maxWidth: isMobile ? "90vw" : "450px",
            width: "100%",
            backgroundColor: "#ffffff",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mt: isMobile ? 7 : 5,
          }}
        >
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="h1"
              sx={{
                fontSize: "2rem",
                fontWeight: "700",
                textAlign: "center",
              }}
            >
              Redefinir Senha
            </Typography>
          </Box>
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              display: "flex",
              fontWeight: "bold",
              marginBottom: 1,
              fontSize: "1rem",
              width: "100%",
              textAlign: "left",
            }}
          >
            Email
          </Typography>
          <TextField
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="custom-textfield"
            sx={{
              width: "100%",
              marginBottom: 3,
              "& .MuiOutlinedInput-root": {
                borderRadius: "5px",
              },
              '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#F10B5C',
              },
            }}
          />
          <Button
            onClick={handleSendResetLink}
            disabled={isButtonDisabled}
            sx={{
              backgroundColor: isButtonDisabled ? "#d3d3d3" : "#F10B5C",
              color: isButtonDisabled ? "#a9a9a9" : "white",
              width: "100%",
              borderRadius: "10px",
              padding: 1,
              fontSize: "1rem",
              fontWeight: "bold",
              textTransform: "none",
              transition: "background-color 0.3s ease, transform 0.2s cubic-bezier(.4,2,.6,1)",
              marginBottom: 1,
              "&:hover": {
                backgroundColor: isButtonDisabled ? "#d3d3d3" : "#d80f55",
                transform: "scale(1.05)",
              },
            }}
            variant="contained"
          >
            Enviar Link de Redefinição
          </Button>
          <Button
            onClick={handleCancel}
            variant="outlined"
            sx={{
              width: '100%',
              color: "#F10B5C",
              textTransform: "none",
              fontWeight: "bold",
              fontSize: "1rem",
              borderColor: "#d80f55",
              marginTop: 1,
              transition: "transform 0.2s cubic-bezier(.4,2,.6,1)",
              "&:hover": {

                transform: "scale(1.05)",
              },
            }}
          >
            Cancelar
          </Button>
        </Paper>
      </Box>
    </>
  );
}
