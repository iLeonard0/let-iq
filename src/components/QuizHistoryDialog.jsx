import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, List, ListItem, ListItemButton, ListItemText, Typography, Box } from "@mui/material";
import QuizIcon from '@mui/icons-material/Quiz';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import { getFirestore, collection, query, where, getDocs, doc, deleteDoc } from "firebase/firestore";
import { getCurrentUser } from "../services/authService";

export default function QuizHistoryDialog({ open, onClose, onSelectQuiz }) {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    const fetchQuizzes = async () => {
      setLoading(true);
      try {
        const db = getFirestore();
        const user = getCurrentUser();
        if (!user) return;
        const q = query(collection(db, "rooms"), where("host.uid", "==", user.uid));
        const querySnapshot = await getDocs(q);
        const quizzesArr = [];
        querySnapshot.forEach((doc) => {
          quizzesArr.push({ id: doc.id, ...doc.data() });
        });
        setQuizzes(quizzesArr);
      } catch {
        setQuizzes([]);
      }
      setLoading(false);
    };
    fetchQuizzes();
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'column', gap: 0.5 }}>
        <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span>Seus Quizzes Criados</span>
          <Button onClick={onClose} sx={{ minWidth: 0, p: 1, color: '#000' }}>
            <CloseIcon />
          </Button>
        </Box>
      </DialogTitle>
      <DialogContent>
        {loading ? (
          <Typography>Carregando...</Typography>
        ) : quizzes.length === 0 ? (
          <Typography>Nenhum quiz encontrado.</Typography>
        ) : (
          <List>
            {quizzes.map((quiz, idx) => (
              <React.Fragment key={quiz.id}>
                <ListItem disablePadding
                  secondaryAction={
                    <Button
                      onClick={async (e) => {
                        e.stopPropagation();
                        if (window.confirm('Tem certeza que deseja excluir este quiz?')) {
                          try {
                            await deleteDoc(doc(getFirestore(), "rooms", quiz.id));
                            setQuizzes(qs => qs.filter(q => q.id !== quiz.id));
                          } catch {}
                        }
                      }}
                      sx={{ minWidth: 0, color: '#F10B5C' }}
                      title="Excluir quiz"
                    >
                      <DeleteIcon />
                    </Button>
                  }
                >
                  <ListItemButton onClick={() => {
                    onSelectQuiz({ ...quiz, salaId: quiz.id });
                  }}>
                    <QuizIcon sx={{ mr: 2 }} />
                    <ListItemText
                      primary={
                        <span>
                          {quiz.titulo || (quiz.perguntas && quiz.perguntas[0]?.pergunta.slice(0, 40) + (quiz.perguntas[0]?.pergunta.length > 40 ? '...' : '')) || 'Quiz sem perguntas'}
                          <span style={{ color: '#F10B5C', fontWeight: 600, marginLeft: 12, fontSize: 13 }}>
                            [Key: {quiz.id}]
                          </span>
                        </span>
                      }
                      secondary={`Perguntas: ${quiz.perguntas ? quiz.perguntas.length : 0}`}
                    />
                  </ListItemButton>
                </ListItem>
                {idx < quizzes.length - 1 && <hr style={{ margin: 0, border: 0, borderBottom: '1px solid #F10B5C' }} />}
              </React.Fragment>
            ))}
          </List>
        )}
      </DialogContent>
    </Dialog>
  );
}
