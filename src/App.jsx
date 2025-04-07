import React from 'react'
import './App.css'
import LoginSignUp from './screens/LoginSignUp/LoginSignUp'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import GameScreen from './screens/GameScreen/GameScreen';
import Spin from './screens/Spin/Spin';
import { questoesJson } from './json/questoes';
import { CssBaseline } from '@mui/material';

function App() {

  return (
    <Router>
      <CssBaseline />
      <Routes>
        <Route path='/' element={<LoginSignUp />} />
        <Route path='/screens/Spin/Spin' element={<Spin/>}/>
        <Route path='/screens/GameScreen/GameScreen' element={<GameScreen questoesJson={questoesJson[0]} />} />
      </Routes>
    </Router>

  )
}

export default App
