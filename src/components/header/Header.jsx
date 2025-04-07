import React, { useEffect, useState } from "react";
import { Avatar, Box, Typography } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";

export default function Header({ points }) {
  const [timer, setTimer] = useState(30);

  useEffect(() => {
    setTimer(30);

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      sx={{
        backgroundColor: "#2A2E5D",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        p:1
      }}
    >
      <Avatar sx={{ bgcolor: "#44479C" }}>
        <PersonIcon />
      </Avatar>

      <Box
        sx={{
          backgroundColor: "#44479C",
          color: "white",
          paddingX: 3,
          paddingY: 0.5,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" align="center">
          {points}
        </Typography>
      </Box>

      <Typography variant="h6" color="white">
        {timer}’
      </Typography>
    </Box>
  );
}
