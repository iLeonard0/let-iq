import React, { useState } from "react";
import { Box, Button, TextField, Typography, Link, IconButton, InputAdornment, Paper } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import "./SignIn.css";
import { useNavigate } from "react-router-dom";
import Header from "../../components/header/Header";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../services/firebase";

export default function LoginSignUp() {
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, nickname, password);
      console.log("Login bem-sucedido!");
      navigate("/screens/Spin/Spin"); 
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      alert("Erro ao fazer login. Verifique suas credenciais e tente novamente.");
    }
  };

  const isButtonDisabled = !(nickname.trim() && password.trim());

  return (
    <>
      <Header />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          minHeight: "90vh",
          textAlign: "center",
          backgroundColor: "#f5f5f5",
          padding: 2,
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
          }}
        >
          <Typography variant="h1" gutterBottom sx={{
            fontSize: "2rem",
            lineHeight: "2rem",
            fontWeight: "700",
            textAlign: "center",
          }}>
            Fazer Login
          </Typography>
          <Box
            sx={{
              width: "100%",
              marginBottom: 2,
              marginTop: 4,
            }}
          >
            <Typography variant="h6" gutterBottom sx={{
              display: "flex",
              fontWeight: "bold",
              marginBottom: 0,
            }}>
              Nome de usuário

            </Typography>
            <TextField
              variant="outlined"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
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
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 2,
              marginTop: 0
            }}
          >
            <Link href="/screens/LoginSignUp/LoginSignUp" underline="hover">
              Forgot your password?
            </Link>
          </Box>
          <Button
            onClick={handleLogin} 
            disabled={isButtonDisabled}
            sx={{
              backgroundColor: isButtonDisabled ? "#d3d3d3" : "#21399b",
              color: isButtonDisabled ? "#a9a9a9" : "white",
              width: "100%",
              borderRadius: "10px",
              padding: 1,
              fontSize: "1rem",
              fontWeight: "bold",
              textTransform: "none",
              transition: "background-color 0.3s ease",
              "&:hover": {
                backgroundColor: isButtonDisabled ? "#d3d3d3" : "#1a2e7b",
              },
            }}
            variant="contained"
          >
            Fazer Login
          </Button>
          <Box sx={{marginTop: 3}}>
            <Button
              sx={{
                display: "flex",
                alignItems: "center",
                position: "relative",
                width: "100%",
                margin: "0.25rem 0px",
                borderRadius: "4px",
                color: "rgb(0, 0, 0)",
                border: "1px solid rgb(0, 0, 0)",
                backgroundColor: "rgb(255, 255, 255)",
                boxShadow: "none",
                padding: "0.5rem",
                lineHeight: "1rem",
                height: "auto",
                fontWeight: "500",
                textTransform: "none",
                fontSize: "1rem",
                transition: "background-color 0.3s ease, box-shadow 0.3s ease",
                "&:hover": {
                  backgroundColor: "rgb(245, 245, 245)",
                  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                },
              }}
            >
              <img
                src="/public/logo-google-login.png"
                alt="Google Logo"
                style={{ width: "20px", height: "20px", marginRight: "auto" }}
              />
              Continuar com o Google
            </Button>
          </Box>
        </Paper>
      </Box>
    </>
  );
}
