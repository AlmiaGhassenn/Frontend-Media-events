import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Typography,
  Box,
  Container,
  Grid,
} from "@mui/material";
import { createFolder, getUsers } from "../../api/api";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; // Import SweetAlert2

const CreateFolder = () => {
  const [newFolder, setNewFolder] = useState({ name: "", sharedWith: "", permission: "" });
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getUsers();
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error.message);
      }
    };

    fetchUsers();
  }, []);

  const handleFolderCreate = async () => {
    if (!newFolder.name || !newFolder.sharedWith || !newFolder.permission) {
      Swal.fire({
        icon: "warning",
        title: "Champs manquants",
        text: "Veuillez remplir tous les champs avant de continuer.",
      });
      return;
    }

    try {
      await createFolder(newFolder);
      Swal.fire({
        icon: "success",
        title: "Succès",
        text: "Le dossier a été créé avec succès !",
      });
      setNewFolder({ name: "", sharedWith: "", permission: "" });
      navigate("/folders");
    } catch (error) {
      console.error("Error creating folder:", error.message);
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Une erreur est survenue lors de la création du dossier. Veuillez réessayer.",
      });
    }
  };

  return (
    <Container maxWidth="sm" sx={{ paddingTop: "40px" }}>
      <Box
        sx={{
          padding: "20px",
          backgroundColor: (theme) =>
            theme.palette.mode === "light" ? "#ffffff" : "#1F2A40",
          borderRadius: "10px",
          boxShadow: (theme) =>
            theme.palette.mode === "light"
              ? "0px 4px 12px rgba(0, 0, 0, 0.1)"
              : "0px 4px 12px rgba(164, 42, 42, 0.1)",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            marginBottom: "20px",
            textAlign: "center",
            color: (theme) =>
              theme.palette.mode === "light" ? "black" : "#70D8BD",
          }}
        >
          Ajouter nouveau Dossier
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Nom du Dossier"
              fullWidth
              value={newFolder.name}
              onChange={(e) => setNewFolder({ ...newFolder, name: e.target.value })}
              variant="outlined"
              sx={{
                "& .MuiInputLabel-root": {
                  color: (theme) =>
                    theme.palette.mode === "light" ? "black" : "#70D8BD",
                },
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth variant="outlined" sx={{ marginTop: "20px" }}>
              <InputLabel
                sx={{
                  color: (theme) =>
                    theme.palette.mode === "light" ? "black" : "#70D8BD",
                }}
              >
                Partager Avec
              </InputLabel>
              <Select
                value={newFolder.sharedWith}
                onChange={(e) =>
                  setNewFolder({ ...newFolder, sharedWith: e.target.value })
                }
                label="Partager Avec"
              >
                {users.map((user) => (
                  <MenuItem key={user._id} value={user._id}>
                    {user.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth variant="outlined" sx={{ marginTop: "20px" }}>
              <InputLabel
                sx={{
                  color: (theme) =>
                    theme.palette.mode === "light" ? "black" : "#70D8BD",
                }}
              >
                Permission
              </InputLabel>
              <Select
                value={newFolder.permission}
                onChange={(e) =>
                  setNewFolder({ ...newFolder, permission: e.target.value })
                }
                label="Permission"
              >
                <MenuItem value="download">Télécharger</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Button
              onClick={handleFolderCreate}
              variant="contained"
              fullWidth
              sx={{
                backgroundColor: (theme) =>
                  theme.palette.mode === "light" ? "black" : "#70D8BD",
                color: "#fff",
                padding: "12px",
                "&:hover": { backgroundColor: "#fff", color: "black" },
                marginTop: "20px",
              }}
            >
              Créer Votre Dossier
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default CreateFolder;
