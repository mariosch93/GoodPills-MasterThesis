// src/pages/Profile.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Grid,
  TextField,
  Typography,
  Button,
  Alert,
  Divider,
  Avatar,
  InputAdornment,
  CircularProgress,
  Container,
} from "@mui/material";

import ProfileBg from "../assets/images/profilePageBg.jpg";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import CakeIcon from "@mui/icons-material/Cake";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import HomeIcon from "@mui/icons-material/Home";
import SaveIcon from "@mui/icons-material/Save";
import api from "../api/axiosInstance";

const darkTextFieldStyle = {
  "& .MuiInputLabel-root": {
    color: "rgba(255, 255, 255, 0.7)",
  },
  "& .MuiInputBase-input": {
    color: "#ffffff",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "rgba(255, 255, 255, 0.3)",
    },
    "&:hover fieldset": {
      borderColor: "rgba(255, 255, 255, 0.5)",
    },
    "&.Mui-focused fieldset": {
      borderColor: "primary.main",
    },
  },
};

const inputIconColor = "rgba(255, 255, 255, 0.7)";

export default function Profile() {
  const token = localStorage.getItem("jwt_token");
  const hasToken = Boolean(token);

  const [form, setForm] = useState({
    fullname: "",
    age: "",
    phoneNumber: "",
    city: "",
    address: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");

  // Prefill από backend
  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (!hasToken) {
        setError("Please sign in to view your profile.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const res = await api.get("/Customer/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!cancelled) {
          const d = res?.data || {};
          setForm({
            fullname: d.fullname ?? "",
            age: d.age ?? "",
            phoneNumber: d.phoneNumber ?? "",
            city: d.city ?? "",
            address: d.address ?? "",
          });
        }
      } catch (e) {
        if (!cancelled) {
          setError(e?.response?.data || "Failed to load profile.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [hasToken, token]);

  const handleChange = (field) => (e) => {
    let value = e.target.value;

    if (field === "age") {
      const n = Math.max(0, parseInt(value || "0", 10));
      value = Number.isFinite(n) ? String(n) : "";
    }

    setForm((p) => ({ ...p, [field]: value }));
  };

  const handleSave = async () => {
    if (!hasToken) return;
    setError("");
    setOk("");
    setSaving(true);
    try {
      if (!form.fullname?.trim()) {
        setError("Full name is required.");
        setSaving(false);
        return;
      }

      await api.put(
        "/Customer/me",
        {
          fullname: form.fullname.trim(),
          age: Number(form.age) || 0,
          phoneNumber: form.phoneNumber.trim(),
          city: form.city.trim(),
          address: form.address.trim(),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setOk("Profile updated successfully.");
      setTimeout(() => setOk(""), 2500);
    } catch (e) {
      setError(e?.response?.data || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (!hasToken) {
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: "#121212", pt: 8 }}>
        <Container maxWidth="sm">
          <Alert severity="warning" variant="filled">
            Please sign in to view your profile.
          </Alert>
        </Container>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        sx={{ bgcolor: "#121212" }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        py: 6,
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        backgroundImage: `url(${ProfileBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        bgcolor: "rgba(0,0,0,0.75)",
        backgroundBlendMode: "overlay",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: { xs: 3, md: 5 },
          width: "100%",
          maxWidth: 700,
          borderRadius: 4,
          // --- DARK MODE PAPER STYLES ---
          bgcolor: "#1e1e1e", // Σκούρο γκρι background για την κάρτα
          color: "#ffffff", // Λευκό κείμενο
          backdropFilter: "blur(5px)", // Προαιρετικό: ελαφρύ θόλωμα πίσω από την κάρτα
          border: "1px solid rgba(255,255,255,0.1)", // Αχνό περίγραμμα
        }}
      >
        {/* Header Section */}
        <Box display="flex" flexDirection="column" alignItems="center" mb={4}>
          <Avatar
            sx={{
              width: 90,
              height: 90,
              bgcolor: "primary.main",
              mb: 2,
              boxShadow: "0 4px 20px rgba(0,0,0,0.5)", // Πιο έντονη σκιά
            }}
          >
            <PersonIcon sx={{ fontSize: 50 }} />
          </Avatar>
          <Typography variant="h4" fontWeight={700} color="inherit">
            My Profile
          </Typography>
          {/* Χρησιμοποιούμε rgba για πιο αχνό λευκό στο subtitle */}
          <Typography
            variant="body1"
            sx={{ color: "rgba(255, 255, 255, 0.7)" }}
          >
            Manage your personal information
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" variant="filled" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        {ok && (
          <Alert severity="success" variant="filled" sx={{ mb: 3 }}>
            {ok}
          </Alert>
        )}

        {/* Form Section */}
        <Box component="form" noValidate autoComplete="off">
          <Grid container spacing={3}>
            {/* Full Name */}
            <Grid item xs={12}>
              <TextField
                label="Full Name"
                value={form.fullname}
                onChange={handleChange("fullname")}
                required
                fullWidth
                variant="outlined"
                // Εφαρμογή των dark styles
                sx={darkTextFieldStyle}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      {/* Αλλαγή χρώματος εικονιδίου */}
                      <PersonIcon sx={{ color: inputIconColor }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Phone Number */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Phone Number"
                value={form.phoneNumber}
                onChange={handleChange("phoneNumber")}
                fullWidth
                variant="outlined"
                sx={darkTextFieldStyle}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon sx={{ color: inputIconColor }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Age */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Age"
                type="number"
                inputProps={{ min: 0, step: 1 }}
                value={form.age}
                onChange={handleChange("age")}
                fullWidth
                variant="outlined"
                sx={darkTextFieldStyle}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CakeIcon sx={{ color: inputIconColor }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* City */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="City"
                value={form.city}
                onChange={handleChange("city")}
                fullWidth
                variant="outlined"
                sx={darkTextFieldStyle}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationCityIcon sx={{ color: inputIconColor }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Address */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Address"
                value={form.address}
                onChange={handleChange("address")}
                fullWidth
                variant="outlined"
                sx={darkTextFieldStyle}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <HomeIcon sx={{ color: inputIconColor }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>

          {/* Αχνό λευκό divider */}
          <Divider sx={{ my: 4, borderColor: "rgba(255, 255, 255, 0.15)" }} />

          <Box display="flex" justifyContent="flex-end">
            <Button
              variant="contained"
              size="large"
              onClick={handleSave}
              disabled={saving}
              startIcon={!saving && <SaveIcon />}
              sx={{
                px: 4,
                py: 1.2,
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
                fontSize: "1rem",
              }}
            >
              {saving ? "Saving Changes..." : "Save Changes"}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
