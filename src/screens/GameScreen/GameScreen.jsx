import { Box, Typography, Button, Divider } from "@mui/material";
import React from "react";
import Header from "../../components/header/Header";

export default function GameScreen() {
  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#dcdcdc" }}>
      <Box sx={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 10 }}>
        <Header />
        <Box sx={{ px: 2, flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", mt: 4 }}>
          <Typography variant="h6" color="textSecondary" gutterBottom>
            Banco de dados
          </Typography>
        </Box>

        <Box sx={{mt: 1}} display='flex' justifyContent='center' alignItems='center' flexDirection='column'> 
          <Box sx={{ position: "relative", mb: 4 }}>
            <Box
              sx={{
                position: "relative",
                backgroundColor: "white",
                borderRadius: 8,
                boxShadow: 3,
                minWidth: "800px",
                minHeight: "150px",
                p: 3,
                width: "100%",
                maxWidth: 600,
                textAlign: "center",
                zIndex: 2,
                display: 'flex',
                justifyContent: 'center',
                alignContent: 'center',
              }}
            >
              <Typography variant="h6" display='flex' justifyContent='center' alignItems='center'>
                Como declarar uma variável mutável em JavaScript ?
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              width: "100%",
              maxWidth: 600,
              mt: 6,
            }}
          >
            <Button
              variant="contained"
              disableElevation
              sx={{
                backgroundColor: "#fff",
                color: "#000",
                borderRadius: 3,
                textTransform: "none",
                boxShadow: "none",
                justifyContent: "center",
                height: 48,
              }}
            >
              const x = 10;
            </Button>

            <Button
              variant="contained"
              disableElevation
              sx={{
                backgroundColor: "#fff",
                color: "#000",
                borderRadius: 3,
                textTransform: "none",
                boxShadow: "none",
                justifyContent: "center",
                height: 48,
              }}
            >
              let x = 10;
            </Button>

            <Button
              variant="contained"
              disableElevation
              sx={{
                backgroundColor: "#fff",
                color: "#000",
                borderRadius: 3,
                textTransform: "none",
                boxShadow: "none",
                justifyContent: "center",
                height: 48,
              }}
            >
              immutable x = 10;
            </Button>

            <Button
              variant="contained"
              disableElevation
              sx={{
                backgroundColor: "#fff",
                color: "#000",
                borderRadius: 3,
                textTransform: "none",
                boxShadow: "none",
                justifyContent: "center",
                height: 48,
              }}
            >
              fixed x = 10;
            </Button>
            <Divider sx={{ color: 'black' }} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
