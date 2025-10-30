import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import LockResetIcon from "@mui/icons-material/LockReset";
import HomeIcon from "@mui/icons-material/Home";
import LoginIcon from "@mui/icons-material/Login";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import { clearCart } from "../stores/Cart";

export default function Mainmenu() {
    const [open, setOpen] = useState(false);
    const [role, setRole] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const toggleDrawer = (newOpen) => () => setOpen(newOpen);

    // Διάβασε ρόλο από token (αν υπάρχει)
    useEffect(() => {
        const token = localStorage.getItem("jwt_token");
        if (!token) {
            setRole(null);
            return;
        }
        try {
            const decoded = jwtDecode(token);
            const userRole =
                decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
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

    // Logout: καθάρισε καλάθι + auth + αποθηκευμένα στοιχεία κάρτας
    const handleLogout = () => {
        try {
            dispatch(clearCart());

            localStorage.removeItem("jwt_token");
            localStorage.removeItem("jwt_userId");
            localStorage.removeItem("jwt_role");
            localStorage.removeItem("cartItems");

            // Καθάρισμα στοιχείων πληρωμής από local & session
            ["cardNumber", "cardHolder", "expirationDate", "cvv"].forEach((k) => {
                sessionStorage.removeItem(k);
                localStorage.removeItem(k);
            });

            navigate("/");
        } finally {
            setOpen(false);
        }
    };

    // Χτίζουμε το μενού με τη σωστή σειρά
    const menuItems = [];

    // Home (πάντα)
    menuItems.push({
        id: "home",
        text: "Home",
        icon: <HomeIcon />,
        to: "/home",
    });

    // Sign in μόνο όταν δεν είμαστε logged-in
    if (!isLoggedIn) {
        menuItems.push({
            id: "signin",
            text: "Sign in Page",
            icon: <LoginIcon />,
            to: "/",
        });
    }

    // Reset Password μόνο όταν είμαστε logged-in ΚΑΙ δεν είμαστε admin
    if (isLoggedIn && !isAdmin) {
        menuItems.push({
            id: "reset",
            text: "Reset Password",
            icon: <LockResetIcon />,
            to: "/resetpasswordlogged",
        });
    }

    // Admin μόνο
    if (isAdmin) {
        menuItems.push({
            id: "adminPanel",
            text: "Admin Panel",
            icon: <AdminPanelSettingsIcon />,
            to: "/adminpanel",
        });
    }

    // Customer μόνο
    if (isCustomer) {
        menuItems.push({
            id: "orders",
            text: "View Orders",
            icon: <LocalShippingIcon />,
            to: "/vieworder",
        });
        // Update Profile — ακριβώς πριν το Logout
        menuItems.push({
            id: "profile",
            text: "Update Profile",
            icon: <ManageAccountsIcon />,
            to: "/profile",
        });
    }

    // Logout (τελευταίο) — μόνο όταν είμαστε logged-in
    if (isLoggedIn) {
        menuItems.push({
            id: "logout",
            text: "Logout",
            icon: <LogoutIcon />,
            onClick: handleLogout,
        });
    }

    const DrawerList = (
        <Box
            sx={{ width: 250, bgcolor: "rgba(245, 245, 245, 0.10)", height: "100vh" }}
            onClick={toggleDrawer(false)}
        >
            <List>
                {menuItems.map(({ id, text, icon, to, onClick }) => (
                    <ListItem key={id} disablePadding>
                        {to ? (
                            <ListItemButton component={Link} to={to}>
                                <ListItemIcon>{icon}</ListItemIcon>
                                <ListItemText primary={text} />
                            </ListItemButton>
                        ) : (
                            <ListItemButton
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onClick?.();
                                }}
                            >
                                <ListItemIcon>{icon}</ListItemIcon>
                                <ListItemText primary={text} />
                            </ListItemButton>
                        )}
                    </ListItem>
                ))}
            </List>
            <Divider />
        </Box>
    );

    return (
        <div>
            <Button
                startIcon={<MenuIcon />}
                onClick={toggleDrawer(true)}
                sx={{ fontSize: "1.3rem", color: "black" }}
            >
                Menu
            </Button>
            <Drawer open={open} onClose={toggleDrawer(false)}>
                {DrawerList}
            </Drawer>
        </div>
    );
}

