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
import Pagination from "@mui/material/Pagination";

export default function Mainmenu() {
  const [role, setRole] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handlePageChange = window.scrollTo({ top: 0, behavior: "smooth" });

  const menuButtonSx = {
    textTransform: "none",
    fontWeight: 500,
    fontSize: {
      xs: "0.75rem",
      sm: "0.85rem",
      md: "0.95rem",
    },
    whiteSpace: "nowrap",
    borderRadius: "999px",
    px: {
      xs: 1,
      sm: 1.25,
      md: 1.5,
    },
    transition:
      "color 0.2s ease, transform 0.15s ease, background-color 0.15s ease, box-shadow 0.15s ease",

    "& .MuiSvgIcon-root": {
      transition: "color 0.2s ease",
      fontSize: "1rem",
    },

    "&:hover": {
      color: "#1d4ed8",
      transform: {
        xs: "scale(1.03)",
        md: "scale(1.1)",
      },
      backgroundColor: "rgba(37,99,235,0.08)",
      boxShadow: {
        xs: "0 0 4px rgba(37,99,235,0.4)",
        md: "0 0 10px rgba(37,99,235,0.6)",
      },
    },

    "&:hover .MuiSvgIcon-root": {
      color: "#1d4ed8",
    },

    "&:active": {
      transform: "scale(0.97)",
      boxShadow: "0 0 6px rgba(37,99,235,0.5)",
    },
  };

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
    onClick:handlePageChange
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
        justifyContent: "center",
        flexWrap: { xs: "wrap", md: "nowrap" },
        rowGap: 0.5,
        columnGap: {
          xs: 1,
          sm: 2,
          md: 3,
        },
        maxWidth: "100%",
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
            sx={menuButtonSx}
          >
            {text}
          </Button>
        ) : (
          <Button
            key={id}
            color="inherit"
            onClick={onClick}
            startIcon={icon}
            sx={menuButtonSx}
          >
            {text}
          </Button>
        )
      )}
    </Box>
  );
}
