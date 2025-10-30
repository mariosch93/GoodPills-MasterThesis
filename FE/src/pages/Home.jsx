import ProductCart from "../components/ProductCart.jsx";
import { Container } from "@mui/material";
import { useState, useEffect } from "react";
import api from "../api/axiosInstance.js";
import Marquee from "../components/Marquee.jsx";

const Home = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get("/Products").then((res) => {
      setProducts(res.data);
      console.log(res.data);
    });
  }, []);

  return (
    <Container>
      {/* <h1 className="text-3xl my-5">Product List</h1> */}
      <Marquee />
      <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-5">
        {products.map((product) => (
          <ProductCart key={product.productId} data={product} />
        ))}
      </div>
    </Container>
  );
};

export default Home;
