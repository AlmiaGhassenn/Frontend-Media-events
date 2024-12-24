import React from "react";
import { Box, Button, TextField, MenuItem } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { createUser } from "../../api/api"; // Import the API function for creating a user
import Header from "../../components/Header";

const CreateUserForm = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const handleFormSubmit = async (values, { resetForm }) => {
    try {
      // Retrieve the token from localStorage
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found. Please log in.");

      // Send the request to create the user
      const response = await createUser({
        name: values.name,
        email: values.email,
        password: values.password,
        role: values.role,
      });

      alert(`User created successfully`);
      resetForm();
    } catch (error) {
      console.error("Error details:", error.response || error.message);
      const message =
        error.response?.data?.message || error.message || "Something went wrong";
      alert(message);
    }
  };

  return (
    <Box m="20px">
      <Header title="CREATE Client" subtitle="Create a New Client Profile" />

      <Formik
        initialValues={initialValues}
        validationSchema={userSchema}
        onSubmit={handleFormSubmit}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              {/* Name field */}
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Name"
                name="name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.name}
                error={touched.name && Boolean(errors.name)}
                helperText={touched.name && errors.name}
                sx={{ gridColumn: "span 4" }}
              />
              
              {/* Email field */}
              <TextField
                fullWidth
                variant="filled"
                type="email"
                label="Email"
                name="email"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
                sx={{ gridColumn: "span 4" }}
              />
              
              {/* Password field */}
              <TextField
                fullWidth
                variant="filled"
                type="password"
                label="Password"
                name="password"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.password}
                error={touched.password && Boolean(errors.password)}
                helperText={touched.password && errors.password}
                sx={{ gridColumn: "span 4" }}
              />
              
              {/* Role field */}
              <TextField
                fullWidth
                select
                variant="filled"
                label="Role"
                name="role"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.role}
                error={touched.role && Boolean(errors.role)}
                helperText={touched.role && errors.role}
                sx={{ gridColumn: "span 4" }}
              >
                <MenuItem value="Admin">Admin</MenuItem>
                <MenuItem value="Client">Client</MenuItem>
              </TextField>
            </Box>
            
            {/* Submit button */}
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Create User
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

// Validation schema using Yup
const userSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  role: yup.string().oneOf(["Admin", "Client"]).required("Role is required"),
});

// Initial values for the form
const initialValues = {
  name: "",
  email: "",
  password: "",
  role: "Client", // Default role to "Client"
};

export default CreateUserForm;
