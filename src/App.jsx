import React from "react";
import "./App.css";
import LoginSignUp from "./screens/LoginSignUp/LoginSignUp";
import SignIn from "./screens/LoginSign/SignIn";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import GameScreen from "./screens/GameScreen/GameScreen";
import QuizEditor from "./screens/QuizEditor/QuizEditor";
import { questoesJson } from "./json/questoes";
import { CssBaseline } from "@mui/material";
import { AuthProvider } from "./context/AuthContext";
import ProtectRoute from "./screens/ProtectRoute/ProtectRoute";
import EnterRoom from "./screens/GenericCodeRoom/GenericCodeRoom";
import ChangePassword from "./screens/LoginSign/ChangePassword/ChangePassword";

function App() {
  return (
    <AuthProvider>
      <Router>
        <CssBaseline />
        <link
          href="https://fonts.googleapis.com/css2?family=Titan+One&display=swap"
          rel="stylesheet"
        />
        <Routes>
          <Route path="/" element={<EnterRoom />} />
          <Route path="/screens/LoginSign/SignIn" element={<SignIn />} />
          <Route
            path="/screens/LoginSignUp/LoginSignUp"
            element={<LoginSignUp />}
          />
          <Route
            path="/screens/QuizEditor/QuizEditor"
            element={
              <ProtectRoute>
                <QuizEditor />
              </ProtectRoute>
            }
          />
          <Route
            path="/screens/GenericCodeRoom/GenericCodeRoom"
            element={<EnterRoom />}
          />
          <Route
            path="/screens/GameScreen/GameScreen"
            element={<GameScreen questoesJson={questoesJson[0]} />}
          />
          <Route
            path="/screens/LoginSign/ChangePassword"
            element={<ChangePassword />}
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
