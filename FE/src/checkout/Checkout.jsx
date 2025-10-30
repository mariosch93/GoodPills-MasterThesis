// checkout/Checkout.jsx
import * as React from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import Typography from "@mui/material/Typography";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import AddressForm from "./components/AddressForm";
import IconButton from "@mui/material/IconButton";
import InfoMobile from "./components/InfoMobile";
import PaymentForm from "./components/PaymentForm";
import Review from "./components/Review";
import AppTheme from "./shared-theme/AppTheme";
import medicineLogo from "../assets/images/medicineLogo.png";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "../stores/Cart";      // 👈 θα αδειάσουμε το καλάθι μετά την επιτυχία
import { jwtDecode } from "jwt-decode";

const steps = ["Shipping address", "Payment details", "Review your order"];

function getStepContent(step) {
    switch (step) {
        case 0:
            return <AddressForm />;
        case 1:
            return <PaymentForm />;
        case 2:
            return <Review />;
        default:
            throw new Error("Unknown step");
    }
}

export default function Checkout(props) {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [orderError, setOrderError] = React.useState("");
    const [activeStep, setActiveStep] = React.useState(0);
    const isLastStep = activeStep === steps.length - 1;
    const activeStepLabel = isLastStep ? "Place order" : "Next";

    // Cart
    const cartItems = useSelector((store) => store.cart.items) || [];
    const subtotal = cartItems.reduce(
        (sum, item) => sum + (item.product?.price || 0) * (item.quantity || 0),
        0
    );
    const shippingCost = 3;
    const total = subtotal + shippingCost;
    const formatCurrency = (n) => `€${(n || 0).toFixed(2)}`;

    // --- PAYMENT VALIDATION (στο βήμα 1) ---
    const validatePaymentStep = () => {
        let cardNumber = (localStorage.getItem("cardNumber") || "").replace(/\s/g, "");
        let cvv = localStorage.getItem("cvv") || "";
        let expiration = localStorage.getItem("expirationDate") || ""; // MM/YY

        if (!cardNumber || !cvv || !expiration) {
            const numEl = document.getElementById("card-number");
            const cvvEl = document.getElementById("cvv");
            const expEl = document.getElementById("card-expiration");
            if (numEl) cardNumber = (numEl.value || "").replace(/\s/g, "");
            if (cvvEl) cvv = cvvEl.value || "";
            if (expEl) expiration = expEl.value || "";
        }

        if (!/^\d{16}$/.test(cardNumber)) return false;
        if (!/^\d{3}$/.test(cvv)) return false;
        const m = expiration.match(/^(\d{2})\/(\d{2})$/);
        if (!m) return false;
        const mm = parseInt(m[1], 10);
        if (mm < 1 || mm > 12) return false;

        return true;
    };

    async function handlePlaceOrder(items) {
        try {
            setOrderError("");

            const token = localStorage.getItem("jwt_token");
            if (!token) {
                setOrderError("You must be logged in to place an order.");
                return;
            }

            const decoded = jwtDecode(token);
            const customerId =
                decoded[
                "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
                ] ||
                decoded["sub"] ||
                decoded["customerId"];

            if (!customerId) {
                setOrderError("Customer ID not found in token!");
                return;
            }

            const dto = {
                customerId: parseInt(customerId, 10),
                items: items.map((item) => ({
                    productId: item.product.productId,
                    quantity: item.quantity,
                })),
            };

            const response = await fetch("https://localhost:7056/api/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(dto),
            });

            if (!response.ok) {
                const errText = await response.text();
                throw new Error(errText || "Order failed");
            }

            // ✅ Επιτυχής παραγγελία: ΑΔΕΙΑΖΟΥΜΕ ΤΟ ΚΑΛΑΘΙ (Redux + localStorage)
            dispatch(clearCart());
            localStorage.removeItem("cartItems"); // προαιρετικό safety αν έχεις mirror στο LS

            // Προχώρα στην thank-you σελίδα
            setActiveStep((s) => s + 1);
        } catch (err) {
            console.error("Error placing order:", err);
            setOrderError(err.message || "Failed to place order.");
        }
    }

    const handleNext = () => setActiveStep((s) => s + 1);
    const handleBack = () => setActiveStep((s) => s - 1);

    return (
        <AppTheme {...props}>
            <CssBaseline enableColorScheme />
            <Box sx={{ position: "fixed", top: "0rem", right: "1rem" }} />

            <Grid container sx={{ height: "100vh", mt: { xs: 0, sm: 0 } }}>
                {/* Sidebar (Order summary) */}
                <Grid
                    item
                    xs={12}
                    sm={5}
                    lg={4}
                    sx={{
                        display: { xs: "none", sm: "flex" },
                        flexDirection: "column",
                        backgroundColor: "background.paper",
                        borderRight: "1px solid",
                        borderColor: "divider",
                        alignItems: "start",
                        pt: 16,
                        px: 10,
                        gap: 4,
                    }}
                >
                    <Box sx={{ gap: 2, display: "flex", alignItems: "center" }}>
                        <IconButton onClick={() => navigate("/home")} color="primary" size="sm">
                            <img src={medicineLogo} alt="site logo" width={24} height={24} />
                        </IconButton>
                        <Typography level="title-lg">GoodPills</Typography>
                    </Box>

                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            flexGrow: 1,
                            width: "100%",
                            maxWidth: 500,
                        }}
                    >
                        <Card variant="outlined" sx={{ width: "100%", maxWidth: { sm: "100%", md: 600 } }}>
                            <CardContent>
                                <Typography variant="h6" sx={{ mb: 2 }}>
                                    Order summary
                                </Typography>

                                {cartItems.length === 0 ? (
                                    <Typography color="text.secondary">Your cart is empty</Typography>
                                ) : (
                                    <Stack spacing={1.5}>
                                        {cartItems.map((item) => {
                                            const p = item.product || {};
                                            const id = p.productId;
                                            const title = p.title || "Untitled";
                                            const price = p.price || 0;
                                            const qty = item.quantity || 0;
                                            const line = price * qty;
                                            return (
                                                <Stack key={id} direction="row" alignItems="center" spacing={2}>
                                                    <Box
                                                        sx={{
                                                            width: 56,
                                                            height: 56,
                                                            borderRadius: 1,
                                                            overflow: "hidden",
                                                            bgcolor: "grey.100",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                        }}
                                                    >
                                                        {p.base64Image ? (
                                                            <img
                                                                src={`${p.base64Image}`}
                                                                alt={title}
                                                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                                            />
                                                        ) : (
                                                            <Typography variant="caption" color="text.secondary">
                                                                No image
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                                                        <Typography variant="body1" noWrap title={title}>
                                                            {title}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            ID: {id} • Qty: {qty}
                                                        </Typography>
                                                    </Box>
                                                    <Box sx={{ textAlign: "right" }}>
                                                        <Typography variant="body2">{formatCurrency(price)}</Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            Subtotal: {formatCurrency(line)}
                                                        </Typography>
                                                    </Box>
                                                </Stack>
                                            );
                                        })}

                                        <Box
                                            sx={{
                                                borderTop: "1px solid",
                                                borderColor: "divider",
                                                pt: 1.5,
                                                mt: 0.5,
                                            }}
                                        >
                                            <Stack spacing={0.5}>
                                                <Typography variant="body2">
                                                    Subtotal: {formatCurrency(subtotal)}
                                                </Typography>
                                                <Typography variant="body2">
                                                    Shipping: {formatCurrency(shippingCost)}
                                                </Typography>
                                                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                                                    Total: {formatCurrency(total)}
                                                </Typography>
                                            </Stack>
                                        </Box>
                                    </Stack>
                                )}
                            </CardContent>
                        </Card>
                    </Box>
                </Grid>

                {/* Main content */}
                <Grid
                    item
                    xs={12}
                    sm={7}
                    lg={8}
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        maxWidth: "100%",
                        width: "100%",
                        backgroundColor: { xs: "transparent", sm: "background.default" },
                        alignItems: "start",
                        pt: { xs: 0, sm: 8 },
                        px: { xs: 2, sm: 10 },
                        gap: { xs: 4, md: 8 },
                    }}
                >
                    {/* Desktop stepper */}
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: { sm: "space-between", md: "flex-end" },
                            alignItems: "center",
                            width: "100%",
                            maxWidth: { sm: "100%", md: 600 },
                        }}
                    >
                        <Box
                            sx={{
                                display: { xs: "none", md: "flex" },
                                flexDirection: "column",
                                justifyContent: "space-between",
                                alignItems: "flex-end",
                                flexGrow: 1,
                            }}
                        >
                            <Stepper id="desktop-stepper" activeStep={activeStep} sx={{ width: "100%", height: 40 }}>
                                {steps.map((label) => (
                                    <Step
                                        sx={{
                                            ":first-of-child": { pl: 0 },
                                            ":last-of-child": { pr: 0 },
                                        }}
                                        key={label}
                                    >
                                        <StepLabel>{label}</StepLabel>
                                    </Step>
                                ))}
                            </Stepper>
                        </Box>
                    </Box>

                    {/* Mobile stepper */}
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            flexGrow: 1,
                            width: "100%",
                            maxWidth: { sm: "100%", md: 600 },
                            maxHeight: "720px",
                            gap: { xs: 5, md: "none" },
                        }}
                    >
                        <Stepper
                            id="mobile-stepper"
                            activeStep={activeStep}
                            alternativeLabel
                            sx={{ display: { xs: "flex", sm: "none" } }}
                        >
                            {steps.map((label) => (
                                <Step
                                    sx={{
                                        ":first-of-child": { pl: 0 },
                                        ":last-of-child": { pr: 0 },
                                        "& .MuiStepConnector-root": { top: { xs: 6, sm: 12 } },
                                    }}
                                    key={label}
                                >
                                    <StepLabel sx={{ ".MuiStepLabel-labelContainer": { maxWidth: "70px" } }}>
                                        {label}
                                    </StepLabel>
                                </Step>
                            ))}
                        </Stepper>

                        {/* Περιεχόμενο & actions */}
                        {activeStep === steps.length ? (
                            <Stack spacing={2} useFlexGap>
                                <Typography variant="h1">📦</Typography>
                                <Typography variant="h5">Thank you for your order!</Typography>
                                <Typography variant="body1" sx={{ color: "text.secondary" }}>
                                    Your order number is <strong>&nbsp;#140396</strong>. We have
                                    emailed your order confirmation and will update you once it’s shipped.
                                </Typography>
                                <Button
                                    onClick={() => navigate("/vieworder")}
                                    variant="contained"
                                    sx={{ alignSelf: "start", width: { xs: "100%", sm: "auto" } }}
                                >
                                    Go to my orders
                                </Button>
                            </Stack>
                        ) : (
                            <React.Fragment>
                                {getStepContent(activeStep)}

                                <Box
                                    sx={[
                                        {
                                            display: "flex",
                                            flexDirection: { xs: "column-reverse", sm: "row" },
                                            alignItems: "end",
                                            flexGrow: 1,
                                            gap: 1,
                                            pb: { xs: 12, sm: 0 },
                                            mt: { xs: 2, sm: 0 },
                                            mb: "60px",
                                        },
                                        activeStep !== 0
                                            ? { justifyContent: "space-between" }
                                            : { justifyContent: "flex-end" },
                                    ]}
                                >
                                    {activeStep !== 0 && (
                                        <>
                                            <Button
                                                startIcon={<ChevronLeftRoundedIcon />}
                                                onClick={handleBack}
                                                variant="text"
                                                sx={{ display: { xs: "none", sm: "flex" } }}
                                            >
                                                Previous
                                            </Button>
                                            <Button
                                                startIcon={<ChevronLeftRoundedIcon />}
                                                onClick={handleBack}
                                                variant="outlined"
                                                fullWidth
                                                sx={{ display: { xs: "flex", sm: "none" } }}
                                            >
                                                Previous
                                            </Button>
                                        </>
                                    )}

                                    <Button
                                        variant="contained"
                                        endIcon={<ChevronRightRoundedIcon />}
                                        onClick={() => {
                                            if (activeStep === 1) {
                                                const ok = validatePaymentStep();
                                                if (!ok) {
                                                    setOrderError("ΣΥΜΠΛΗΡΩΣΤΕ ΤΑ ΣΤΟΙΧΕΙΑ ΤΗΣ ΚΑΡΤΑΣ ΣΑΣ");
                                                    return;
                                                }
                                            }
                                            if (isLastStep) {
                                                handlePlaceOrder(cartItems);
                                            } else {
                                                setOrderError("");
                                                handleNext();
                                            }
                                        }}
                                    >
                                        {activeStepLabel}
                                    </Button>
                                </Box>

                                {orderError && (
                                    <Alert severity="error" sx={{ mt: 2 }}>
                                        {orderError}
                                    </Alert>
                                )}
                            </React.Fragment>
                        )}
                    </Box>
                </Grid>
            </Grid>
        </AppTheme>
    );
}

