import React, { useState } from "react";
import { Box, Button, TextField } from "@mui/material";
import "./LoginSignUp.css";
import logo from "/public/letiq-logo.png";
import { useNavigate } from "react-router-dom";

export default function LoginSignUp() {
  const [nickname, setNickname] = useState("");
  const navigate = useNavigate();


  const onKeyDown = (event) => {
    if (event.key === "Enter" && nickname.trim()) {
      saveUsername();
    }
  };

  function saveUsername() {
    console.log("Nome salvo:", nickname);
    navigate("/screens/Spin/Spin");
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "100vh",
        textAlign: "center",
        backgroundColor: "#dcdcdc",
      }}
    >
      <Box>
        <img src={logo} alt="Logo" style={{ width: '300px', height: '320px' }} />
      </Box>
      <Box
        sx={{
          width: "100%",
          maxWidth: "450px",
        }}
      >
        <TextField
          label="Digite seu apelido"
          variant="outlined"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          onKeyDown={onKeyDown}
          className="custom-textfield"
          sx={{
            color: "black",
            width: "100%",
            maxWidth: "425px",
            borderRadius: "15px",
            "& .MuiOutlinedInput-root": {
              borderRadius: "15px",
            },
          }}
        />
      </Box>
      {nickname.trim() && (
        <Box
          className="fade-in"
          width="100%"
          maxWidth="450px"
          display="flex"
          justifyContent="center"
        >
          <Button
            onClick={saveUsername}
            sx={{
              backgroundColor: "#21399b",
              marginTop: 1.5,
              width: "100%",
              maxWidth: "425px",
              borderRadius: "15px",
              "& .MuiOutlinedInput-root": {
                borderRadius: "15px",
              },
            }}
            variant="contained"
          >
            Começar
          </Button>
        </Box>
      )}
    </Box>
  );
}
