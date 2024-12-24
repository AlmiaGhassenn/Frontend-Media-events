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
  createTheme,
  ThemeProvider,
} from "@mui/material";
import axios from 'axios';
import { ExpandMore, ExpandLess, Download } from "@mui/icons-material";
import { getClientFolders } from "../../api/api";

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
      const token = localStorage.getItem('token'); // Retrieve token from local storage or another secure location
    
      if (!token) {
        throw new Error('No token found');
      }
      
      const downloadUrl = `http://localhost:5000/api/client/files/folder/${folderId}`;
      const response = await axios.get(downloadUrl, {
        headers: {
          Authorization: `Bearer ${token}`, // Add token to the headers
        },
        responseType: 'blob', // For file downloads
      });
  
      // Extract the folder name from the response headers
      const disposition = response.headers['content-disposition'];
      const folderName = disposition ? disposition.split('filename=')[1].replace(/"/g, '') : 'folder_files.zip'; // Default if filename is not present
      
      // Create a link to download the ZIP file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', folderName); // Use folder's actual name as filename
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error during folder download:', error.message);
      if (error.response && error.response.status === 404) {
        alert('The folder you are trying to download is not available or does not exist.');
      } else {
        alert('An error occurred while downloading the folder. Please try again.');
      }
    }
  };
  
  

  const handleFileDownload = async (fileId) => {
    try {
      const token = localStorage.getItem('token'); // Retrieve token from local storage or another secure location
  
      if (!token) {
        throw new Error('No token found');
      }
  
      const downloadUrl = `http://localhost:5000/api/client/files/${fileId}`;
      const response = await axios.get(downloadUrl, {
        headers: {
          Authorization: `Bearer ${token}`, // Add token to the headers
        },
        responseType: 'blob', // For file downloads
      });
  
      // Extract the filename from the response headers
      const disposition = response.headers['content-disposition'];
      const filename = disposition
        ? disposition.split('filename=')[1].replace(/"/g, '') // Clean the filename
        : fileId; // Fallback to fileId if no filename is provided
  
      // Create a link to download the file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename); // Set the filename correctly
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

  const paginatedFolders = filteredFolders.slice(
    (page - 1) * foldersPerPage,
    page * foldersPerPage
  );

  return (
    <ThemeProvider theme={darkTheme}>
      <Box m="20px" color="text.primary">
        <Typography variant="h4" gutterBottom align="center" color="primary">
          Folder Manager
        </Typography>

        <Box mb={3} display="flex" justifyContent="center">
          <TextField
            variant="outlined"
            placeholder="Search folders or files"
            value={searchQuery}
            onChange={handleSearch}
            fullWidth
            sx={{ maxWidth: 600 }}
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
                    backgroundColor: "#424242",
                    boxShadow: 3,
                    borderRadius: 2,
                  }}
                >
                  <CardContent>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography variant="h6" color="primary">
                        {folder.name}
                      </Typography>
                      <IconButton
                        color="primary"
                        onClick={() => toggleFolderExpansion(folder._id)}
                        title={expandedFolders[folder._id] ? "Collapse" : "Expand"}
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
                            title="Download All Files"
                          >
                            <Download />
                            <Typography variant="body2" color="primary" sx={{ ml: 1 }}>
                              Download All
                            </Typography>
                          </IconButton>
                        </Grid>
                        {folder.files.map((file) => (
                          <Grid item xs={12} sm={6} md={4} key={file._id}>
                            <Card
                              sx={{
                                backgroundColor: "#616161",
                                boxShadow: 2,
                                borderRadius: 2,
                              }}
                            >
                              <CardContent>
                                <Typography variant="body2" color="#fff">
                                  {file.name}
                                </Typography>
                                <IconButton
                                  color="primary"
                                  onClick={() => handleFileDownload(file._id)}
                                  title="Download File"
                                >
                                  <Download />
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

        <Box mt={3} display="flex" justifyContent="center">
          <Pagination
            count={Math.ceil(filteredFolders.length / foldersPerPage)}
            page={page}
            onChange={(e, value) => setPage(value)}
            color="primary"
          />
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default ClientFolderManagement;
