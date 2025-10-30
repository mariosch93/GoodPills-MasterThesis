// src/pages/AdminEditProduct.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Box,
    Button,
    Stack,
    Typography,
    TextField,
    Paper,
    Divider,
} from "@mui/material";
import api from "../api/axiosInstance";

const emptyProduct = {
    category: "",
    subcategory: "",
    title: "",
    description: "",
    rating: 0,
    quantity: 0,
    price: "",            // ← κρατάμε string για ομαλή πληκτρολόγηση
    base64Image: "",
};

export default function AdminEditProduct() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState(emptyProduct);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const token = localStorage.getItem("jwt_token");
    const hasToken = Boolean(token);

    useEffect(() => {
        if (!hasToken) {
            setError("Please sign in to edit products.");
            setLoading(false);
        }
    }, [hasToken]);

    // Φέρε το προϊόν
    useEffect(() => {
        if (!hasToken) return;
        if (!id) {
            setError("Missing product id.");
            setLoading(false);
            return;
        }

        let cancelled = false;

        (async () => {
            try {
                setLoading(true);
                // Προτιμάμε GET /Products/{id}
                const res = await api.get(`/Products/${id}`);
                if (!cancelled) {
                    const data = res?.data || {};
                    setForm({
                        category: data.category ?? "",
                        subcategory: data.subcategory ?? "",
                        title: data.title ?? "",
                        description: data.description ?? "",
                        rating: Number.isFinite(data.rating) ? data.rating : 0,
                        quantity: Number.isFinite(data.quantity) ? data.quantity : 0,
                        price: Number.isFinite(data.price)
                            ? data.price.toFixed(2)           // ← φορμάρουμε σε 2 δεκαδικά στο UI
                            : "",
                        base64Image: data.base64Image ?? "",
                    });
                }
            } catch {
                // Fallback: GET /Products και find by id
                try {
                    const resAll = await api.get("/Products");
                    const one = (resAll?.data || []).find(
                        (p) => String(p.productId) === String(id)
                    );
                    if (!one) throw new Error("Product not found.");
                    if (!cancelled) {
                        setForm({
                            category: one.category ?? "",
                            subcategory: one.subcategory ?? "",
                            title: one.title ?? "",
                            description: one.description ?? "",
                            rating: Number.isFinite(one.rating) ? one.rating : 0,
                            quantity: Number.isFinite(one.quantity) ? one.quantity : 0,
                            price: Number.isFinite(one.price)
                                ? one.price.toFixed(2)
                                : "",
                            base64Image: one.base64Image ?? "",
                        });
                    }
                } catch {
                    if (!cancelled) setError("Failed to load product.");
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [id, hasToken]);

    const handleChange = (field) => (event) => {
        const { value, files } = event.target;

        if (field === "base64Image" && files?.length) {
            const reader = new FileReader();
            reader.onloadend = () =>
                setForm((prev) => ({ ...prev, base64Image: reader.result }));
            reader.readAsDataURL(files[0]);
            return;
        }

        if (field === "rating") {
            const raw = Math.trunc(Number(value));
            const clamped = Number.isFinite(raw) ? Math.max(0, Math.min(5, raw)) : 0;
            setForm((prev) => ({ ...prev, rating: clamped }));
            return;
        }

        if (field === "quantity") {
            const n = Math.max(0, parseInt(value || "0", 10));
            setForm((prev) => ({ ...prev, quantity: n }));
            return;
        }

        if (field === "price") {
            // επιτρέπουμε μόνο ψηφία και ένα dot
            const cleaned = String(value).replace(/[^\d.]/g, "");
            const singleDot = cleaned.replace(/(\..*)\./g, "$1");
            const [intPart, decPartRaw = ""] = singleDot.split(".");
            const decPart = decPartRaw.slice(0, 2); // μέχρι 2 δεκαδικά
            const next = decPartRaw.length ? `${intPart}.${decPart}` : intPart;

            setForm((prev) => ({ ...prev, price: next }));
            return;
        }

        setForm((prev) => ({ ...prev, [field]: value }));
    };

    // format price σε 2 δεκαδικά όταν φεύγει το focus
    const handlePriceBlur = () => {
        const n = parseFloat(form.price);
        if (Number.isFinite(n)) {
            setForm((prev) => ({ ...prev, price: n.toFixed(2) }));
        } else {
            setForm((prev) => ({ ...prev, price: "" }));
        }
    };

    const authHeader = hasToken
        ? { headers: { Authorization: `Bearer ${token}` } }
        : undefined;

    const handleSave = async () => {
        if (!hasToken) return;
        setError("");
        setSaving(true);
        try {
            const priceNumber = Number.isFinite(parseFloat(form.price))
                ? Number(parseFloat(form.price).toFixed(2))
                : 0;

            await api.put(
                `/Products/${id}`,
                {
                    category: form.category.trim(),
                    subcategory: form.subcategory.trim(),
                    title: form.title.trim(),
                    description: form.description.trim(),
                    rating: Math.trunc(form.rating),
                    quantity: Number(form.quantity),
                    price: priceNumber,           // ← στέλνουμε αριθμό με 2 δεκαδικά
                    base64Image: form.base64Image,
                },
                authHeader
            );
            navigate("/home");
        } catch (e) {
            setError(
                e?.response?.data || "Failed to update product. (Are you admin?)"
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!hasToken) return;
        setError("");
        setSaving(true);
        try {
            await api.delete(`/Products/${id}`, authHeader);
            navigate("/home");
        } catch (e) {
            setError(
                e?.response?.data || "Failed to delete product. (Are you admin?)"
            );
        } finally {
            setSaving(false);
        }
    };

    if (!hasToken) {
        return (
            <Box p={3}>
                <Typography color="error">{error || "Please sign in."}</Typography>
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
            <Paper sx={{ p: 3, width: "100%", maxWidth: 900 }}>
                <Typography variant="h5" fontWeight={700} gutterBottom>
                    Modify Product (ID: {id})
                </Typography>

                <Stack spacing={2}>
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                        <TextField
                            label="Category"
                            value={form.category}
                            onChange={handleChange("category")}
                            fullWidth
                        />
                        <TextField
                            label="Subcategory"
                            value={form.subcategory}
                            onChange={handleChange("subcategory")}
                            fullWidth
                        />
                    </Stack>

                    <TextField
                        label="Title"
                        value={form.title}
                        onChange={handleChange("title")}
                        fullWidth
                    />

                    <TextField
                        label="Description"
                        value={form.description}
                        onChange={handleChange("description")}
                        multiline
                        minRows={3}
                        fullWidth
                    />

                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                        <TextField
                            label="Rating (0–5)"
                            type="number"
                            inputProps={{ min: 0, max: 5, step: 1 }}
                            value={form.rating}
                            onChange={handleChange("rating")}
                            fullWidth
                        />
                        <TextField
                            label="Quantity"
                            type="number"
                            inputProps={{ min: 0, step: 1 }}
                            value={form.quantity}
                            onChange={handleChange("quantity")}
                            fullWidth
                        />
                        <TextField
                            label="Price (€)"
                            type="text"                 // ← text για πλήρη έλεγχο του input
                            inputMode="decimal"
                            value={form.price}
                            onChange={handleChange("price")}
                            onBlur={handlePriceBlur}
                            placeholder="0.00"
                            fullWidth
                            
                        />
                    </Stack>

                    <Box>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                            Image (optional)
                        </Typography>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleChange("base64Image")}
                        />
                        {form.base64Image ? (
                            <Box mt={2}>
                                <img
                                    src={form.base64Image}
                                    alt="preview"
                                    style={{ maxWidth: 260, borderRadius: 8 }}
                                />
                            </Box>
                        ) : null}
                    </Box>

                    {error && (
                        <Typography color="error" variant="body2">
                            {error}
                        </Typography>
                    )}

                    <Divider />

                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                        <Button variant="contained" onClick={handleSave} disabled={saving}>
                            {saving ? "Saving…" : "Save changes"}
                        </Button>
                        <Button
                            variant="outlined"
                            color="error"
                            onClick={handleDelete}
                            disabled={saving}
                        >
                            Delete product
                        </Button>
                        <Box flexGrow={1} />
                        <Button variant="text" onClick={() => navigate(-1)}>
                            Cancel
                        </Button>
                    </Stack>
                </Stack>
            </Paper>
        </Box>
    );
}

