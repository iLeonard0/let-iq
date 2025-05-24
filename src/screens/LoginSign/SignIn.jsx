import React, { useState } from "react";
import "./SignIn.css";
import Header from "../../components/header/Header";
import { Box, Button, TextField, Typography, IconButton, InputAdornment, Paper, useMediaQuery, useTheme } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../services/firebase";
import { loginWithGoogle } from "../../services/authService";

export default function LoginSignUp() {
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
          padding: isMobile ? 1 : 2,
          pb: 0,
        }}
      >
        <Paper
          elevation={6}
          sx={{
            padding: 4,
            borderRadius: "20px",
            maxWidth: isMobile ? "90vw" : "450px",
            width: "100%",
            textAlign: "center",
            backgroundColor: "#ffffff",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            pb: 1,
            mt: isMobile ? 7 : 5,
          }}
        >
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="h1"
              sx={{
                fontSize: "2rem",
                lineHeight: "2rem",
                fontWeight: "700",
                textAlign: "center",
              }}
            >
              Login
            </Typography>
          </Box>
          <Box
            sx={{
              width: "100%",
              marginBottom: 0,
              marginTop: 2,
            }}
          >
            <Typography
              variant="h7"
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
                marginBottom: 2.5,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "5px",
                },
                '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#F10B5C',
                },
              }}
            />
            <Typography
              variant="h7"
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
                marginBottom: 0,
                width: "100%",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "5px",
                },
                '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#F10B5C',
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
              justifyContent: "flex-start",
              alignItems: 'center',
              marginBottom: 3,
              marginTop: 0,
              width: '100%'
            }}
          >
            <Typography variant='body2' sx={{ mt: 1, fontSize: '0.8rem' }}>
              Esqueceu sua senha?
              <Link
                to="/screens/LoginSign/ChangePassword"
                style={{ textDecoration: 'underline', color: '#000', fontWeight: 'bold', marginLeft: 4 }}
              >
                Redefina sua senha
              </Link>
            </Typography>
          </Box>
          <Button
            onClick={handleLogin}
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
                backgroundColor: "#fff",
                padding: "0 8px",
                fontWeight: 'bold'
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
              justifyContent: "center",
              marginBottom: 2,
              marginTop: 0,
              width: '100%'
            }}
          >
            <Typography variant='body2' sx={{ mt: 1.5, fontSize: '0.8rem' }}>
              Não tem uma conta?
              <Link
                to="/screens/LoginSignUp/LoginSignUp"
                style={{ textDecoration: 'underline', color: '#000', fontWeight: 'bold', marginLeft: 4 }}
              >
                Inscreva-se
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </>
  );
}
