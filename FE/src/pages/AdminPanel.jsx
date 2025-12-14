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
import { useState } from "react";
import medicineLogo from "../assets/images/medicineLogo.png";
import ColorSchemeToggle from "../components/ColorSchemeToggle.jsx";
import api from "../api/axiosInstance.js";
import { useNavigate } from "react-router-dom";
import Link from "@mui/joy/Link";


const customTheme = extendTheme();

export default function AdminAddProduct() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        category: "",
        subcategory: "",
        title: "",
        description: "",
        rating: 0,
        quantity: "",
        price: "",          // κρατάμε string για ωραία πληκτρολόγηση
        base64Image: "",
    });

    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        // clamp για rating (ακέραιο 0–5)
        if (name === "rating") {
            const raw = Number(value);
            const clamped = Number.isFinite(raw)
                ? Math.max(0, Math.min(5, Math.trunc(raw)))
                : 0;
            setFormData((prev) => ({ ...prev, rating: clamped }));
            return;
        }

        // ειδικός χειρισμός εικόνας
        if (name === "base64Image" && files?.length > 0) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData((prev) => ({ ...prev, base64Image: reader.result }));
            };
            reader.readAsDataURL(files[0]);
            return;
        }

        // ειδικός χειρισμός price -> έως 2 δεκαδικά, 1 τελεία, κόμμα->τελεία
        if (name === "price") {
            let v = (value ?? "").toString().replace(",", ".").replace(/[^0-9.]/g, "");
            // κράτα μόνο την πρώτη τελεία
            const parts = v.split(".");
            if (parts.length > 2) {
                v = parts[0] + "." + parts.slice(1).join("").replace(/\./g, "");
            }
            const [intPart, decPart = ""] = v.split(".");
            const limited = decPart ? `${intPart}.${decPart.slice(0, 2)}` : intPart;

            // επιτρέπουμε ενδιάμεσα όπως "12." ή "0."
            if (v.endsWith(".") && decPart.length === 0) {
                setFormData((prev) => ({ ...prev, price: v }));
            } else {
                setFormData((prev) => ({ ...prev, price: limited }));
            }
            return;
        }

        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);
        setSuccessMessage(null);

        // validations
        const ratingNum = Number(formData.rating);
        if (!Number.isFinite(ratingNum) || ratingNum < 0 || ratingNum > 5) {
            setError("Το rating πρέπει να είναι ακέραιος αριθμός από 0 έως 5.");
            return;
        }

        const qtyNum = Math.max(0, parseInt(formData.quantity, 10) || 0);

        // parse price με 2 δεκαδικά
        const parsedPrice = Number.parseFloat(
            String(formData.price).replace(",", ".")
        );
        if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
            setError("Το price πρέπει να είναι μη αρνητικός αριθμός (μέχρι 2 δεκαδικά).");
            return;
        }
        const priceNum = Number(parsedPrice.toFixed(2));

        try {
            await api.post("/Products", {
                category: formData.category.trim(),
                subcategory: formData.subcategory.trim(),
                title: formData.title.trim(),
                description: formData.description.trim(),
                rating: ratingNum,
                quantity: qtyNum,
                price: priceNum,
                base64Image: formData.base64Image,
            });

            setSuccessMessage("Product added successfully");
            setFormData({
                category: "",
                subcategory: "",
                title: "",
                description: "",
                rating: 0,
                quantity: "",
                price: "",
                base64Image: "",
            });
        } catch (err) {
            if (err.response) {
                setError(`Failure: ${err.response.data || "Error"}`);
            } else {
                setError("Network Server Error");
            }
        }
    };

    return (
        <CssVarsProvider theme={customTheme} defaultMode="dark" disableTransitionOnChange>
            <CssBaseline />
            <GlobalStyles
                styles={{
                    ":root": {
                        "--Form-maxWidth": "1200px",
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
                            <IconButton onClick={() => navigate("/home")} color="primary" size="sm">
                                <img src={medicineLogo} alt="site logo" width={24} height={24} />
                            </IconButton>
                            <Typography
                                level="title-lg"
                                sx={{
                                    display: "inline-block",
                                    px: 2,
                                    animation: "pulse 3s ease-in-out infinite",
                                    "@keyframes pulse": {
                                        "0%": { transform: "scale(1)" },
                                        "50%": { transform: "scale(1.05)" },
                                        "100%": { transform: "scale(1)" },
                                    },
                                }}
                            >
                                Admin Panel - Add Product
                            </Typography>
                        </Box>
                        <ColorSchemeToggle />
                    </Box>

                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            mb: 2,
                        }}
                    >
                        {/* Group 1: Αριστερά (Εικονίδιο + Τίτλος) */}
                        <Typography component="h1" level="h3" mb={3}>
                            Add New Product
                        </Typography>

                        {/* Group 2: Δεξιά (Link) */}
                        <Typography variant="body1">
                            <Link
                                onClick={() => navigate("/home")}
                                underline="hover"
                                sx={{
                                    cursor: "pointer",
                                    fontWeight: 500,
                                }}
                            >
                                Go back
                            </Link>
                        </Typography>
                    </Box>

                    <form onSubmit={handleSubmit}>
                        <Box
                            sx={{
                                display: "flex",
                                gap: 3,
                                flexDirection: { xs: "column", sm: "row" },
                            }}
                        >
                            {/* Left column */}
                            <Stack spacing={2} flex={1}>
                                <FormControl required>
                                    <FormLabel>Category</FormLabel>
                                    <Input
                                        name="category"
                                        type="text"
                                        value={formData.category}
                                        onChange={handleChange}
                                    />
                                </FormControl>

                                <FormControl required>
                                    <FormLabel>Subcategory</FormLabel>
                                    <Input
                                        name="subcategory"
                                        type="text"
                                        value={formData.subcategory}
                                        onChange={handleChange}
                                    />
                                </FormControl>

                                <FormControl required>
                                    <FormLabel>Title</FormLabel>
                                    <Input
                                        name="title"
                                        type="text"
                                        value={formData.title}
                                        onChange={handleChange}
                                    />
                                </FormControl>

                                <FormControl required>
                                    <FormLabel>Description</FormLabel>
                                    <Input
                                        name="description"
                                        type="text"
                                        value={formData.description}
                                        onChange={handleChange}
                                    />
                                </FormControl>
                            </Stack>

                            {/* Right column */}
                            <Stack spacing={2} flex={1}>
                                <FormControl>
                                    <FormLabel>Rating (0–5)</FormLabel>
                                    <Input
                                        name="rating"
                                        type="number"
                                        inputProps={{ min: 0, max: 5, step: 1 }}
                                        value={formData.rating}
                                        onChange={handleChange}
                                    />
                                </FormControl>

                                <FormControl required>
                                    <FormLabel>Quantity</FormLabel>
                                    <Input
                                        name="quantity"
                                        type="number"
                                        inputProps={{ min: 0, step: 1 }}
                                        value={formData.quantity}
                                        onChange={handleChange}
                                    />
                                </FormControl>

                                <FormControl required>
                                    <FormLabel>Price (€)</FormLabel>
                                    <Input
                                        name="price"
                                        type="text"                // text για να μην περιορίζει ο browser
                                        inputMode="decimal"        // numpad με δεκαδικά στα κινητά
                                        pattern="^\d+(\.\d{0,2})?$"
                                        placeholder="0.00"
                                        value={formData.price}
                                        onChange={handleChange}
                                    />
                                </FormControl>

                                <FormControl>
                                    <FormLabel>Image</FormLabel>
                                    <Input
                                        name="base64Image"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleChange}
                                    />
                                </FormControl>
                            </Stack>
                        </Box>

                        <Button
                            type="submit"
                            variant="solid"
                            color="primary"
                            fullWidth
                            sx={{ mt: 3 }}
                        >
                            Υποβολή Προϊόντος
                        </Button>
                    </form>

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
                </Box>
            </Box>
        </CssVarsProvider>
    );
}

