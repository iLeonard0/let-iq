import {
  Button,
  TextField,
  Box,
  Typography,
  Radio,
  InputAdornment
} from "@mui/material";
import React, { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import Header from "../../components/header/Header";
import QuizSideBar from "./QuizSideBar/QuizSideBar";

export default function QuizEditor() {
  const [questions, setQuestions] = useState([
    {
      question: "",
      answers: ["", "", "", ""]
    }
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState([0]);

  React.useEffect(() => {
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
      { question: "", answers: ["", "", "", ""] }
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

  return (
    <Box display="flex" width="100%" height="100vh" flexDirection="column" sx={{ background: '#fff' }}>
      <Header />
      <Box display="flex" flexGrow={1}>
        <QuizSideBar
          questions={questions}
          currentIndex={currentIndex}
          onAddQuestion={handleAddQuestion}
          onSelectQuestion={goToQuestion}
          onDeleteQuestion={handleDeleteQuestion}
          maxQuestionsReached={questions.length >= 10}
        />
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start", 
            padding: 4,
            marginTop: 10
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "flex-start", mb: 2, width: '100%' }}>
            <Typography variant="h5" fontWeight='bold' color="#black" mb={2}>
              Pergunta {currentIndex + 1}
            </Typography>
          </Box>
          <TextField
            variant="outlined"
            label={questions[currentIndex].question.length === 0 ? "Comece a digitar a pergunta" : "Pergunta"}
            fullWidth
            value={questions[currentIndex].question}
            onChange={handleQuestionChange}
            sx={{
              marginBottom: 2,
              borderRadius: "8px",
              boxShadow: '0 2px 8px 0 rgba(80, 80, 180, 0.05)',
              '& .MuiOutlinedInput-root': {
                fontSize: '1.1rem',
              },
            }}
          />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: '100%',
              maxWidth: '100%',
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
                  backgroundColor: "#f8fafc",
                  borderRadius: "10px",
                  boxShadow: '0 2px 8px 0 rgba(80, 80, 180, 0.05)',
                  transition: 'box-shadow 0.2s',
                  '&:hover': {
                    boxShadow: '0 4px 16px 0 rgba(80, 80, 180, 0.10)',
                  },
                  minHeight: 80,
                  display: 'flex',
                  alignItems: 'center',

                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Radio
                        color="primary"
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
              marginTop: 3,
            }}
          >
            <Button
              variant="contained"
              sx={{
                textTransform: "none",
                fontWeight: 600,
                fontSize: '1rem',
                borderRadius: 2,
                px: 3,
                py: 1.5,
                background: questions[currentIndex].answers.length === 6 ? '#f44336' : '#3f51b5',
                color: '#fff',
                boxShadow: '0 2px 8px 0 rgba(80, 80, 180, 0.10)',
                '&:hover': {
                  background: questions[currentIndex].answers.length === 6 ? '#d32f2f' : '#283593',
                },
                transition: 'background 0.2s',
              }}
              startIcon={questions[currentIndex].answers.length === 6 ? <RemoveCircleIcon /> : <AddIcon />}
              onClick={() => {
                const updated = [...questions];
                if (questions[currentIndex].answers.length === 4) {
                  updated[currentIndex].answers.push("", "");
                } else if (questions[currentIndex].answers.length === 6) {
                  updated[currentIndex].answers.splice(-2, 2);
                }
                setQuestions(updated);
              }}
              disabled={questions[currentIndex].answers.length < 4 || questions[currentIndex].answers.length > 6}
            >
              {questions[currentIndex].answers.length === 6
                ? "Remover respostas adicionais"
                : "Adicionar mais respostas"}
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}