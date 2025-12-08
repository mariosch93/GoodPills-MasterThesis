import { CssVarsProvider, extendTheme } from "@mui/joy";
import GlobalStyles from "@mui/joy/GlobalStyles";
import CssBaseline from "@mui/joy/CssBaseline";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Typography from "@mui/joy/Typography";
import Stack from "@mui/joy/Stack";
import IconButton from "@mui/joy/IconButton";
import Link from "@mui/joy/Link";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../api/axiosInstance.js";

import ColorSchemeToggle from "../components/ColorSchemeToggle.jsx";
import medicineLogo from "../assets/images/medicineLogo.png";

const customTheme = extendTheme();

export default function JoySignUp() {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    age: "",
    phoneNumber: "",
    city: "",
    address: "",
  });

  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setSuccessMessage(null);

    try {
      // await axios.post(
      //   "https://localhost:7056/api/Customer/register",
      //   formData
      // );

      await api.post("Customer/register", formData);

      setSuccessMessage("Sign Up successful!");
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      if (err.response) {
        setError(
          `Sign up failed: ${err.response.data || "Invalid credentials"}`
        );
      } else if (err.request) {
        setError("Network error. No response from server.");
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  return (
    <CssVarsProvider
      theme={customTheme}
      defaultMode="dark"
      disableTransitionOnChange
    >
      <CssBaseline />
      <GlobalStyles
        styles={{
          ":root": {
            "--Form-maxWidth": "1000px",
            "--Transition-duration": "0.4s",
          },
        }}
      />
      <Box
        sx={{
          height: "100vh",
          width: "100vw",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          px: 2,
          py: 4,
          backgroundColor: "background.level1",
        }}
      >
        <Box
          sx={(theme) => ({
            width: "100%",
            maxWidth: 1000,
            bgcolor: "rgba(255 255 255 / 0.2)",
            backdropFilter: "blur(12px)",
            borderRadius: "sm",
            p: 4,
            boxShadow: "md",
            [theme.getColorSchemeSelector("dark")]: {
              bgcolor: "rgba(19 19 24 / 0.6)",
            },
          })}
        >
          {/* Header */}
          <Box
            component="header"
            sx={{
              py: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <IconButton
                onClick={() => {
                  localStorage.clear();
                  navigate("/");
                }}
                color="primary"
                size="sm"
              >
                <img
                  src={medicineLogo}
                  alt="site logo"
                  width={24}
                  height={24}
                />
              </IconButton>
              <Typography level="title-lg">Welcome to GoodPills</Typography>
            </Box>
            <ColorSchemeToggle />
          </Box>

          <Typography component="h1" level="h3" mb={3}>
            Create Account
          </Typography>

          <form onSubmit={handleSubmit}>
            <Box
              sx={{
                display: "flex",
                gap: 3,
                flexDirection: { xs: "column", sm: "row" }, // responsive 2 στήλες
              }}
            >
              {/* Left column */}
              <Stack spacing={2} flex={1}>
                <FormControl required>
                  <FormLabel>Fullname</FormLabel>
                  <Input
                    name="fullname"
                    type="text"
                    value={formData.fullname}
                    onChange={handleChange}
                  />
                </FormControl>

                <FormControl required>
                  <FormLabel>Email</FormLabel>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </FormControl>

                <FormControl required>
                  <FormLabel>Password</FormLabel>
                  <Input
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </FormControl>

                <FormControl required>
                  <FormLabel>Age</FormLabel>
                  <Input
                    name="age"
                    type="number"
                    value={formData.age}
                    onChange={handleChange}
                  />
                </FormControl>
              </Stack>

              {/* Right column */}
              <Stack spacing={2} flex={1}>
                <FormControl required>
                  <FormLabel>Phone number</FormLabel>
                  <Input
                    name="phoneNumber"
                    type="text"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                  />
                </FormControl>

                <FormControl required>
                  <FormLabel>City</FormLabel>
                  <Input
                    name="city"
                    type="text"
                    value={formData.city}
                    onChange={handleChange}
                  />
                </FormControl>

                <FormControl required>
                  <FormLabel>Address</FormLabel>
                  <Input
                    name="address"
                    type="text"
                    value={formData.address}
                    onChange={handleChange}
                  />
                </FormControl>

                <FormControl>
                  <Button
                    type="submit"
                    variant="solid"
                    color="primary"
                    fullWidth
                    sx={{ mt: 3 }}
                  >
                    Sign Up
                  </Button>
                </FormControl>
              </Stack>
            </Box>
          </form>

          {/* Μηνύματα */}
          {successMessage && (
            <div
              className="p-3 mt-4 text-sm text-center text-green-700 bg-green-100 rounded-lg"
              role="status"
            >
              {successMessage}
            </div>
          )}
          {error && (
            <div
              className="p-3 mt-4 text-sm text-center text-red-700 bg-red-100 rounded-lg"
              role="alert"
            >
              {error}
            </div>
          )}

          <Box sx={{ mt: 4, textAlign: "center" }}>
            <Typography level="body-sm">
              Already have an account?{" "}
              <Link
                onClick={() => {
                  localStorage.clear();
                  navigate("/");
                }}
                level="title-sm"
                sx={{ cursor: "pointer" }}
              >
                Sign in!
              </Link>
            </Typography>
          </Box>
        </Box>
      </Box>
    </CssVarsProvider>
  );
}
