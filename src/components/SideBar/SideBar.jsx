import { Box, Typography } from "@mui/material";
import React from "react";

export default function SideBar() {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        backgroundColor: "#f5f5f5",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: 2,
      }}
    >
      <Typography variant="h4" sx={{ marginBottom: 2 }}>
        SideBar
      </Typography>
        {/* Add your sidebar content here */}
    </Box>
  );
}