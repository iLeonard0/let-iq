import { Person } from "@mui/icons-material";
import { Avatar, Box, Typography } from "@mui/material";

// Header.jsx
export default function Header({ points, timer }) {
  return (
    <Box
      sx={{
        backgroundColor: "#2A2E5D",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        p: 1,
      }}
    >
      <Avatar sx={{ bgcolor: "#44479C" }}>
        <Person />
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
