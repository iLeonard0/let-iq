import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Tooltip, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import React from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useNavigate } from 'react-router-dom';

export default function DialogQuizKey({ open, onClose, quizKey, maxWidth }) {
  const [copied, setCopied] = useState(false);
  const [showKey, setShowKey] = useState(false)
  const navigate = useNavigate();

  const handleCopy = () => {
    if (quizKey) {
      navigator.clipboard.writeText(quizKey);
      setCopied(true);
    }
  };

  const handleConfirm = () => {
    if (quizKey) {
      navigate(`/screens/QuizEditor/ResumoLobby/${quizKey}`);
    }
  };

  useEffect(() => {
    if (open) setCopied(false);
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth={maxWidth || 'xs'} fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pr: 1 }}>
        Chave do Quiz
        <IconButton aria-label="fechar" onClick={onClose} size="small" sx={{ ml: 2 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          gap: 1,
          paddingTop: 1,
          paddingBottom: 0
        }}>
          <Typography variant="h6" fontWeight={400}>
            A chave do quiz é:
          </Typography>
          <Typography variant='h6' fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {showKey ? quizKey : '******'}
            <IconButton size="small" onClick={() => setShowKey((v) => !v)}>
              {showKey ? <VisibilityOffIcon /> : <VisibilityIcon />}
            </IconButton>
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleCopy}
          variant='contained'
          color="primary"
          size='medium'
          sx={{ background: '#F10B5C' }}
          disabled={copied}
        >
          {copied ? "Chave copiada" : "Copiar chave"}
        </Button>
        <Button
          onClick={handleConfirm}
          variant='contained'
          color="success"
          size='medium'
          sx={{ background: '#2A2E5D' }}
        >
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  )
}
