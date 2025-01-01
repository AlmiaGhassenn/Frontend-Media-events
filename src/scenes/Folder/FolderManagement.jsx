import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  List,
  ListItem,
  ListItemText,
  Collapse,
  Pagination,
  Drawer,
  InputAdornment,
} from "@mui/material";
import { ExpandLess, ExpandMore, Folder as FolderIcon } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import Header from "../../components/Header";
import { getFolders, uploadFile, deleteFolder } from "../../api/api";
import SearchIcon from "@mui/icons-material/Search";
import Swal from "sweetalert2"; // Import SweetAlert2

const FolderManagement = () => {
  const [folders, setFolders] = useState([]);
  const [openFolders, setOpenFolders] = useState({});
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [file, setFile] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const filesPerPage = 5;
  const theme = useTheme();
  const backgroundColor = theme.palette.mode === "dark" ? "#1E1E1E" : "#fff";

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const response = await getFolders();
        setFolders(response.data);
      } catch (error) {
        console.error("Error fetching folders:", error.message);
      }
    };

    fetchFolders();
  }, []);

  const toggleFolder = (folderId) => {
    setOpenFolders((prevState) => ({
      ...prevState,
      [folderId]: !prevState[folderId],
    }));
  };

  const handleSelectFolder = (folder) => {
    setSelectedFolder(folder);
    setFile(null);
  };

  const handleFileUpload = async () => {
    const formData = new FormData();
    for (const currentFile of file) {
      formData.append("files", currentFile);
    }

    try {
      await uploadFile(selectedFolder._id, formData);
      Swal.fire({
        title: "Succès!",
        text: "Les fichiers ont été téléversés avec succès.",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      console.error("Error uploading files:", error.message);
      Swal.fire({
        title: "Erreur!",
        text: "Une erreur s'est produite lors du téléversement.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleDeleteFolder = async (folderId) => {
    const result = await Swal.fire({
      title: "Confirmer la suppression",
      text: "Voulez-vous vraiment supprimer ce dossier?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Oui, supprimer!",
      cancelButtonText: "Annuler",
    });

    if (result.isConfirmed) {
      try {
        await deleteFolder(folderId);
        setFolders((prevState) => prevState.filter((folder) => folder._id !== folderId));
        Swal.fire({
          title: "Supprimé!",
          text: "Le dossier a été supprimé avec succès.",
          icon: "success",
          confirmButtonText: "OK",
        });
      } catch (error) {
        console.error("Error deleting folder:", error.message);
        Swal.fire({
          title: "Erreur!",
          text: "Une erreur s'est produite lors de la suppression.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    }
  };

  const filteredFolders = folders.filter((folder) =>
    folder.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box m="20px">
      <Header title="Gestionnaire de dossiers" subtitle="Gérez vos dossiers efficacement" />

      {/* Search Bar */}
      <TextField
        label="Rechercher Des Dossiers"
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{
          mb: 2,
          backgroundColor: backgroundColor,
          "& .MuiInputBase-root": {
            backgroundColor: backgroundColor,
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      {/* Folder Tree View */}
      <List>
        {filteredFolders.map((folder) => (
          <React.Fragment key={folder._id}>
            <ListItem button onClick={() => toggleFolder(folder._id)}>
              <FolderIcon
                sx={{
                  mr: 1,
                  color: theme.palette.mode === "dark" ? "#70D8BD" : "primary.main",
                }}
              />
              <ListItemText primary={folder.name} />
              {openFolders[folder._id] ? <ExpandLess /> : <ExpandMore />}
              <Button
                variant="outlined"
                color="error"
                onClick={() => handleDeleteFolder(folder._id)}
                sx={{ ml: 2 }}
              >
                Supprimer
              </Button>
            </ListItem>
            <Collapse in={openFolders[folder._id]} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem button onClick={() => handleSelectFolder(folder)}>
                  <ListItemText primary="Voir les fichiers" />
                </ListItem>
              </List>
            </Collapse>
          </React.Fragment>
        ))}
      </List>

      {/* Drawer for Selected Folder Details */}
      <Drawer
        anchor="right"
        open={Boolean(selectedFolder)}
        onClose={() => setSelectedFolder(null)}
      >
        <Box width="300px" p={2}>
          {selectedFolder && (
            <>
              <Typography variant="h6">{selectedFolder.name}</Typography>
              {/* File Upload */}
              <Box mt={2}>
                <Typography variant="subtitle1">Téléverser Fichier</Typography>
                <input
                  type="file"
                  multiple
                  onChange={(e) => setFile(e.target.files)}
                  style={{ marginTop: "8px" }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleFileUpload}
                  sx={{ mt: 2 }}
                >
                  Téléverser
                </Button>
              </Box>
              {/* Files in the Folder */}
              <Box mt={3}>
                <Typography variant="subtitle1">Fichiers</Typography>
                <List>
                  {selectedFolder.files
                    ?.slice(
                      (currentPage - 1) * filesPerPage,
                      currentPage * filesPerPage
                    )
                    .map((file, index) => (
                      <ListItem key={index}>
                        <ListItemText primary={file.name} />
                      </ListItem>
                    ))}
                </List>
                <Pagination
                  count={Math.ceil((selectedFolder.files?.length || 0) / filesPerPage)}
                  page={currentPage}
                  onChange={(e, value) => setCurrentPage(value)}
                  sx={{ mt: 2 }}
                />
              </Box>
            </>
          )}
        </Box>
      </Drawer>
    </Box>
  );
};

export default FolderManagement;
