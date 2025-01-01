import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Collapse,
  IconButton,
  Pagination,
  TextField,
  Modal,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import axios from 'axios';
import { ExpandMore, ExpandLess, Download, Visibility } from "@mui/icons-material";
import { getClientFolders } from "../../api/api";

const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#90caf9",
    },
    secondary: {
      main: "#f48fb1",
    },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#90caf9",
    },
    secondary: {
      main: "#f48fb1",
    },
  },
});

const ClientFolderManagement = () => {
  const [folders, setFolders] = useState([]);
  const [filteredFolders, setFilteredFolders] = useState([]);
  const [expandedFolders, setExpandedFolders] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [themeMode, setThemeMode] = useState("dark");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);
  const foldersPerPage = 6;

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const response = await getClientFolders();
        setFolders(response.data);
        setFilteredFolders(response.data);
      } catch (error) {
        console.error("Error fetching folders:", error.message);
      }
    };
    fetchFolders();
  }, []);

  const handleFolderDownload = async (folderId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const downloadUrl = `http://localhost:5000/api/client/files/folder/${folderId}`;
      const response = await axios.get(downloadUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: 'blob',
      });

      const disposition = response.headers['content-disposition'];
      const folderName = disposition ? disposition.split('filename=')[1].replace(/"/g, '') : 'folder_files.zip';

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', folderName);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error during folder download:', error.message);
      alert('An error occurred while downloading the folder. Please try again.');
    }
  };

  const handleFileDownload = async (fileId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const downloadUrl = `http://localhost:5000/api/client/files/${fileId}`;
      const response = await axios.get(downloadUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: 'blob',
      });

      const disposition = response.headers['content-disposition'];
      const filename = disposition
        ? disposition.split('filename=')[1].replace(/"/g, '')
        : fileId;

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error during file download:', error.message);
    }
  };

  const toggleFolderExpansion = (folderId) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [folderId]: !prev[folderId],
    }));
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = folders.filter((folder) => {
      const folderMatches = folder.name.toLowerCase().includes(query);
      const filesMatch = folder.files.some((file) =>
        file.name.toLowerCase().includes(query)
      );
      return folderMatches || filesMatch;
    });
    setFilteredFolders(filtered);
    setPage(1); // Reset to the first page after search
  };

  // Handle preview click
  const handlePreview = async (fileId) => {
    try {
      console.log("File ID passed to handlePreview:", fileId);  // Ensure fileId is a string
  
      if (typeof fileId !== 'string') {
        console.error("Invalid fileId passed:", fileId);
        throw new Error("Invalid fileId passed");
      }
  
      const previewUrl = `http://localhost:5000/api/client/files/preview/${fileId}`;
      console.log("Preview URL:", previewUrl);
  
      const response = await axios.get(previewUrl, {
        responseType: 'blob',
      });
  
      const contentType = response.headers['content-type'];
      const url = window.URL.createObjectURL(new Blob([response.data]));
  
      // Only allow preview for image files
      if (contentType.startsWith('image')) {
        // Handle image preview
        setPreviewFile({
          url: url,
          name: fileId,
          type: contentType,
        });
        setPreviewOpen(true); // Open the preview modal
      } else {
        console.error("Preview not available for this file type:", contentType);
        alert('Preview not available for this file type.');
      }
    } catch (error) {
      console.error("Error previewing file:", error);
      alert('Failed to load the file preview.');
    }
  };
  
  

  const closePreview = () => {
    setPreviewOpen(false);
    setPreviewFile(null);
  };

  const paginatedFolders = filteredFolders.slice(
    (page - 1) * foldersPerPage,
    page * foldersPerPage
  );

  return (
    <ThemeProvider theme={themeMode === "dark" ? darkTheme : lightTheme}>
      <Box m="20px" color="text.primary">
        <Typography variant="h4" gutterBottom align="center" color="primary">
          Gestionnaire de dossiers
        </Typography>

        <Box mb={3} display="flex" justifyContent="center">
          <TextField
            variant="outlined"
            placeholder="Rechercher des dossiers ou des fichiers"
            value={searchQuery}
            onChange={handleSearch}
            fullWidth
            sx={{
              maxWidth: 600,
              "& .MuiOutlinedInput-root": {
                backgroundColor: themeMode === "dark" ? "#424242" : "#fff",
                color: themeMode === "dark" ? "#fff" : "#000",
              },
            }}
          />
        </Box>

        <Grid container spacing={3}>
          {paginatedFolders.length === 0 ? (
            <Typography variant="h6" align="center" color="textSecondary">
              No folders or files found.
            </Typography>
          ) : (
            paginatedFolders.map((folder) => (
              <Grid item xs={12} key={folder._id}>
                <Card
                  sx={{
                    backgroundColor: themeMode === "dark" ? "#424242" : "#fff",
                    boxShadow: 3,
                    borderRadius: 2,
                  }}
                >
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="h6" color="primary">
                        {folder.name}
                      </Typography>
                      <IconButton
                        color="primary"
                        onClick={() => toggleFolderExpansion(folder._id)}
                      >
                        {expandedFolders[folder._id] ? <ExpandLess /> : <ExpandMore />}
                      </IconButton>
                    </Box>
                  </CardContent>
                  <Collapse
                    in={expandedFolders[folder._id]}
                    timeout="auto"
                    unmountOnExit
                  >
                    <CardContent>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <IconButton
                            color="primary"
                            onClick={() => handleFolderDownload(folder._id)}
                          >
                            <Download />
                            <Typography variant="body2" sx={{ ml: 1 }}>
                              Tout télécharger
                            </Typography>
                          </IconButton>
                        </Grid>
                        {folder.files.map((file) => (
                          <Grid item xs={12} sm={6} md={4} key={file._id}>
                            <Card
                              sx={{
                                backgroundColor: themeMode === "dark" ? "#616161" : "#f5f5f5",
                                boxShadow: 2,
                                borderRadius: 2,
                              }}
                            >
                              <CardContent>
                                <Typography variant="body2" color={themeMode === "dark" ? "#fff" : "#000"}>
                                  {file.name}
                                </Typography>
                                <IconButton
                                  color="primary"
                                  onClick={() => handleFileDownload(file._id)}
                                >
                                  <Download />
                                </IconButton>
                                <IconButton
                                  color="primary"
                                  onClick={() => handlePreview(file._id)}
                                  sx={{ ml: 1 }}
                                >
                                  <Visibility />
                                </IconButton>
                              </CardContent>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>
                    </CardContent>
                  </Collapse>
                </Card>
              </Grid>
            ))
          )}
        </Grid>

        <Pagination
          count={Math.ceil(filteredFolders.length / foldersPerPage)}
          page={page}
          onChange={(event, value) => setPage(value)}
          sx={{ display: "flex", justifyContent: "center", mt: 3 }}
        />
      </Box>

      <Modal open={previewOpen} onClose={closePreview}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "background.paper",
            padding: 2,
            borderRadius: 1,
            boxShadow: 3,
          }}
        >
          {previewFile && previewFile.type.startsWith('image') ? (
            <img
              src={previewFile.url}
              alt={previewFile.name}
              style={{ width: '100%', height: 'auto' }}
            />
          ) : (
            <Typography variant="h6" color="text.primary">
              Preview not available
            </Typography>
          )}
        </Box>
      </Modal>
    </ThemeProvider>
  );
};

export default ClientFolderManagement;
