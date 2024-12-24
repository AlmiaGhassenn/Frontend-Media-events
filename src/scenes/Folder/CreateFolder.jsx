import React, { useState, useEffect } from "react";
import { TextField, Button, FormControl, Select, MenuItem, InputLabel, Typography, Box, Container, Grid } from "@mui/material";
import { createFolder, getUsers } from "../../api/api";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation

const CreateFolder = () => {
  const [newFolder, setNewFolder] = useState({ name: "", sharedWith: "", permission: "" });
  const [users, setUsers] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate hook

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
    try {
      const response = await createFolder(newFolder); // Use the createFolder API to send the folder data
      setNewFolder({ name: "", sharedWith: "", permission: "" }); // Clear the form after successful creation

      // Redirect to /folders after folder creation
      navigate("/folders");
    } catch (error) {
      console.error("Error creating folder:", error.message);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ paddingTop: "40px" }}>
      <Box
        sx={{
          padding: "20px",
          backgroundColor: (theme) => (theme.palette.mode === 'light' ? "#ffffff" : "#1F2A40"),
          borderRadius: "10px",
          boxShadow: (theme) => (theme.palette.mode === 'light' ? "0px 4px 12px rgba(0, 0, 0, 0.1)" : "0px 4px 12px rgba(164, 42, 42, 0.1)"),
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: "bold", marginBottom: "20px", textAlign: "center", color: (theme) => theme.palette.mode === 'light' ? "black" : "#70D8BD" }}>
          Create New Folder
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Folder Name"
              fullWidth
              value={newFolder.name}
              onChange={(e) => setNewFolder({ ...newFolder, name: e.target.value })}
              variant="outlined"
              sx={{
                "& .MuiInputLabel-root": { color: (theme) => theme.palette.mode === 'light' ? "black" : "#70D8BD" }, // Label color
                "& .MuiOutlinedInput-root": { borderColor: (theme) => theme.palette.mode === 'light' ? "black" : "#70D8BD" }, // Border color
                "&:hover .MuiOutlinedInput-root": { borderColor: (theme) => theme.palette.mode === 'light' ? "black" : "#70D8BD" }, // Hover border color
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth variant="outlined" sx={{ marginTop: "20px" }}>
              <InputLabel sx={{ color: (theme) => theme.palette.mode === 'light' ? "black" : "#70D8BD" }}>Shared With</InputLabel>
              <Select
                value={newFolder.sharedWith}
                onChange={(e) => setNewFolder({ ...newFolder, sharedWith: e.target.value })}
                label="Shared With"
                sx={{
                  "& .MuiOutlinedInput-root": { borderColor: (theme) => theme.palette.mode === 'light' ? "black" : "#70D8BD" }, // Border color
                  "&:hover .MuiOutlinedInput-root": { borderColor: (theme) => theme.palette.mode === 'light' ? "black" : "#70D8BD" }, // Hover border color
                }}
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
              <InputLabel sx={{ color: (theme) => theme.palette.mode === 'light' ? "black" : "#70D8BD" }}>Permission</InputLabel>
              <Select
                value={newFolder.permission}
                onChange={(e) => setNewFolder({ ...newFolder, permission: e.target.value })}
                label="Permission"
                sx={{
                  "& .MuiOutlinedInput-root": { borderColor: (theme) => theme.palette.mode === 'light' ? "black" : "#70D8BD" }, // Border color
                  "&:hover .MuiOutlinedInput-root": { borderColor: (theme) => theme.palette.mode === 'light' ? "black" : "#70D8BD" }, // Hover border color
                }}
              >
                <MenuItem value="consult">Consult</MenuItem>
                <MenuItem value="download">Download</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Button
              onClick={handleFolderCreate}
              variant="contained"
              fullWidth
              sx={{
                backgroundColor: (theme) => theme.palette.mode === 'light' ? "black" : "#70D8BD",
                color: (theme) => theme.palette.mode === 'light' ? "#fff" : "#fff",
                padding: "12px",
                "&:hover": { backgroundColor: "#fff", color: "black" }, // Hover effect
                marginTop: "20px",
              }}
            >
              Create Folder
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default CreateFolder;
