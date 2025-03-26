import React from "react";
import { Box, Input, TextField, Typography } from "@mui/material";

export default function LoginSignUp() {
  return (
    <Box>
      <Box sx={{ display: 'flex', alignContent:'center', flexWrap: 'wrap', flexDirection: 'column'}}>
        <Typography variant="h6" sx={{display: 'flex', justifyContent: 'center', p:1 }}>
          Cadastre-se
      </Typography>
        <TextField
          required
          label="Username"
          variant="outlined"
          sx={{
            width: '100%',
            maxWidth: '450px'
            }}>
        </TextField>
        <TextField
          required
          type="password"
          variant="outlined"
          label="Password"
          sx={{
            marginTop: 2,
            width: '100%',
            maxWidth: '450px'
          }}>
        </TextField>
      </Box>
    </Box>
  )
}