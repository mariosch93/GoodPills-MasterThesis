import React, { useEffect, useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import {
  Box,
  CircularProgress,
  Typography,
  Paper,
  Divider,
} from "@mui/material";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import api from "../api/axiosInstance";
import Link from "@mui/joy/Link";
import ProfileBg from "../assets/images/profilePageBg.jpg";
import { useNavigate } from "react-router-dom";

const ViewOrder = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("jwt_token");
      if (!token) {
        setErrorMsg("Please sign in to view your orders.");
        setLoading(false);
        return;
      }
      try {
        const res = await api.get("orders/my");
        setOrders(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error(err);
        setErrorMsg("Error fetching orders.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading)
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  if (errorMsg)
    return (
      <Box textAlign="center" mt={5}>
        <Typography color="error">{errorMsg}</Typography>
      </Box>
    );

  const rows = (orders || []).map((order) => ({
    id: order.orderId,
    orderId: order.orderId,
    customer: order.customerId,
    total:
      typeof order.totalCost === "number"
        ? `€${order.totalCost.toFixed(2)}`
        : "-",
    products: order.products || [],
  }));

  const columns = [
    { field: "orderId", headerName: "Order ID", width: 100 },
    { field: "total", headerName: "Total", width: 120 },
    {
      field: "products",
      headerName: "Products",
      flex: 1, // Πιάνει όλο τον υπόλοιπο χώρο
      renderCell: (params) => {
        // 1. Παίρνουμε μόνο τα ονόματα (titles)
        const productNames = params.value.map((p) => p.title).join(", ");

        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              height: "100%",
              width: "100%",
            }}
          >
            <Typography
              variant="body2"
              color="text.primary"
              noWrap
              title={productNames}
            >
              {productNames}
            </Typography>
          </Box>
        );
      },
    },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        py: 4,
        px: 2,
        display: "flex",
        justifyContent: "center",
        // Background settings (προαιρετικά)
        backgroundImage: `url(${ProfileBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed", // Για να μένει σταθερό το background στο scroll
      }}
    >
      <Paper
        elevation={4}
        sx={{
          width: "100%",
          maxWidth: 1200,
          p: 3,
          borderRadius: 2,
          bgcolor: "white", // Λευκό φόντο κάρτας
          color: "text.primary", // Μαύρα γράμματα
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          {/* Group 1: Αριστερά (Εικονίδιο + Τίτλος) */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <LocalShippingIcon color="primary" sx={{ mr: 1, fontSize: 30 }} />
            <Typography variant="h5" fontWeight="bold">
              My Orders
            </Typography>
          </Box>

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
        <Divider sx={{ mb: 2 }} />

        <Box sx={{ height: 600, width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[5, 10, 20]}
            components={{ Toolbar: GridToolbar }}
            disableSelectionOnClick
            // Αφαιρέσαμε το getRowHeight='auto' για να είναι compact οι γραμμές
            sx={{
              // Βεβαιωνόμαστε ότι το κείμενο στο grid είναι μαύρο
              "& .MuiDataGrid-cell": {
                color: "text.primary",
              },
            }}
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default ViewOrder;
