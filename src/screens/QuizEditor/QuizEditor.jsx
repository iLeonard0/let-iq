import React from "react";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from '@mui/icons-material/Remove';
import Header from "../../components/header/Header";
import QuizSideBar from "./QuizSideBar/QuizSideBar";
import DialogQuizKey from "./DialogQuizKey/DialogQuizKey";
import { useEffect, useState } from "react";
import { getFirestore, collection, setDoc, doc } from "firebase/firestore";
import { Button, TextField, Box, Typography, Radio, InputAdornment, Divider, FormControl, InputLabel, Select, MenuItem, FormHelperText } from "@mui/material";
import { getCurrentUser } from "../../services/authService";
import { useNavigate } from "react-router-dom";

export default function QuizEditor() {
  const [questions, setQuestions] = useState([
    {
      question: "",
      answers: ["", "", "", ""],
      timer: 30
    }
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState([0]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [quizKey, setQuizKey] = useState("");

  const navigate = useNavigate();

  const isQuizValid = questions.length > 0 &&
    questions.some(q => q.question.trim() !== "" && q.answers.some(a => a.trim() !== ""));

  useEffect(() => {
    if (correctAnswers.length < questions.length) {
      setCorrectAnswers((prev) => [
        ...prev,
        ...Array(questions.length - prev.length).fill(0)
      ]);
    }
  }, [questions.length, correctAnswers.length]);

  const handleAddQuestion = () => {
    if (questions.length >= 10) return;
    setQuestions((prev) => [
      ...prev,
      { question: "", answers: ["", "", "", ""], timer: 30 }
    ]);

    setCurrentIndex(questions.length);
  };

  const handleQuestionChange = (e) => {
    const updated = [...questions];
    updated[currentIndex].question = e.target.value;

    setQuestions(updated);
  };

  const handleAnswerChange = (idx, e) => {
    const updated = [...questions];
    updated[currentIndex].answers[idx] = e.target.value;

    setQuestions(updated);
  };

  const handleCorrectAnswerChange = (idx) => {
    const updated = [...correctAnswers];
    updated[currentIndex] = idx;

    setCorrectAnswers(updated);
  };

  const goToQuestion = (idx) => setCurrentIndex(idx);

  const handleDeleteQuestion = (idx) => {
    if (questions.length === 1) return;
    const updated = questions.filter((_, i) => i !== idx);
    setQuestions(updated);

    if (currentIndex >= updated.length) {
      setCurrentIndex(updated.length - 1);
    }
  };

  const handleAddAnswer = () => {
    const updated = [...questions];
    if (questions[currentIndex].answers.length === 4) {
      updated[currentIndex].answers.push("", "");
    } else if (questions[currentIndex].answers.length === 6) {
      updated[currentIndex].answers.splice(-2, 2);
    }

    setQuestions(updated);
  }

  const handleTimerChange = (e) => {
    const updated = [...questions];
    updated[currentIndex].timer = parseInt(e.target.value, 10);
    setQuestions(updated);
  };

  const generateQuizJson = () => {
    const host = getCurrentUser()

    if (!getCurrentUser) {
      console.error("Usuário não autenticado")
      return null
    }

    const quizData = {
      status: "aguardando",
      host: {
        displayName: host.displayName,
        email: host.email,
        uid: host.uid,
      },
      jogadores: [],
      perguntas: questions.map((questions, index) => ({
        pergunta: questions.question,
        alternativas: questions.answers,
        respostaCorreta: correctAnswers[index],
        tempo: questions.timer
      }))
    };

    return quizData;
  }

  const generateRoomKey = () => {
    return Math.floor(10000 + Math.random() * 90000).toString();
  };

  const saveQuizFirebase = async () => {
    try {
      const quizData = generateQuizJson();

      if (!quizData) return

      const roomKey = generateRoomKey();
      const db = getFirestore();
      const collectionRef = collection(db, "rooms");
      const docRef = doc(collectionRef, roomKey);
      await setDoc(docRef, quizData);

      setQuizKey(roomKey);
      setDialogOpen(true);
      // Redireciona o host para o ResumoLobby da sala criada
      navigate(`/screens/QuizEditor/ResumoLobby/${roomKey}`);
    } catch (error) {
      console.error("Erro ao salvar no Firestore:", error.message);
    }
  };


  return (
    <Box display="flex" width="100%" height="100vh" flexDirection="column" overflow="auto" sx={{ background: '#fff' }}>
      <Header />
      <Box display="flex" flexGrow={1}>
        <QuizSideBar
          questions={questions}
          currentIndex={currentIndex}
          onAddQuestion={handleAddQuestion}
          onSelectQuestion={goToQuestion}
          onDeleteQuestion={handleDeleteQuestion}
          maxQuestionsReached={questions.length >= 10}
          onSaveQuiz={saveQuizFirebase}
          isQuizValid={isQuizValid}
        />
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            padding: 4,
            pr: 4,
            pl: 4,
            marginTop: 10,
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3, width: '100%', alignItems: 'center', textAlign: 'center' }}>
            <Typography variant="h5" fontWeight='bold' color="#black">
              Pergunta {currentIndex + 1}
            </Typography>
            <FormControl required>
              <InputLabel id="timer-select-label">Tempo (s)</InputLabel>
              <Select
                labelId="timer-select-label"
                id="timer-select"
                value={questions[currentIndex].timer}
                label="Tempo (s) *"
                onChange={handleTimerChange}
                size="medium"
              >
                <MenuItem value={10}>10 segundos</MenuItem>
                <MenuItem value={20}>20 segundos</MenuItem>
                <MenuItem value={30}>30 segundos</MenuItem>
                <MenuItem value={45}>45 segundos</MenuItem>
                <MenuItem value={60}>60 segundos</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <TextField
            variant="outlined"
            label={questions[currentIndex].question.length === 0 ? "Comece a digitar a pergunta" : "Pergunta"}
            fullWidth
            value={questions[currentIndex].question}
            onChange={handleQuestionChange}
            sx={{
              marginBottom: 3,
              borderRadius: "8px",
              '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#F10B5C',
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#F10B5C',
              },
            }}
          />
          <Divider sx={{ width: '100%', mb: 3 }} />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: '100%',
              maxWidth: '100%',
              gap: 2
            }}
          >
            {questions[currentIndex].answers.map((ans, idx) => (
              <TextField
                key={idx}
                variant="outlined"
                label={`Alternativa ${idx + 1}`}
                fullWidth
                value={ans}
                onChange={(e) => handleAnswerChange(idx, e)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#F10B5C',
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#F10B5C',
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Radio
                        color='error'
                        checked={correctAnswers[currentIndex] === idx}
                        onChange={() => handleCorrectAnswerChange(idx)}
                        value={idx}
                        inputProps={{ 'aria-label': `Alternativa ${idx + 1}` }}
                      />
                    </InputAdornment>
                  )
                }}
              />
            ))}
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              marginTop: 2,
            }}
          >
            <Button
              variant="contained"
              sx={{
                textTransform: "none",
                borderRadius: 2,
                background: questions[currentIndex].answers.length === 6 ? '#000' : '#F10B5C',
                color: '#fff',
                boxShadow: '0 2px 8px 0 rgba(80, 80, 180, 0.10)',
                '&:hover': {
                  background: questions[currentIndex].answers.length === 6 ? '#000' : '#F10B5C',
                },
                transition: 'background 0.2s',
              }}
              startIcon={questions[currentIndex].answers.length === 6 ? <RemoveIcon /> : <AddIcon />}
              onClick={() => handleAddAnswer()}
              disabled={questions[currentIndex].answers.length < 4 || questions[currentIndex].answers.length > 6}
            >
              {questions[currentIndex].answers.length === 6
                ? "REMOVER RESPOSTAS ADICIONAIS"
                : "ADICIONAR MAIS RESPOSTAS"}
            </Button>
          </Box>
        </Box>
        <DialogQuizKey
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          quizKey={quizKey}
          maxWidth="xs"
        />
      </Box>
    </Box>
  );
}