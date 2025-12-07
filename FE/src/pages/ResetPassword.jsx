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
import ColorSchemeToggle from "../components/ColorSchemeToggle.jsx";
import { useNavigate } from "react-router-dom";
import Link from "@mui/joy/Link";
import medicineLogo from "../assets/images/medicineLogo.png";
import PersonIcon from "@mui/icons-material/Person";
import IconButton from "@mui/joy/IconButton";
import { useState, useEffect } from "react";
import api from "../api/axiosInstance.js";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import { clearCart } from "../stores/Cart";
import ProfileBg from "../assets/images/profilePageBg.jpg";

const customTheme = extendTheme();

export default function ResetPassword() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [csInfo, setCsInfo] = useState(null);

  const formatErrorMessage = (responseData) => {
    if (typeof responseData === "string") return responseData;
    if (responseData?.errors) {
      return Object.values(responseData.errors)
        .flat()
        .map((msg) => String(msg))
        .join("\n");
    }
    return "Failed to reset password. Please check your input.";
  };

  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    if (!token) {
      navigate("/", { replace: true });
      return;
    }

    const cachedRole = (localStorage.getItem("jwt_role") || "").toLowerCase();
    let role = cachedRole;

    if (!role) {
      try {
        const decoded = jwtDecode(token);
        role =
          (decoded[
            "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
          ] ||
            decoded.role ||
            "") + "";
        role = role.toLowerCase();
      } catch (e) {
        console.warn("Failed to decode token for role check:", e);
      }
    }

    if (role !== "customer") {
      navigate("/", { replace: true });
      return;
    }

    api
      .get("/Customer/me")
      .then((res) => setCsInfo(res.data))
      .catch((err) => {
        console.error("Failed to fetch profile", err);
      });
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const formElements = event.currentTarget.elements;
    const currentPassword = formElements.currentPassword.value;
    const newPassword = formElements.newPassword.value;
    const confirmNewPassword = formElements.confirmNewPassword.value;

    if (newPassword !== confirmNewPassword) {
      setError("Passwords do not match");
      return;
    }

    const token = localStorage.getItem("jwt_token");
    if (!token) {
      setError("You must be logged in to change your password.");
      navigate("/", { replace: true });
      return;
    }

    try {
      await api.put("/Customer/me/password", {
        currentPassword,
        newPassword,
        confirmNewPassword,
      });

      setSuccessMessage("Password updated successfully!");
      event.target.reset();

      // Καθάρισμα καλαθιού + auth info
      try {
        dispatch(clearCart());
      } catch (e) {
        console.warn("Failed to clear cart on password reset:", e);
      }
      localStorage.removeItem("jwt_token");
      localStorage.removeItem("jwt_role");
      localStorage.removeItem("jwt_userId");
      localStorage.removeItem("cartItems");

      setTimeout(() => navigate("/", { replace: true }), 1200);
    } catch (err) {
      if (err.response) {
        const errorText = formatErrorMessage(err.response.data);
        setError(errorText);
      } else {
        setError("Network error");
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
            "--Form-maxWidth": "800px",
            "--Transition-duration": "0.4s",
          },
        }}
      />

      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        sx={{
          backgroundImage: `url(${ProfileBg})`,
          height: "100vh",
          width: "100vw",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
          py: 2,
          px: 2,
          backgroundColor: "background.level1",
        }}
      >
        {/* Profile Info */}
        <Box
          sx={(theme) => ({
            width: "70%",
            height: 600,
            maxWidth: "100%",
            borderRadius: "sm",
            p: 4,
            boxShadow: "md",
            bgcolor: "rgba(255 255 255 / 0.2)",
            backdropFilter: "blur(12px)",
            transition: "background-image var(--Transition-duration)",
            [theme.getColorSchemeSelector("dark")]: {
              bgcolor: "rgba(19 19 24 / 0.6)",
            },
          })}
        >
          <Box component="header" sx={{ py: 3, display: "flex" }}>
            <PersonIcon sx={{ width: 32, height: 32, color: "#0A66C2" }} />
            <Box sx={{ gap: 2, display: "flex", alignItems: "center" }}>
              <Typography level="title-lg" mx={2}>
                Profile Information
              </Typography>
            </Box>
          </Box>

          {csInfo ? (
            <Stack spacing={3}>
              <FormControl>
                <FormLabel>Fullname</FormLabel>
                <Input
                  value={csInfo?.fullname || ""}
                  readOnly
                  sx={{
                    width: "50%",
                    borderRadius: "50px",
                    bgcolor: "transparent",
                  }}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Age</FormLabel>
                <Input
                  value={csInfo?.age || ""}
                  readOnly
                  sx={{
                    width: "50%",
                    borderRadius: "50px",
                    bgcolor: "transparent",
                  }}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Phonenumber</FormLabel>
                <Input
                  value={csInfo?.phoneNumber || ""}
                  readOnly
                  sx={{
                    width: "50%",
                    borderRadius: "50px",
                    bgcolor: "transparent",
                  }}
                />
              </FormControl>

              <FormControl>
                <FormLabel>City</FormLabel>
                <Input
                  value={csInfo?.city || ""}
                  readOnly
                  sx={{
                    width: "50%",
                    borderRadius: "50px",
                    bgcolor: "transparent",
                  }}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Address</FormLabel>
                <Input
                  value={csInfo?.address || ""}
                  readOnly
                  sx={{
                    width: "50%",
                    borderRadius: "50px",
                    bgcolor: "transparent",
                  }}
                />
              </FormControl>
            </Stack>
          ) : (
            <Typography>Loading profile...</Typography>
          )}
        </Box>

        {/* Reset Password */}
        <Box
          sx={(theme) => ({
            width: "70%",
            height: 600,
            maxWidth: "100%",
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
          <Box
            component="header"
            sx={{ py: 3, display: "flex", justifyContent: "space-between" }}
          >
            <Box sx={{ gap: 2, display: "flex", alignItems: "center" }}>
              <IconButton
                onClick={() => navigate("/home")}
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
              <Typography level="title-lg" mx={2}>
                Change Password
              </Typography>
            </Box>
            <ColorSchemeToggle />
          </Box>

          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <FormControl required>
                <FormLabel>Enter current Password</FormLabel>
                <Input
                  name="currentPassword"
                  type="password"
                  placeholder="*********"
                  sx={{
                    width: "50%",
                    borderRadius: "50px",
                  }}
                />
              </FormControl>

              <FormControl required>
                <FormLabel>Enter new Password</FormLabel>
                <Input
                  name="newPassword"
                  type="password"
                  placeholder="*********"
                  sx={{
                    width: "50%",
                    borderRadius: "50px",
                  }}
                />
              </FormControl>

              <FormControl required>
                <FormLabel>Confirm New Password</FormLabel>
                <Input
                  name="confirmNewPassword"
                  type="password"
                  placeholder="*********"
                  sx={{
                    width: "50%",
                    borderRadius: "50px",
                  }}
                />
              </FormControl>

              <Button
                type="submit"
                variant="solid"
                color="primary"
                fullWidth
                sx={{ cursor: "pointer" }}
              >
                Change Password
              </Button>
            </Stack>
          </form>

          {successMessage && (
            <Box
              sx={{
                mt: 3,
                p: 2,
                borderRadius: "sm",
                textAlign: "center",
                bgcolor: "green.100",
                color: "green.800",
              }}
            >
              {successMessage}
            </Box>
          )}
          {error && (
            <Box
              sx={{
                mt: 3,
                p: 2,
                borderRadius: "sm",
                textAlign: "center",
                bgcolor: "red.100",
                color: "red.800",
              }}
            >
              {error}
            </Box>
          )}

          <Box sx={{ mt: 4, textAlign: "center" }}>
            <Typography level="body-lg">
              No need to reset your password?{" "}
              <Link
                onClick={() => navigate("/home")}
                level="title-lg"
                sx={{ cursor: "pointer" }}
              >
                Go back
              </Link>
            </Typography>
          </Box>
        </Box>
      </Stack>
    </CssVarsProvider>
  );
}
