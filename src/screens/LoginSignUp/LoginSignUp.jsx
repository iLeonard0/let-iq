import React, { useState } from "react";
import { Box, Button, TextField, Typography, IconButton, InputAdornment, Paper } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import Header from "../../components/header/Header";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../services/firebase";

export default function LoginSignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const isButtonDisabled = !(email.trim() && password.trim() && confirmPassword.trim() && password === confirmPassword);

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("As senhas não coincidem. Tente novamente.");
      return;
    }
    try {
      await createUserWithEmailAndPassword(auth, email, password)
    } catch (error) {
      console.error("Erro ao criar conta:", error);
      navigate("/screens/LoginSign/SignIn");
    }
  }

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
          textAlign: "center",
          backgroundColor: "#f5f5f5",
          padding: 2,
          pb: 0,
        }}
      >
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
            pb: 5,
          }}
        >
          <Typography variant="h1" gutterBottom sx={{
            fontSize: "2rem",
            lineHeight: "2rem",
            fontWeight: "700",
            textAlign: "center",
          }}>
            Cadastrar-se
          </Typography>
          <Box
            sx={{
              width: "100%",
              marginBottom: 2,
              marginTop: 2,
            }}
          >
            <Typography variant="h6" gutterBottom sx={{
              display: "flex",
              fontWeight: "bold",
              marginBottom: 0,
            }}>
              Email
            </Typography>
            <TextField
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="custom-textfield"
              sx={{
                width: "100%",
                marginBottom: 2,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "5px",
                },
              }}
            />
            <Typography variant="h6" gutterBottom sx={{
              display: "flex",
              fontWeight: "bold",
              marginBottom: 0,
            }}>
              Senha
            </Typography>
            <TextField
              type={showPassword ? "text" : "password"}
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="custom-textfield"
              sx={{
                width: "100%",
                marginBottom: 2,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "5px",
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={togglePasswordVisibility} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Typography variant="h6" gutterBottom sx={{
              display: "flex",
              fontWeight: "bold",
              marginBottom: 0,
            }}>
              Confirmar Senha
            </Typography>
            <TextField
              type={showPassword ? "text" : "password"}
              variant="outlined"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="custom-textfield"
              sx={{
                width: "100%",
                marginBottom: 2,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "5px",
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={togglePasswordVisibility} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          <Button
            onClick={handleSignUp}
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
              transition: "transform 0.2s cubic-bezier(.4,2,.6,1)",
              "&:hover": {
                backgroundColor: isButtonDisabled ? "#d3d3d3" : "#d80f55",
                transform: "scale(1.05)",
              },
            }}
            variant="contained"
          >
            Cadastrar-se
          </Button>
        </Paper>
      </Box>
    </>
  );
}
