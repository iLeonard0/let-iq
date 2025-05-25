import { Box, Button, Paper, TextField, Typography, List, ListItem, ListItemText } from "@mui/material";
import { useState, useEffect } from "react";
import { getDoc, doc, onSnapshot, arrayUnion, updateDoc } from "firebase/firestore";
import { db } from "../../services/firebase";
import { useNavigate } from "react-router-dom";
import Header from "../../components/header/Header";

export default function EnterRoom() {
  const [salaExiste, setSalaExiste] = useState(false);
  const [jogadores, setJogadores] = useState([]);
  const [codigo, setCodigo] = useState(() => localStorage.getItem("salaCodigo") || "");
  const [nome, setNome] = useState(() => localStorage.getItem("playerName") || "");

  const navigate = useNavigate();
  const isButtonDisabled = codigo.trim().length < 4 || nome.trim().length < 2;

  const buscarSalaPorCodigo = async () => {
    const docRef = doc(db, "rooms", codigo.trim());
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setSalaExiste(true);
      localStorage.setItem("salaCodigo", codigo.trim());
      escutarJogadores();
      await adicionarJogador();
    } else {
      alert("Nenhuma sala com esse código.");
      limparCacheSala();
    }
  };

  const sairDaSala = async () => {
    setSalaExiste(false);
    setCodigo("");
    setNome("");
    limparCacheSala();
    navigate("/");
  };

  function limparCacheSala() {
    localStorage.removeItem("salaCodigo");
    localStorage.removeItem("playerName");
  }

  const adicionarJogador = async () => {
    const salaRef = doc(db, "rooms", codigo.trim());
    const salaSnap = await getDoc(salaRef);

    if (!salaSnap.exists()) {
      alert("Sala não encontrada.");
      limparCacheSala();
      return;
    }

    const jogadoresAtuais = salaSnap.data().jogadores || [];

    if (jogadoresAtuais.map(j => j.toLowerCase()).includes(nome.trim().toLowerCase())) {
      alert("Já existe um jogador com esse nome na sala.");
      limparCacheSala();
      return;
    }

    await updateDoc(salaRef, {
      jogadores: arrayUnion(nome.trim()),
    });

    localStorage.setItem("playerName", nome.trim());
    localStorage.setItem("salaCodigo", codigo.trim());
  };

  const escutarJogadores = () => {
    const salaAtual = localStorage.getItem("salaCodigo") || codigo.trim();
    const salaRef = doc(db, "rooms", salaAtual);
    
    return onSnapshot(salaRef, (docSnap) => {
      if (docSnap.exists()) {
        const jogadoresArray = docSnap.data().jogadores || [];
        setJogadores(jogadoresArray);
      } else {
        setJogadores([]);
      }
    });
  };

  useEffect(() => {
    const cachedName = localStorage.getItem("playerName");
    const cachedCodigo = localStorage.getItem("salaCodigo");

    if (cachedName && cachedCodigo) {
      setNome(cachedName);
      setCodigo(cachedCodigo);
      (async () => {
        const docRef = doc(db, "rooms", cachedCodigo);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setSalaExiste(true);
          escutarJogadores();
        } else {
          limparCacheSala();
          setSalaExiste(false);
          setCodigo("");
          setNome("");
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Header />

      <Box
        sx={{
          minHeight: "100svh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          position: "relative",
          backgroundColor: "#f5f5f5",
          p: 2,
          mt: 2,
        }}
      >
        <Box
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
              <Typography variant="h1" gutterBottom sx={{
                fontSize: "2rem",
                lineHeight: "2rem",
                fontWeight: "700",
                textAlign: "center",
                mb: 6
              }}>
                Entrar na Sala
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" gutterBottom sx={{
                    display: "flex",
                    fontWeight: "bold",
                    marginBottom: 0,
                    fontSize: "1.2rem",
                  }}>
                    Nome de Usuário
                  </Typography>
                  <TextField
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    sx={{ width: "100%" }}
                  />

                </Box>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{
                    display: "flex",
                    fontWeight: "bold",
                    marginBottom: 0,
                    fontSize: "1.2rem",
                  }}>
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
                      marginBottom: 0.5,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "5px",
                      },
                    }}
                  />
                </Box>
                <Box>
                  <Button
                    variant="contained"
                    disabled={isButtonDisabled}
                    onClick={buscarSalaPorCodigo}
                    sx={{
                      backgroundColor: isButtonDisabled ? "#d3d3d3" : "#F10B5C",
                      color: isButtonDisabled ? "#a9a9a9" : "white",
                      width: "100%",
                      borderRadius: "10px",
                      padding: 1,
                      fontWeight: "bold",
                      textTransform: "none",
                      transition: "transform 0.2s cubic-bezier(.4,2,.6,1)",
                      "&:hover": {
                        backgroundColor: isButtonDisabled ? "#d3d3d3" : "#d80f55",
                        transform: "scale(1.05)",
                      },
                    }}
                  >
                    Entrar
                  </Button>
                </Box>
              </Box>
            </>
          ) : (
            <>
              <Typography variant="h5" fontWeight="bold" mb={1}>
                Sala {codigo}
              </Typography>
              <Typography mb={2}>Aguardando o host iniciar a partida</Typography>
              {(() => {
                const current = jogadores.filter(j => j === nome.trim());
                const others = jogadores.filter(j => j !== nome.trim());
                const ordered = [...current, ...others];
                return (
                  <List sx={{ width: "100%", bgcolor: "background.paper", mb: 2 }}>
                    {ordered.map((j) => {
                      const isCurrent = j === nome.trim();
                      return (
                        <ListItem key={j} disablePadding>
                          <ListItemText
                            primary={
                              <span
                                style={{
                                  fontWeight: isCurrent ? 700 : 400,
                                  color: isCurrent ? "#21399b" : undefined,
                                  fontSize: isCurrent ? "1.1rem" : undefined,
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                {isCurrent && (
                                  <span
                                    style={{
                                      display: "inline-block",
                                      width: 8,
                                      height: 8,
                                      borderRadius: "50%",
                                      background: "#21399b",
                                      marginRight: 8,
                                    }}
                                  />
                                )}
                                {j}
                                {isCurrent && (
                                  <span style={{ marginLeft: 8, fontSize: "0.9em", color: "#21399b", fontWeight: 500 }}>
                                    (você)
                                  </span>
                                )}
                              </span>
                            }
                            sx={{ pl: 1 }}
                          />
                        </ListItem>
                      );
                    })}
                  </List>
                );
              })()}

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
                color: "#000",
                textAlign: 'center',
                background: "none",
                fontSize: "1rem",
                fontWeight: 500,
                textTransform: "none",
                boxShadow: "none",
                borderRadius: "8px",
                minWidth: 0,
                padding: 1,
                opacity: 0.85,
                transition:
                  "background 0.2s, color 0.2s, transform 0.2s cubic-bezier(.4,2,.6,1)",
                "&:hover": {
                  background: "#f5f5f5",
                  color: "#000",
                  transform: "scale(1.05)",
                },
              }}
            >
              Crie seu quiz Gratuitamente aqui
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
    </>
  );
}
