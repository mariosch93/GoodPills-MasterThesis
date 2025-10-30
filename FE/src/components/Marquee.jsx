import React from "react";
import { Box, Typography } from "@mui/material";

export default function Marquee() {
  return (
    <Box
      sx={{
        overflow: "hidden",
        whiteSpace: "nowrap",
        backgroundColor: "transparent",
        color: "black",
        py: 1,
      }}
    >
      <Typography
        variant="h5"
        component="div"
        sx={{
          display: "inline-block",
          px: 2,
          animation: "marquee 15s linear infinite",
          "@keyframes marquee": {
            "0%": { transform: "translateX(100%)" },
            "100%": { transform: "translateX(-100%)" },
          },
        }}
      >
        🚀 Welcome to GoodPills E-Shop • Special Discounts 💊• Fast Delivery 🚚
        • Secure Payments 💳
      </Typography>
    </Box>
  );
}
