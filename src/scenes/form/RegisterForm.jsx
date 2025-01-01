import { Box, Button, TextField, Select, MenuItem, InputLabel, FormControl, Typography } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { registerUser } from "../../api/api";
import { Link, useNavigate } from "react-router-dom";
const RegisterForm = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();
  const handleFormSubmit = async (values, { resetForm }) => {
    try {
      await registerUser(values);
      alert("Inscription réussie !");
      resetForm();
      navigate("/");
    } catch (error) {
      alert(error.response?.data?.message || "An error occurred");
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <Box width="50%" m="20px">
        <Header title="S'INSCRIRE" subtitle="Cree un nouveau compte" />

        <Formik
          onSubmit={handleFormSubmit}
          initialValues={initialValues}
          validationSchema={registerSchema}
        >
          {({ values, errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue }) => (
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
                  label="Nom"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.name}
                  name="name"
                  error={!!touched.name && !!errors.name}
                  helperText={touched.name && errors.name}
                  sx={{ gridColumn: "span 4" }}
                />
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
                  label="Mot De Pass"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.password}
                  name="password"
                  error={!!touched.password && !!errors.password}
                  helperText={touched.password && errors.password}
                  sx={{ gridColumn: "span 4" }}
                />
                <FormControl
                  fullWidth
                  variant="filled"
                  sx={{ gridColumn: "span 4" }}
                  error={!!touched.role && !!errors.role}
                >
                  <InputLabel>Role</InputLabel>
                  <Select
                    value={values.role}
                    onChange={(e) => setFieldValue("role", e.target.value)}
                    onBlur={handleBlur}
                    name="role"
                  >
                    <MenuItem value="Admin">Admin</MenuItem>
                    <MenuItem value="Client">Client</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <Box display="flex" justifyContent="end" mt="20px">
                <Button type="submit" color="secondary" variant="contained">
                S'INSCRIRE
                </Button>
              </Box>
            </form>
          )}
        </Formik>
        <Box mt="20px" textAlign="center">
      <Typography variant="body2">
      Vous avez déjà un compte ?{" "}
        <Link
          to="/"
          style={{
            textDecoration: "none",
            fontWeight: 600,
            color: "#359078", // Blue color for the link
            padding: "6px 12px", // Padding around the text
            borderRadius: "4px", // Rounded corners
            border: "1px solid #359078", // Blue border
            transition: "all 0.3s ease", // Smooth transition for hover effect
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = "#000"} // Hover background color
          onMouseOut={(e) => e.target.style.backgroundColor = "transparent"} // Remove hover background color
        >
          Connectez-vous ici
        </Link>
      </Typography>
    </Box>
      </Box>
    </Box>
  );
};

const registerSchema = yup.object().shape({
  name: yup.string().required("Required"),
  email: yup.string().email("Invalid email").required("Required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Required"),
  role: yup.string().oneOf(["Admin", "Client"], "Invalid role").required("Required"),
});

const initialValues = {
  name: "",
  email: "",
  password: "",
  role: "",
};

export default RegisterForm;
