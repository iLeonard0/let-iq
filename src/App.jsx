import React from 'react'
import './App.css'
import LoginSignUp from './screens/LoginSignUp/LoginSignUp'
import SignIn from './screens/LoginSign/SignIn'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import GameScreen from './screens/GameScreen/GameScreen';
import Spin from './screens/Spin/Spin';
import { questoesJson } from './json/questoes';
import { CssBaseline } from '@mui/material';
import { AuthProvider } from './context/AuthContext';
import ProtectRoute from './screens/ProtectRoute/ProtectRoute';

function App() {

  return (
    <AuthProvider>
      <Router>
        <CssBaseline />
        <link href="https://fonts.googleapis.com/css2?family=Titan+One&display=swap" rel="stylesheet" />
        <Routes>
          <Route path='/' element={
            <ProtectRoute>
              <SignIn />
            </ProtectRoute>} />
          <Route path='/screens/LoginSignUp/LoginSignUp' element={<LoginSignUp />} />
          <Route path='/screens/Spin/Spin' element={<Spin />} />
          <Route path='/screens/GameScreen/GameScreen' element={<GameScreen questoesJson={questoesJson[0]} />} />
        </Routes>
      </Router>
    </AuthProvider>

  )
}

export default App
