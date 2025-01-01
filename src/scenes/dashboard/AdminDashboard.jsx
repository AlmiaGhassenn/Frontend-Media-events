import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  useTheme,
  InputAdornment,
} from "@mui/material";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import Header from "../../components/Header";
import { getUsers, deleteUser } from "../../api/api"; // Import the deleteUser function
import { tokens } from "../../theme";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person"; // Import User Icon
import EmailIcon from "@mui/icons-material/Email"; // Import Email Icon
import Swal from "sweetalert2"; // Import SweetAlert2

const AdminDashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const backgroundColor = theme.palette.mode === "dark" ? "#1E1E1E" : "#fff";

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

  const handleDelete = async (userId) => {
    // SweetAlert2 confirmation dialog
    Swal.fire({
      title: "Êtes-vous sûr?",
      text: "Cette action supprimera définitivement cet utilisateur!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Oui, supprimer!",
      cancelButtonText: "Annuler",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteUser(userId); // Call the API to delete the user
          setUsers(users.filter((user) => user._id !== userId)); // Remove the user from the list in the UI
          Swal.fire("Supprimé!", "L'utilisateur a été supprimé.", "success");
        } catch (error) {
          Swal.fire("Erreur!", "Une erreur s'est produite lors de la suppression.", "error");
          console.error("Error deleting user:", error.message);
        }
      }
    });
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="Espace Admin" subtitle="bienvenu dans votre espace Admin " />
        <Box></Box>
      </Box>

      {/* SEARCH BAR */}
      <Box my="20px">
        <TextField
          label="Reacherche Des utilisateurs (avec nom ou Email)"
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
      </Box>

      {/* USER TABLE */}
      <Box mt="20px">
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nom</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user._id}>
                  {/* User Name with Icon */}
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <PersonIcon
                        sx={{ color: theme.palette.mode === "dark" ? "#70D8BD" : "inherit", mr: 1 }}
                      />
                      {user.name}
                    </Box>
                  </TableCell>

                  {/* User Email with Icon */}
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <EmailIcon
                        sx={{
                          color: theme.palette.mode === "dark" ? "#70D8BD" : "inherit",
                          mr: 1,
                        }}
                        onClick={() => window.open(`mailto:${user.email}`, "_blank")} // Open email client
                        style={{ cursor: "pointer" }} // Make the icon look clickable
                      />
                      {user.email}
                    </Box>
                  </TableCell>

                  {/* Delete Button */}
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleDelete(user._id)} // Trigger delete with SweetAlert2 confirmation
                    >
                      Supprimer
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
