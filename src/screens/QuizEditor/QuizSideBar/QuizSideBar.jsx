import { Box, Typography, Button, List, ListItem, ListItemButton, ListItemText, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

export default function QuizSideBar({ questions = [], currentIndex = 0, onAddQuestion, onSelectQuestion, onDeleteQuestion, maxQuestionsReached }) {
  return (
    <Box
      sx={{
        width: "20%",
        backgroundColor: "#ffffff",
        borderRight: "1px solid #e0e0e0",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: 2,
        marginTop: 11.5,
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
        <Button
          variant="contained"
          fullWidth
          sx={{ marginBottom: 2 }}
          startIcon={<AddIcon />}
          onClick={onAddQuestion}
          disabled={maxQuestionsReached}
        >
          Adicionar pergunta
        </Button>
        <List sx={{ width: "100%" }}>
          {questions.map((q, idx) => (
            <ListItem key={idx} disablePadding
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
              >
                <ListItemText
                  primary={`Pergunta ${idx + 1}`}
                  secondary={q.question ? q.question.slice(0, 30) : " "}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
}
