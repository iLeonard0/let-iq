import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { useState, useEffect } from "react";
import {
  getDoc,
  doc,
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  deleteDoc,
  getDocs,
} from "firebase/firestore";
import { db } from "../../services/firebase";
import { useNavigate } from "react-router-dom";

export default function EnterRoom() {
  const [codigo, setCodigo] = useState("");
  const [nome, setNome] = useState("");
  const [salaExiste, setSalaExiste] = useState(false);
  const [jogadores, setJogadores] = useState([]);
  const navigate = useNavigate();

  const isButtonDisabled = codigo.trim().length < 4 || nome.trim().length < 2;

  const buscarSalaPorCodigo = async () => {
    const docRef = doc(db, "rooms", codigo.trim());
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setSalaExiste(true);
      escutarJogadores();
      adicionarJogador();
    } else {
      alert("Nenhuma sala com esse código.");
    }
  };

  const sairDaSala = () => {
    setSalaExiste(false);
    setCodigo("");
    setNome("");
    navigate("/");  
  };

  const adicionarJogador = async () => {
    const playersRef = collection(db, "rooms", codigo.trim(), "players");
    const q = query(playersRef);
    const snapshot = await getDocs(q);

    const nameExists = snapshot.docs.some(
      (doc) => doc.data().name.toLowerCase() === nome.trim().toLowerCase()
    );

    if (nameExists) {
      alert("Já existe um jogador com esse nome na sala.");
      return;
    }

    await addDoc(playersRef, {
      name: nome.trim(),
      joinedAt: serverTimestamp(),
    });
  };

  const escutarJogadores = () => {
    const playersRef = collection(db, "rooms", codigo.trim(), "players");
    const q = query(playersRef, orderBy("joinedAt"));

    return onSnapshot(q, (snapshot) => {
      const lista = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setJogadores(lista);
    });
  };

  useEffect(() => {
    if (!salaExiste || !nome.trim() || !codigo.trim()) return;
    const playersRef = collection(db, "rooms", codigo.trim(), "players");
    let playerId = null;
    const q = query(playersRef, orderBy("joinedAt"));
    const unsub = onSnapshot(q, (snapshot) => {
      const found = snapshot.docs.find(
        (doc) => doc.data().name === nome.trim()
      );
      if (found) playerId = found.id;
    });
    const removePlayer = async () => {
      if (playerId) {
        try {
          await deleteDoc(doc(playersRef, playerId));
        } catch {
          console.error("Erro ao remover jogador.");
        }
      }
    };
    const handleUnload = () => {
      removePlayer();
    };
    window.addEventListener("beforeunload", handleUnload);
    return () => {
      window.removeEventListener("beforeunload", handleUnload);
      removePlayer();
      unsub();
    };
  }, [salaExiste, nome, codigo]);

  return (
    <Box
      sx={{
        minHeight: "100svh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        position: "relative",
        p: 2,
        mt: 2,
      }}
    >
      <Box
        component="img"
        src="/public/letiq-logo.png"
        alt="LetIQ Logo"
        sx={{
          height: "120px",
          width: "auto",
          mt: 2,
          mb: 1,
          alignSelf: "center",
        }}
      />
      <Paper
        elevation={6}
        sx={{
          padding: 4,
          borderRadius: "20px",
          maxWidth: "450px",
          width: "100%",
          backgroundColor: "#ffffff",
          margin: "auto",
          mt: 3,
          mb: 0,
          display: "flex",
          flexDirection: "column", 
          justifyContent: "center",
          boxShadow: 3,
        }}
      >
        {!salaExiste ? (
          <>
            <Typography variant="h5" fontWeight="bold" mb={3} align="center">
              Entrar na Sala
            </Typography>

            <Typography
              variant="h7"
              gutterBottom
              sx={{
                display: "flex",
                fontWeight: "bold",
                marginBottom: 0,
              }}
            >
              Código da Sala
            </Typography>
            <TextField 
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              type="number"
              onWheel={(e) => e.target.blur()}
              className="custom-textfield"
              sx={{
                width: "100%",
                marginBottom: 1,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "5px",
                },
              }}
            />

            <Typography
              variant="h7" 
              sx={{
                display: "flex",
                fontWeight: "bold",
                marginBottom: 0,
              }}
            >
              Nome de Usuário
            </Typography>

            <TextField 
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              sx={{ mb: 4, width: "100%" }}
            />

            <Button
              variant="contained"
              disabled={isButtonDisabled}
              onClick={buscarSalaPorCodigo}
              sx={{
                backgroundColor: isButtonDisabled ? "#d3d3d3" : "#21399b",
                color: isButtonDisabled ? "#a9a9a9" : "white",
                width: "100%",
                borderRadius: "10px",
                padding: 1,
                fontWeight: "bold",
                textTransform: "none",
                transition: "transform 0.2s cubic-bezier(.4,2,.6,1)",
                "&:hover": {
                  backgroundColor: isButtonDisabled ? "#d3d3d3" : "#1a2e7b",
                  transform: "scale(1.05)",
                },
              }}
            >
              Entrar
            </Button>
          </>
        ) : (
          <>
            <Typography variant="h5" fontWeight="bold" mb={2}>
              Sala {codigo}
            </Typography>
            <Typography mb={2}>Aguardando o host iniciar...</Typography>

            <List sx={{ width: "100%", bgcolor: "background.paper", mb: 2 }}>
              {jogadores.map((j) => (
                <ListItem key={j.id} disablePadding>
                  <ListItemText primary={j.name} sx={{ pl: 1 }} />
                </ListItem>
              ))}
            </List>

            <Button
              variant="contained"
              onClick={sairDaSala}
              sx={{
                backgroundColor: "#d32f2f",
                color: "white",
                width: "100%",
                borderRadius: "10px",
                padding: 1,
                fontWeight: "bold",
                textTransform: "none",
                "&:hover": { backgroundColor: "#9a2424" },
              }}
            >
              Sair da Sala
            </Button>
          </>
        )}
      </Paper>
      {!salaExiste ? (
        <Box
          sx={{
            position: "fixed",
            bottom: 8,
            left: 0,
            width: "100%",
            display: "flex",
            justifyContent: "center",
            pointerEvents: "none",
            zIndex: 1200,
          }}
        >
          <Button
            href="/screens/LoginSign/SignIn"
            sx={{
              pointerEvents: "auto",
              color: "#21399b",
              background: "none",
              fontSize: "1rem",
              fontWeight: 500,
              textTransform: "none",
              boxShadow: "none",
              borderRadius: "8px",
              minWidth: 0,
              padding: 0.5,
              opacity: 0.85,
              transition:
                "background 0.2s, color 0.2s, transform 0.2s cubic-bezier(.4,2,.6,1)",
              "&:hover": {
                background: "#f5f5f5",
                color: "#1a2e7b",
                transform: "scale(1.05)",
              },
            }}
          >
            ...Ou crie seu próprio Quiz
          </Button>
        </Box>
      ) : (
        <Box
          sx={{
            position: "fixed",
            bottom: 8,
            left: 0,
            width: "100%",
            display: "flex",
            justifyContent: "center",
            pointerEvents: "none",
            zIndex: 1200,
          }}
        />
      )}
    </Box>
  );
}
