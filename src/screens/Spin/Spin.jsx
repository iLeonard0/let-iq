import { Box, Typography } from "@mui/material";
import RouletteWheel from "../../components/RouletteWheel/RouletteWheel";
import Header from "../../components/header/Header";

export default function Spin() {
  return (
    <Box sx={{ position: "relative", height: "100vh", overflow: "hidden" }}>
      <Box sx={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 10 }}>
        <Header />
      </Box>

      <Box sx={{ pt: "80px", textAlign: "center" }}>
        <Typography variant="h6" sx={{ mb: 0 }}>
          Gire a roleta para sortear um tópico:
        </Typography>ssssssss

        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center"}}>
          <RouletteWheel />
        </Box>
      </Box>
    </Box>
  );
}
