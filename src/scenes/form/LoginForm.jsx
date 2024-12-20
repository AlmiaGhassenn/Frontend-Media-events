import { Box, Button, TextField, Typography } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { loginUser } from "../../api/api";
import { useNavigate, Link } from "react-router-dom"; // Import Link from react-router-dom

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
          console.log("Redirecting to admin-dashboard");
          navigate("/admin-dashboard");
        } else if (role.trim().toLowerCase() === "client") {
          console.log("Redirecting to client-dashboard");
          navigate("/client-dashboard");
        } else {
          alert("Invalid role!");
          navigate("/login");
        }
      } else {
        alert("Invalid login credentials or role not found.");
        navigate("/login");
      }
  
      alert("Login successful!");
      resetForm();
    } catch (error) {
      console.error("Login Error:", error);
      alert(error.response?.data?.message || "An error occurred during login");
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
      <Box width="50%" m="20px">
        <Header title="LOGIN" subtitle="Log in to Your Account" />

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
                  label="Password"
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
                  Login
                </Button>
              </Box>
            </form>
          )}
        </Formik>

        {/* Add a link to the Register page below the login form */}
        <Box mt="20px" textAlign="center">
  <Typography variant="body2">
    Don't have an account?{" "}
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
      onMouseOver={(e) => e.target.style.backgroundColor = "#000"} // Hover background color
      onMouseOut={(e) => e.target.style.backgroundColor = "transparent"} // Remove hover background color
    >
      Register here
    </Link>
  </Typography>
</Box>

      </Box>
    </Box>
  );
};

const loginSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Required"),
  password: yup.string().required("Required"),
});

const initialValues = {
  email: "",
  password: "",
};

export default LoginForm;
