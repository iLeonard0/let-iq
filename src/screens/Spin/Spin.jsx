import { Box, Typography } from "@mui/material";
import Header from "../../components/header/Header";
import SideBar from "../../components/SideBar/SideBar";

export default function Spin() {
  return (
    <Box sx={{ position: "relative", height: "100vh", overflow: "hidden" }}>
      <Header />
      <SideBar/>
    </Box>
  );
}
