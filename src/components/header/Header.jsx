import React from "react";
import { AppBar, Toolbar, Typography, Box } from "@mui/material";

export default function Header() {
  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "#FFFFFF",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        padding: "0.5rem 1rem",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box
          component="img"
          src="/public/letiq-logo.png"
          alt="LetIQ Logo"
          sx={{
            height: "70px",
            width: "auto",
          }}
        />
      </Toolbar>
    </AppBar>
  );
}
