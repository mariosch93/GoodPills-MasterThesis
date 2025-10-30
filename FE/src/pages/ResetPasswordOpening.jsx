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
// import ColorSchemeToggle from "../components/ColorSchemeToggle.jsx"; // (προαιρετικά, είναι σχολιασμένο)
import medicineDark from "../assets/images/password_dark.jpg";
import { useNavigate } from "react-router-dom";
import Link from "@mui/joy/Link";
import medicineLogo from "../assets/images/medicineLogo.png";
import IconButton from "@mui/joy/IconButton";
import { useState } from "react";
import api from "../api/axiosInstance.js";

const customTheme = extendTheme();

const ResetPasswordOpening = () => {
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);
        setSuccessMessage(null);

        const formElements = event.currentTarget.elements;
        const email = formElements.email.value;
        const newPassword = formElements.newPassword.value;
        const confirmNewPassword = formElements.confirmNew.value;

        if (newPassword !== confirmNewPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            const response = await api.post("Auth/forgot-password-simple", {
                email,
                newPassword,
                confirmNewPassword,
            });

            if (response.status === 200) {
                setSuccessMessage(
                    response.data.message || "Password reset request sent!"
                );
                localStorage.clear();
                setTimeout(() => navigate("/"), 1500);
            }
        } catch (err) {
            if (err.response) {
                setError(err.response.data || "Something went wrong.");
            } else {
                setError("Network error. Please try again.");
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

            {/* Wrapper with background */}
            <Box
                sx={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundImage: `url(${medicineDark})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    p: 2,
                }}
            >
                {/* Form card */}
                <Box
                    sx={(theme) => ({
                        width: "100%",
                        maxWidth: 500,
                        bgcolor: "rgba(255 255 255 / 0.2)",
                        backdropFilter: "blur(12px)",
                        borderRadius: "md",
                        p: 4,
                        boxShadow: "lg",
                        [theme.getColorSchemeSelector("dark")]: {
                            bgcolor: "rgba(19 19 24 / 0.6)",
                        },
                    })}
                >
                    <Box
                        component="header"
                        sx={{ py: 2, display: "flex", justifyContent: "space-between" }}
                    >
                        <Box sx={{ gap: 2, display: "flex", alignItems: "center" }}>
                            <IconButton
                                onClick={() => {
                                    localStorage.clear();
                                    navigate("/");
                                }}
                                color="primary"
                                size="sm"
                            >
                                <img src={medicineLogo} alt="site logo" width={24} height={24} />
                            </IconButton>
                            <Typography level="title-lg">Reset Password</Typography>
                        </Box>
                        {/* <ColorSchemeToggle /> */}
                    </Box>

                    {/* Form */}
                    <form onSubmit={handleSubmit}>
                        <Stack spacing={3}>
                            <FormControl required>
                                <FormLabel>Email</FormLabel>
                                <Input name="email" type="email" placeholder="example@email.com" />
                            </FormControl>

                            <FormControl required>
                                <FormLabel>New Password</FormLabel>
                                <Input name="newPassword" type="password" placeholder="*********" />
                            </FormControl>

                            <FormControl required>
                                <FormLabel>Confirm New Password</FormLabel>
                                <Input name="confirmNew" type="password" placeholder="*********" />
                            </FormControl>

                            <Button type="submit" variant="solid" color="primary" fullWidth>
                                Reset Password
                            </Button>
                        </Stack>
                    </form>

                    {/* Messages */}
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

                    {/* Back link */}
                    <Box sx={{ mt: 4, textAlign: "center" }}>
                        <Typography level="body-lg">
                            No need to reset your password?{" "}
                            <Link
                                onClick={() => {
                                    localStorage.clear();
                                    navigate("/");
                                }}
                                level="title-lg"
                                sx={{ cursor: "pointer" }}
                            >
                                Go back
                            </Link>
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </CssVarsProvider>
    );
};

export default ResetPasswordOpening;
