import React, { useEffect, useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import {
    Box,
    CircularProgress,
    Typography,
    Paper,
    Divider,
    Avatar,
    Stack,
} from "@mui/material";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import api from "../api/axiosInstance";

const ViewOrder = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("jwt_token");
        if (!token) {
            setErrorMsg("Please sign in to view your orders.");
            setLoading(false);
            return;
        }

        const fetchOrders = async () => {
            try {
                const res = await api.get("orders/my");
                setOrders(Array.isArray(res.data) ? res.data : []);
            } catch (err) {
                console.error(err);
                const status = err.response?.status;
                if (status === 401) {
                    setErrorMsg("Session expired. Please sign in again.");
                } else if (status === 403) {
                    setErrorMsg("Access forbidden. Please login as a customer.");
                } else {
                    setErrorMsg("Error fetching orders.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" mt={5}>
                <CircularProgress />
            </Box>
        );
    }

    if (errorMsg) {
        return (
            <Box textAlign="center" mt={5}>
                <Typography color="error">{errorMsg}</Typography>
            </Box>
        );
    }

    // Flatten orders -> rows για DataGrid
    const rows = (orders || []).flatMap((order) =>
        (order.products || []).map((p, idx) => ({
            id: `${order.orderId}-${p.productId ?? idx}`,
            orderId: order.orderId,
            customer: order.customerId, // ή βάλ’ το "-" αν δεν θες να φαίνεται
            total:
                typeof order.totalCost === "number"
                    ? `€${order.totalCost.toFixed(2)}`
                    : "-",
            title: p.title,
            quantity: 1, // προς το παρόν 1, αφού κάθε product αφαιρεί 1 από το stock
            image: p.base64Image,
        }))
    );

    const columns = [
        { field: "orderId", headerName: "Order ID", width: 120 },
        { field: "customer", headerName: "Customer", width: 150 },
        { field: "total", headerName: "Total Cost", width: 150 },
        {
            field: "title",
            headerName: "Product",
            flex: 1,
            renderCell: (params) => (
                <Stack direction="row" spacing={1} alignItems="center">
                    <Avatar
                        variant="rounded"
                        src={params.row.image || ""}
                        alt={params.value}
                        sx={{ width: 40, height: 40 }}
                    />
                    <Typography variant="body2">
                        {params.value} x{params.row.quantity}
                    </Typography>
                </Stack>
            ),
        },
    ];

    return (
        <Box
            sx={{
                minHeight: "100vh",
                bgcolor: "background.default",
                py: 4,
                px: 2,
                display: "flex",
                justifyContent: "center",
            }}
        >
            <Paper
                elevation={4}
                sx={{
                    width: "100%",
                    maxWidth: 1100,
                    p: 3,
                    borderRadius: 2,
                    bgcolor: "background.paper",
                }}
            >
                {/* Header */}
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <LocalShippingIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h5" fontWeight="bold">
                        My Orders
                    </Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />

                {/* DataGrid */}
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5, 10]}
                    components={{ Toolbar: GridToolbar }}
                    autoHeight
                    disableSelectionOnClick
                    localeText={{ noRowsLabel: "No orders found." }}
                />
            </Paper>
        </Box>
    );
};

export default ViewOrder;
