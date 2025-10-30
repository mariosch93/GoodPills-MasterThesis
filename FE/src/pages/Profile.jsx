// src/pages/Profile.jsx
import React, { useEffect, useState } from "react";
import {
    Box,
    Paper,
    Stack,
    TextField,
    Typography,
    Button,
    Alert,
    Divider,
} from "@mui/material";
import api from "../api/axiosInstance";

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

    // Prefill áðü backend
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
            // áðëÞ client-side åðéêýñùóç
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
            <Box p={3}>
                <Alert severity="warning">Please sign in to view your profile.</Alert>
            </Box>
        );
    }

    if (loading) {
        return (
            <Box p={3}>
                <Typography>Loading…</Typography>
            </Box>
        );
    }

    return (
        <Box p={3} display="flex" justifyContent="center">
            <Paper sx={{ p: 3, width: "100%", maxWidth: 700 }}>
                <Typography variant="h5" fontWeight={700} gutterBottom>
                    Update Profile
                </Typography>

                <Stack spacing={2}>
                    {error && <Alert severity="error">{error}</Alert>}
                    {ok && <Alert severity="success">{ok}</Alert>}

                    <TextField
                        label="Full name"
                        value={form.fullname}
                        onChange={handleChange("fullname")}
                        required
                        fullWidth
                    />

                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                        <TextField
                            label="Phone number"
                            value={form.phoneNumber}
                            onChange={handleChange("phoneNumber")}
                            fullWidth
                        />
                        <TextField
                            label="Customer's Age"
                            type="number"
                            inputProps={{ min: 0, step: 1 }}
                            value={form.age}
                            onChange={handleChange("age")}
                            fullWidth
                        />
                    </Stack>

                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                        <TextField
                            label="City"
                            value={form.city}
                            onChange={handleChange("city")}
                            fullWidth
                        />
                        <TextField
                            label="Address"
                            value={form.address}
                            onChange={handleChange("address")}
                            fullWidth
                        />
                    </Stack>

                    <Divider />

                    <Box display="flex" gap={2}>
                        <Button
                            variant="contained"
                            onClick={handleSave}
                            disabled={saving}
                        >
                            {saving ? "Saving…" : "Save changes"}
                        </Button>
                    </Box>
                </Stack>
            </Paper>
        </Box>
    );
}
