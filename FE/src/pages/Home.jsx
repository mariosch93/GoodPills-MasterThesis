import ProductCart from "../components/ProductCart.jsx";
import { Container, Box } from "@mui/material";
import Pagination from "@mui/material/Pagination";
import { useState, useEffect } from "react";
import api from "../api/axiosInstance.js";
import Typography from "@mui/material/Typography";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import MedicationIcon from "@mui/icons-material/Medication";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import HeroLeft from "../components/HeroLeft.jsx";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);

  const ITEMS_PER_PAGE = 8;

  useEffect(() => {
    api.get("/Products").then((res) => {
      setProducts(res.data);
      console.log(res.data);
    });
  }, []);

  const totalPages =
    products.length > 0 ? Math.ceil(products.length / ITEMS_PER_PAGE) : 1;

  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const pageProducts = products.slice(startIndex, endIndex);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <>
      <HeroLeft />

      <Container>
        <Typography
          variant="h4"
          color="text.primary"
          sx={{
            textAlign: "center",
            fontSize: "md",
            lineHeight: "lg",
            fontWeight: "bold",
            mt: 4,
          }}
        >
          Enjoy secure payments{" "}
          <CreditCardIcon sx={{ fontSize: "inherit", color: "#6c7802" }} />,
          fast delivery{" "}
          <LocalShippingIcon sx={{ fontSize: "inherit", color: "#0A66C2" }} />,
          and a wide range of in-stock products{" "}
          <MedicationIcon sx={{ fontSize: "inherit", color: "red" }} /> only at
          GoodPills.
        </Typography>

        <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-5 mt-4">
          {pageProducts.map((product) => (
            <ProductCart key={product.productId} data={product} />
          ))}
        </div>

        {/* Pagination controls */}
        {totalPages > 1 && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              my: 4,
            }}
          >
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
              shape="rounded"
              siblingCount={1}
              boundaryCount={1}
            />
          </Box>
        )}
      </Container>
    </>
  );
};

export default Home;
