import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { resetPassword } from "../../../services/authService";

export default function DialogChangePassword({
  open,
  onClose,
  fullWidth,
  maxWidth,
}) {
  const [email, setEmail] = useState("");
  const isButtonDisabled = !(email.trim());

  const handleSendResetLink = async (e) => {
    e.preventDefault();
    try {
      await resetPassword(email);
      alert("Link de redefinição enviado para o seu email.");
      onClose();
    } catch (error) {
      console.error("Erro ao enviar link de redefinição:", error);
      alert("Erro ao enviar link de redefinição. Tente novamente.");
    }
  };

  return (
    <Dialog
      onClose={onClose}
      open={open}
      fullWidth={fullWidth}
      maxWidth={maxWidth}
      PaperProps={{
        sx: {
          borderRadius: "20px",
          padding: 0,
          backgroundColor: "#fff",
          maxWidth: "450px",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 4,
          backgroundColor: "#fff",
        }}
      >
        <DialogTitle
          sx={{
            fontSize: "1.5rem",
            fontWeight: "700",
            textAlign: "center",
            width: "100%",
            padding: 0,
            marginBottom: 3, 
            background: "none",
          }}
        >
          Redefinir Senha
        </DialogTitle>
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
          }}
        />
        <Button
          onClick={handleSendResetLink}
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
            transition: "background-color 0.3s ease, transform 0.2s cubic-bezier(.4,2,.6,1)",
            marginTop: 2,
            marginBottom: 1,
            "&:hover": {
              backgroundColor: isButtonDisabled ? "#d3d3d3" : "#1a2e7b",
              transform: "scale(1.05)",
            },
          }}
          variant="contained"
        >
          Enviar Link de Redefinição
        </Button>
        <Button
          onClick={onClose}
          sx={{
            color: "#21399b",
            textTransform: "none",
            fontWeight: "bold",
            fontSize: "1rem",
            marginTop: 1,
            transition: "transform 0.2s cubic-bezier(.4,2,.6,1)",
            "&:hover": {
              transform: "scale(1.05)",
            },
          }}
        >
          Cancelar
        </Button>
      </Box>
    </Dialog>
  );
}
