import {
  Button,
  TextField,
  Card,
  CardContent,
  IconButton,
  Box,
  Typography
} from "@mui/material";
import React from "react";
import AddIcon from "@mui/icons-material/Add";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import Header from "../../components/header/Header";

export default function QuizEditor() {
  return (
    <Box display="flex" width="100%" height="100vh" flexDirection="column">
      <Header />
      <Box display="flex" flexGrow={1}>
        <Box
          sx={{
            width: "20%",
            backgroundColor: "#ffffff",
            borderRight: "1px solid #e0e0e0",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: 2,
            marginTop: 8, // Adjust for header height
          }}
        >
          {/* Sidebar content */}
          <Typography variant="h6" fontWeight="bold" mb={2}>
            Quiz
          </Typography>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Button
              variant="contained"
              fullWidth
              sx={{ marginBottom: 1 }}
              startIcon={<AddIcon />}
            >
              Adicionar pergunta
            </Button>
          </Box>
        </Box>

        {/* Main Content */}
        <Box
          sx={{
            flexGrow: 1,
            backgroundColor: "#f5f5f5",
            display: "flex",
            flexDirection: "column",
            padding: 3,
            marginTop: 10, 
          }}
        >
          {/* Question Input */}
          <TextField
            variant="outlined"
            label="Digite sua pergunta aqui"
            fullWidth
            sx={{
              marginBottom: 2,
              backgroundColor: "#ffffff",
              borderRadius: "8px",
            }}
          />

          {/* Media Upload */}
          <Box
            sx={{
              width: "100%",
              height: "200px",
              backgroundColor: "#ffffff",
              borderRadius: "8px",
              border: "2px dashed #e0e0e0",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 2,
            }}
          >
            <IconButton>
              <ImageOutlinedIcon fontSize="large" />
            </IconButton>
            <Typography>Encontre e insira mídia</Typography>
            <Typography variant="caption">
              Carregar arquivo ou arraste aqui para fazer upload
            </Typography>
          </Box>

          {/* Answer Options */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 2,
            }}
          >
            {[1, 2, 3, 4].map((num) => (
              <TextField
                key={num}
                variant="outlined"
                label={`Alternativa ${num}`}
                fullWidth
                sx={{
                  backgroundColor: "#ffffff",
                  borderRadius: "8px",
                }}
              />
            ))}
          </Box>

          {/* Add More Answers */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              marginTop: 3,
            }}
          >
            <Button
              variant="text"
              sx={{
                textTransform: "none",
              }}
              startIcon={<AddIcon />}
            >
              Adicionar mais respostas
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}