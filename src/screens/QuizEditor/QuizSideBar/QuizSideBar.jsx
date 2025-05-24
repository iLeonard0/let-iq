import { Box, Typography, Button, List, ListItem, ListItemButton, ListItemText, IconButton, Grow, Divider, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import React, { useEffect, useState } from "react";
import QuizIcon from '@mui/icons-material/Quiz';

export default function QuizSideBar({ questions = [], currentIndex = 0, onAddQuestion, onSelectQuestion, onDeleteQuestion, maxQuestionsReached, onSaveQuiz, isQuizValid }) {
  const [visible, setVisible] = useState(questions.map(() => true));

  useEffect(() => {
    if (questions.length > visible.length) {
      setVisible((prev) => [...prev, true]);
    } else if (questions.length < visible.length) {
      setVisible((prev) => prev.slice(0, questions.length));
    }
  }, [questions.length, visible.length]);

  return (
    <Box
      sx={{
        width: "20%",
        backgroundColor: "#f2f2f2",
        borderRight: "1px solid rgb(235, 235, 235)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: 10,
        p: 2,
        paddingTop: 4
      }}
    >
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Tooltip
          title={maxQuestionsReached ? 'Limite máximo de perguntas atingido' : ''}
          disableHoverListener={!maxQuestionsReached}
        >
          <span style={{ width: '100%' }}>
            <Button
              variant="outlined"
              fullWidth
              sx={{
                marginBottom: 2,
                color: '#F10B5C',
                borderColor: '#F10B5C',
                '&:hover': { borderColor: '#d80f55', color: '#d80f55', background: '#FEECF2' }
              }}
              startIcon={<AddIcon />}
              onClick={onAddQuestion}
              disabled={maxQuestionsReached}
            >
              Adicionar pergunta
            </Button>
          </span>
        </Tooltip>
        <Button
          variant="contained"
          color="success"
          fullWidth
          startIcon={<QuizIcon />}
          sx={{
            marginBottom: 2,
            background: '#F10B5C',
            color: '#fff',
            borderRadius: 2,
            textTransform: 'none',
            '&:hover': { background: '#d80f55' },
            transition: 'background 0.2s',
          }}
          onClick={onSaveQuiz}
          disabled={!isQuizValid}
        >
          CRIAR QUIZ
        </Button>
        <Divider sx={{ width: '97%', mb: 1, borderColor: '#d5d5d5' }} />
        <List sx={{ width: "100%" }}>
          {questions.map((q, idx) => (
            <Grow in={visible[idx]} key={idx} timeout={400}>
              <ListItem
                disablePadding
                sx={{
                  border: "1px solid rgb(214, 214, 214)",
                  boxShadow: 1,
                  borderRadius: 2,
                  marginBottom: 2,

                  background: '#fff'
                }}
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => onDeleteQuestion(idx)}
                    disabled={questions.length === 1}
                    size="small"
                    color="error"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                }
              >
                <ListItemButton
                  selected={idx === currentIndex}
                  onClick={() => onSelectQuestion(idx)}
                  sx={idx === currentIndex ? { background: '#FEECF2!important', borderRadius: 2 } : {}}
                >
                  <ListItemText
                    primary={`Pergunta ${idx + 1}`}
                    secondary={q.question ? q.question.slice(0, 30) : " "}
                  />
                </ListItemButton>
              </ListItem>
            </Grow>
          ))}
        </List>
      </Box>
    </Box>
  );
}
