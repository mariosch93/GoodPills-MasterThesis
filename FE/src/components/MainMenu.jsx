import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import LockResetIcon from "@mui/icons-material/LockReset";
import HomeIcon from "@mui/icons-material/Home";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import { clearCart } from "../stores/Cart";

export default function Mainmenu() {
    const [role, setRole] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const token = localStorage.getItem("jwt_token");
        if (!token) {
            setRole(null);
            return;
        }
        try {
            const decoded = jwtDecode(token);
            const userRole =
                decoded[
                "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
                ] ||
                decoded.role ||
                null;
            setRole(userRole);
        } catch {
            setRole(null);
        }
    }, []);

    const isLoggedIn = Boolean(localStorage.getItem("jwt_token"));
    const isAdmin = (role || "").toLowerCase() === "admin";
    const isCustomer = (role || "").toLowerCase() === "customer";

    const handleLogout = () => {
        try {
            dispatch(clearCart());
            localStorage.removeItem("jwt_token");
            localStorage.removeItem("jwt_userId");
            localStorage.removeItem("jwt_role");
            localStorage.removeItem("cartItems");

            ["cardNumber", "cardHolder", "expirationDate", "cvv"].forEach((k) => {
                sessionStorage.removeItem(k);
                localStorage.removeItem(k);
            });

            navigate("/");
        } finally {
            /* nothing */
        }
    };

    const menuItems = [];

    menuItems.push({
        id: "home",
        text: "Home",
        icon: <HomeIcon fontSize="small" />,
        to: "/home",
    });

    if (!isLoggedIn) {
        menuItems.push({
            id: "signin",
            text: "Sign in Page",
            icon: <LoginIcon fontSize="small" />,
            to: "/",
        });
    }

    if (isLoggedIn && !isAdmin) {
        menuItems.push({
            id: "reset",
            text: "Reset Password",
            icon: <LockResetIcon fontSize="small" />,
            to: "/resetpasswordlogged",
        });
    }

    if (isAdmin) {
        menuItems.push({
            id: "adminPanel",
            text: "Admin Panel",
            icon: <AdminPanelSettingsIcon fontSize="small" />,
            to: "/adminpanel",
        });
    }

    if (isCustomer) {
        menuItems.push(
            {
                id: "orders",
                text: "View Orders",
                icon: <LocalShippingIcon fontSize="small" />,
                to: "/vieworder",
            },
            {
                id: "profile",
                text: "Update Profile",
                icon: <ManageAccountsIcon fontSize="small" />,
                to: "/profile",
            }
        );
    }

    if (isLoggedIn) {
        menuItems.push({
            id: "logout",
            text: "Logout",
            icon: <LogoutIcon fontSize="small" />,
            onClick: handleLogout,
        });
    }

    return (
        <Box
            component="nav"
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 3,
            }}
        >
            {menuItems.map(({ id, text, icon, to, onClick }) =>
                to ? (
                    <Button
                        key={id}
                        color="inherit"
                        component={Link}
                        to={to}
                        startIcon={icon}
                        sx={{
                            textTransform: "none",
                            fontWeight: 500,
                            fontSize: "0.95rem",
                            whiteSpace: "nowrap",
                        }}
                    >
                        {text}
                    </Button>
                ) : (
                    <Button
                        key={id}
                        color="inherit"
                        onClick={onClick}
                        startIcon={icon}
                        sx={{
                            textTransform: "none",
                            fontWeight: 500,
                            fontSize: "0.95rem",
                            whiteSpace: "nowrap",
                        }}
                    >
                        {text}
                    </Button>
                )
            )}
        </Box>
    );
}
