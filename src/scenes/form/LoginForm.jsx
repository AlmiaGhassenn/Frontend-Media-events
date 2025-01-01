import { Box, Button, TextField, Typography } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { loginUser } from "../../api/api";
import { useNavigate, Link } from "react-router-dom"; // Import Link from react-router-dom
import Swal from "sweetalert2"; // Import SweetAlert2

const LoginForm = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();

  const handleFormSubmit = async (values, { resetForm }) => {
    try {
      const response = await loginUser(values);
      console.log("Login Response:", response); // Check the full response

      const token = response.data.token; // Ensure the token is returned correctly
      const role = response.data.role; // Ensure the role is returned correctly
      const name = response.data.name; // Ensure the name is returned correctly

      if (token && role && name) {
        // Store token, role, and name in localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("role", role);
        localStorage.setItem("userName", name); // Store the username

        console.log("Role from localStorage:", role); // Debugging log
        console.log("UserName from localStorage:", name); // Debugging log

        // Ensure the role check is case-sensitive and exact
        if (role.trim().toLowerCase() === "admin") {
          Swal.fire({
            icon: "success",
            title: "Connexion réussie !",
            text: "Bienvenue, Admin!",
          }).then(() => {
            navigate("/admin-dashboard");
          });
        } else if (role.trim().toLowerCase() === "client") {
          Swal.fire({
            icon: "success",
            title: "Connexion réussie !",
            text: "Bienvenue, Client!",
          }).then(() => {
            navigate("/client-dashboard");
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Erreur",
            text: "Rôle invalide!",
          });
          navigate("/login");
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Erreur",
          text: "Identifiants invalides ou rôle introuvable.",
        });
        navigate("/login");
      }

      resetForm();
    } catch (error) {
      console.error("Login Error:", error);
      Swal.fire({
        icon: "error",
        title: "Erreur de connexion",
        text: error.response?.data?.message || "Une erreur s'est produite lors de la connexion.",
      });
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
      <Box width="50%" m="20px">
        <Header title="CONNEXION" subtitle="Connectez-vous à votre compte" />

        <Formik
          onSubmit={handleFormSubmit}
          initialValues={initialValues}
          validationSchema={loginSchema}
        >
          {({ values, errors, touched, handleBlur, handleChange, handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <Box
                display="grid"
                gap="30px"
                gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                sx={{
                  "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                }}
              >
                <TextField
                  fullWidth
                  variant="filled"
                  label="Email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.email}
                  name="email"
                  error={!!touched.email && !!errors.email}
                  helperText={touched.email && errors.email}
                  sx={{ gridColumn: "span 4" }}
                />
                <TextField
                  fullWidth
                  variant="filled"
                  type="password"
                  label="Mot De Passe"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.password}
                  name="password"
                  error={!!touched.password && !!errors.password}
                  helperText={touched.password && errors.password}
                  sx={{ gridColumn: "span 4" }}
                />
              </Box>
              <Box display="flex" justifyContent="end" mt="20px">
                <Button type="submit" color="secondary" variant="contained">
                  CONNEXION
                </Button>
              </Box>
            </form>
          )}
        </Formik>

        {/* Add a link to the Register page below the login form */}
        <Box mt="20px" textAlign="center">
          <Typography variant="body2">
            Vous n'avez pas de compte ?{" "}
            <Link
              to="/register"
              style={{
                textDecoration: "none",
                fontWeight: 600,
                color: "#359078", // Blue color for the link
                padding: "6px 12px", // Padding around the text
                borderRadius: "4px", // Rounded corners
                border: "1px solid #359078", // Blue border
                transition: "all 0.3s ease", // Smooth transition for hover effect
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#000")} // Hover background color
              onMouseOut={(e) => (e.target.style.backgroundColor = "transparent")} // Remove hover background color
            >
              S'inscrire Ici
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

const loginSchema = yup.object().shape({
  email: yup.string().email("Email invalide").required("Requis"),
  password: yup.string().required("Requis"),
});

const initialValues = {
  email: "",
  password: "",
};

export default LoginForm;
