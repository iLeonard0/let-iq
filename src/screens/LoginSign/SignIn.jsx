import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
  Paper,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import "./SignIn.css";
import { useNavigate } from "react-router-dom";
import Header from "../../components/header/Header";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../services/firebase";
import DialogChangePassword from "./DialogChangePassword/DialogChangePassword";
import { loginWithGoogle } from "../../services/authService";

export default function LoginSignUp() {
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, nickname, password);
      console.log("Login bem-sucedido!");
      navigate("/screens/QuizEditor/QuizEditor");
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      alert(
        "Erro ao fazer login. Verifique suas credenciais e tente novamente. ", error
      );
    }
  };
  
  const handleGoogleLogin = async (e) => {
    e.preventDefault();
    try {
      await loginWithGoogle();
      navigate("/screens/QuizEditor/QuizEditor");
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      alert(
        "Erro ao fazer login. Verifique suas credenciais e tente novamente. ", error
      );
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
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
            pb: 1,
            mt: '5%',
          }}
        >
          <Typography
            variant="h1"
            gutterBottom
            sx={{
              fontSize: "2rem",
              lineHeight: "2rem",
              fontWeight: "700",
              textAlign: "center",
            }}
          >
            Fazer Login
          </Typography>
          <Box
            sx={{
              width: "100%",
              marginBottom: 2,
              marginTop: 4,
            }}
          >
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                display: "flex",
                fontWeight: "bold",
                marginBottom: 0,
              }}
            >
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
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                display: "flex",
                fontWeight: "bold",
                marginBottom: 0,
              }}
            >
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
              marginTop: 0,
            }}
          >
            <Typography underline="hover" >
              Esqueceu sua senha?
              <Button 
                style={{ marginLeft: "5px", textTransform: "none", fontSize: '1rem', }} 
                onClick={handleOpen}
              >
                Redefinir Senha...
              </Button>
            </Typography>
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
              transition: "transform 0.2s cubic-bezier(.4,2,.6,1)",
              "&:hover": {
                backgroundColor: isButtonDisabled ? "#d3d3d3" : "#1a2e7b",
                transform: "scale(1.05)",
              },
            }}
            variant="contained"  
          >
            Fazer Login
          </Button>
          <Box
            sx={{
              position: "relative",
              width: "100%",
              textAlign: "center",
              marginY: 2,
              mt: 3,
            }}
          >
            <hr
              style={{
                border: "none",
                borderTop: "1px solid rgb(170, 170, 170)",
                margin: 0,
              }}
            />
            <span
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                backgroundColor: "#fff", // ou a cor do fundo da sua tela
                padding: "0 8px",
              }}
            >
              ou
            </span>
          </Box>
          <Box sx={{ marginTop: 1, width: "100%" }}>
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
                transition: " transform 0.2s cubic-bezier(.4,2,.6,1)",
                "&:hover": {
                  backgroundColor: "rgb(245, 245, 245)",
                  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                  transform: "scale(1.05)",
                },
              }}
              onClick={handleGoogleLogin}
            >
              <img
                src="/public/logo-google-login.png"
                alt="Google Logo"
                style={{ width: "20px", height: "20px", marginRight: "10px" }}
              />
              Continuar com o Google
            </Button>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 2,
              marginTop: 0,
            }}
          >
            <Typography sx={{ mt: 2 }} underline="hover">
              Não tem uma conta? 
              <Button 
                style={{ marginLeft: "5px", textTransform: "none", fontSize: '1rem' }} 
                href="/screens/LoginSignUp/LoginSignUp"
              >
                Inscrever-se
              </Button>
            </Typography>
          </Box>
        </Paper>

        <DialogChangePassword
          onClose={handleClose}
          open={open}
          fullWidth
          maxWidth="sm"
        />
      </Box>
    </>
  );
}
