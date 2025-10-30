import * as React from "react";
import { useSelector } from "react-redux";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import api from "../../api/axiosInstance";

export default function Review() {
    // Products from cart
    const cartItems = useSelector((store) => store.cart?.items) || [];

    const subtotal = cartItems.reduce(
        (sum, item) => sum + (item.product?.price || 0) * (item.quantity || 0),
        0
    );
    const shippingCost = 3;
    const total = subtotal + shippingCost;

    // Shipping info (fetched only when logged-in customer)
    const [formData, setFormData] = React.useState({
        fullname: "",
        address: "",
        age: "",
        city: "",
        phonenumber: "",
        email: "",
        country: "Greece",
    });

    React.useEffect(() => {
        const token = localStorage.getItem("jwt_token");
        const role = (localStorage.getItem("jwt_role") || "").toLowerCase();

        if (!token || (role && role !== "customer")) return;

        api
            .get("/Customer/me")
            .then((res) => {
                const data = res?.data || {};
                setFormData((prev) => ({
                    ...prev,
                    fullname: data.fullname || "",
                    email: data.email || "",
                    age: data.age ?? "",
                    phonenumber: data.phoneNumber || "",
                    city: data.city || "",
                    address: data.address || "",
                    country: "Greece",
                }));
            })
            .catch((err) => {
                console.error("Failed to fetch customer info", err);
            });
    }, []);

    // Payment info από sessionStorage (ΟΧΙ localStorage)
    const cardNumber = sessionStorage.getItem("cardNumber") || "";
    const expiry = sessionStorage.getItem("expirationDate") || "";
    const type = "Credit/Debit Card";

    // Mask helper
    const maskCardNumber = (num) => {
        if (!num) return "-";
        const clean = String(num).replace(/\s/g, "");
        if (clean.length < 4) return "****";
        const last4 = clean.slice(-4);
        return `**** **** **** ${last4}`;
    };

    const formatCurrency = (n) => `€${(n || 0).toFixed(2)}`;

    return (
        <Stack spacing={2}>
            {/* Products summary */}
            <List disablePadding>
                {cartItems.map((item) => {
                    const p = item.product || {};
                    const lineTotal = (p.price || 0) * (item.quantity || 0);
                    const key = p.productId ?? `${p.title || "item"}-${item.quantity}`;
                    return (
                        <ListItem key={key} sx={{ py: 1, px: 0 }}>
                            <ListItemText
                                primary={p.title || "Untitled"}
                                secondary={`Qty: ${item.quantity || 0}`}
                            />
                            <Typography variant="body2">
                                {formatCurrency(lineTotal)}
                            </Typography>
                        </ListItem>
                    );
                })}
                <ListItem sx={{ py: 1, px: 0 }}>
                    <ListItemText primary="Shipping" />
                    <Typography variant="body2">
                        {formatCurrency(shippingCost)}
                    </Typography>
                </ListItem>
                <ListItem sx={{ py: 1, px: 0 }}>
                    <ListItemText primary="Total" />
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                        {formatCurrency(total)}
                    </Typography>
                </ListItem>
            </List>

            <Divider />

            {/* Shipment & Payment Details */}
            <Stack
                direction="column"
                divider={<Divider flexItem />}
                spacing={2}
                sx={{ my: 2 }}
            >
                {/* Shipping */}
                <div>
                    <Typography variant="h6" gutterBottom>
                        <u>
                            <b>Shipment details</b>
                        </u>
                    </Typography>
                    <Typography gutterBottom>
                        Fullname: {formData.fullname || "-"}
                    </Typography>
                    <Typography gutterBottom>
                        Address: {formData.address || "-"}
                    </Typography>
                    <Typography gutterBottom>City: {formData.city || "-"}</Typography>
                    <Typography gutterBottom>Country: {formData.country || "-"}</Typography>
                </div>

                {/* Payment */}
                <div>
                    <Typography variant="subtitle2" gutterBottom>
                        Payment details
                    </Typography>
                    <Grid container>
                        <Stack direction="row" spacing={1} useFlexGap sx={{ width: "100%", mb: 1 }}>
                            <Typography variant="body1" sx={{ color: "text.secondary" }}>
                                Card type:
                            </Typography>
                            <Typography variant="body2">{type}</Typography>
                        </Stack>
                        <Stack direction="row" spacing={1} useFlexGap sx={{ width: "100%", mb: 1 }}>
                            <Typography variant="body1" sx={{ color: "text.secondary" }}>
                                Card number:
                            </Typography>
                            <Typography variant="body2">{maskCardNumber(cardNumber)}</Typography>
                        </Stack>
                        <Stack direction="row" spacing={1} useFlexGap sx={{ width: "100%" }}>
                            <Typography variant="body1" sx={{ color: "text.secondary" }}>
                                Expiry date:
                            </Typography>
                            <Typography variant="body2">{expiry || "-"}</Typography>
                        </Stack>
                    </Grid>
                </div>
            </Stack>
        </Stack>
    );
}
