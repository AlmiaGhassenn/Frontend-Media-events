import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Typography,
  Grid,
  Select,
  InputLabel,
  FormControl,
  Pagination,
} from "@mui/material";
import Header from "../../components/Header";
import {
  getFolders,
  createFolder,
  uploadFile,
  updateFolderPermissions,
  getUsers,
} from "../../api/api";

const FolderManagement = () => {
  const [folders, setFolders] = useState([]);
  const [newFolder, setNewFolder] = useState({ name: "", sharedWith: "", permission: "" });
  const [selectedFolderId, setSelectedFolderId] = useState("");
  const [file, setFile] = useState(null);
  const [permissions, setPermissions] = useState({ sharedWith: "", permission: "" });
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const foldersPerPage = 9;

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const response = await getFolders();
        setFolders(response.data);
      } catch (error) {
        console.error("Error fetching folders:", error.message);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await getUsers();
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error.message);
      }
    };

    fetchFolders();
    fetchUsers();
  }, []);

  const handleFolderCreate = async () => {
    try {
      const response = await createFolder(newFolder);
      setFolders([...folders, response.data]);
      setNewFolder({ name: "", sharedWith: "", permission: "" });
    } catch (error) {
      console.error("Error creating folder:", error.message);
    }
  };

  const handleFileUpload = async () => {
    const formData = new FormData();
  
    // Ensure the 'file' variable is correctly referenced here
    for (const currentFile of file) {
      formData.append("files", currentFile);
    }
  
    try {
      const response = await uploadFile(selectedFolderId, formData);
      alert("Files uploaded successfully");
      console.log('Uploaded files:', response.data);
    } catch (error) {
      console.error("Error uploading files:", error.message);
    }
  };

  const handleUpdatePermissions = async () => {
    try {
      await updateFolderPermissions(selectedFolderId, permissions);
      alert(`Folder permissions updated`);
    } catch (error) {
      console.error("Error updating folder permissions:", error.message);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredFolders = folders.filter((folder) =>
    folder.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedFolders = filteredFolders.slice(
    (currentPage - 1) * foldersPerPage,
    currentPage * foldersPerPage
  );

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <Box m="20px">
      <Header title="Folder Management" subtitle="Manage your folders efficiently" />

      {/* Search Bar */}
      <Box mb="20px">
        <TextField
          label="Search Folders"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={handleSearch}
        />
      </Box>

      {/* Folder List */}
      <Grid container spacing={2}>
        {paginatedFolders.map((folder) => (
          <Grid item xs={12} sm={6} md={4} key={folder._id}>
            <Box border={1} borderRadius={2} p={2} textAlign="center">
              <Typography variant="h6" fontWeight="bold">
                {folder.name}
              </Typography>
              <Button
                onClick={() => setSelectedFolderId(folder._id)}
                variant="outlined"
                color="secondary"
                sx={{ mt: 1 }}
              >
                Select Folder
              </Button>
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* Pagination */}
      <Box mt="20px" display="flex" justifyContent="center">
        <Pagination
          count={Math.ceil(filteredFolders.length / foldersPerPage)}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>

      {/* Create Folder Form */}
     

      {/* Folder Info Display */}
      {selectedFolderId && (
        <Box mt="20px">
          <Typography variant="h6">Currently in Folder: {folders.find(f => f._id === selectedFolderId)?.name}</Typography>
        </Box>
      )}

      {/* File Upload Form */}
      {selectedFolderId && (
        <Box mt="20px">
          <Typography variant="h6">Upload File to Selected Folder</Typography>
          <input
            type="file"
            multiple
            onChange={(e) => setFile(e.target.files)}
          />

          <Button
            onClick={handleFileUpload}
            variant="contained"
            color="secondary"
            sx={{ mt: 2 }}
          >
            Upload File
          </Button>
        </Box>
      )}

      {/* Update Permissions */}
      {selectedFolderId && (
        <Box mt="20px">
          <Typography variant="h6">Update Folder Permissions</Typography>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Shared With</InputLabel>
            <Select
              value={permissions.sharedWith}
              onChange={(e) => setPermissions({ ...permissions, sharedWith: e.target.value })}
              label="Shared With"
            >
              {users.map((user) => (
                <MenuItem key={user._id} value={user._id}>
                  {user.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Permission</InputLabel>
            <Select
              value={permissions.permission}
              onChange={(e) => setPermissions({ ...permissions, permission: e.target.value })}
              label="Permission"
            >
              <MenuItem value="consult">Consult</MenuItem>
              <MenuItem value="download">Download</MenuItem>
            </Select>
          </FormControl>
          <Button
            onClick={handleUpdatePermissions}
            variant="contained"
            color="secondary"
            sx={{ mt: 2 }}
          >
            Update Permissions
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default FolderManagement;
