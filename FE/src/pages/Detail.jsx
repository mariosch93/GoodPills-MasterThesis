// src/pages/Detail.jsx
import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../stores/Cart.jsx";
import api from "../api/axiosInstance.js";
import { jwtDecode } from "jwt-decode";

function getRole() {
    const token = localStorage.getItem("jwt_token");
    if (!token) return null;
    try {
        const d = jwtDecode(token);
        return (
            d["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
            d.role ||
            null
        );
    } catch {
        return null;
    }
}

export default function Detail() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [detail, setDetail] = useState(null);
    const [quantity, setQuantity] = useState(1);

    const role = useMemo(() => (getRole() || "").toLowerCase(), []);
    const isAdmin = role === "admin";
    const isCustomer = role === "customer";

    // Φόρτωση προϊόντος από backend με βάση το slug (title)
    useEffect(() => {
        if (!slug) {
            navigate("/home");
            return;
        }
        const decodedTitle = decodeURIComponent(slug);

        api
            .get("/Products")
            .then((res) => {
                const product = (res.data || []).find((p) => p.title === decodedTitle);
                if (product) {
                    setDetail(product);
                } else {
                    navigate("/home");
                }
            })
            .catch((err) => {
                console.error("Failed to load product:", err);
                navigate("/home");
            });
    }, [slug, navigate]);

    const handleMinusQuantity = () => setQuantity((q) => Math.max(1, q - 1));
    const handlePlusQuantity = () => setQuantity((q) => Math.min(10, q + 1));

    const handleAddToCart = () => {
        if (!detail) return;
        dispatch(addToCart({ product: detail, quantity }));
    };

    const goToEdit = () => {
        if (!detail?.productId) return;
        navigate(`/admin/products/${detail.productId}/edit`);
    };

    if (!detail) return <p>Loading...</p>;

    return (
        <div>
            {/* Header */}
            <h2 className="text-4xl font-extrabold text-center">Product Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mt-6 items-center">
                {/* Image */}
                <div className="md:col-span-3 flex items-center justify-center">
                    {detail.base64Image ? (
                        <img
                            src={detail.base64Image}
                            alt={detail.title || detail.name}
                            className="w-2/4 h-auto object-cover rounded-xl shadow-md self-center"
                        />
                    ) : (
                        <div className="w-2/4 aspect-square rounded-xl bg-gray-200/60 flex items-center justify-center text-gray-500">
                            No image
                        </div>
                    )}
                </div>

                {/* Right side */}
                <div className="md:col-span-2 flex flex-col gap-6">
                    {/* Title + (Admin) Modify */}
                    <div className="flex items-start justify-between gap-3">
                        <h1 className="text-4xl uppercase font-extrabold">
                            {detail.title || detail.name}
                        </h1>

                        {isAdmin && (
                            <button
                                onClick={goToEdit}
                                className="bg-amber-500 hover:bg-amber-600 text-white text-sm px-4 py-2 rounded-lg shadow"
                            >
                                Modify product
                            </button>
                        )}
                    </div>

                    {/* Price */}
                    <p className="font-extrabold text-4xl">
                        €{Number(detail.price ?? 0).toFixed(2)}
                    </p>

                    {/* Category / Subcategory (μόνο οι τιμές) */}
                    {(detail.category || detail.subcategory) && (
                        <div className="leading-8">
                            {detail.category && (
                                <p className="text-2xl font-bold">{detail.category}</p>
                            )}
                            {detail.subcategory && (
                                <p className="text-2xl font-bold">{detail.subcategory}</p>
                            )}
                        </div>
                    )}

                    {/* Cart controls μόνο για logged-in customer */}
                    {isCustomer && (
                        <div className="flex gap-5">
                            <div className="flex gap-2 justify-center items-center">
                                <button
                                    className="bg-gray-700 h-full w-10 font-bold text-xl rounded-xl flex justify-center items-center text-white hover:text-teal-500"
                                    onClick={handleMinusQuantity}
                                    aria-label="Decrease quantity"
                                >
                                    -
                                </button>
                                <span className="bg-gray-700 h-full w-10 font-bold text-xl rounded-xl flex justify-center items-center text-white">
                                    {quantity}
                                </span>
                                <button
                                    className="bg-gray-700 h-full w-10 font-bold text-xl rounded-xl flex justify-center items-center text-white hover:text-teal-500"
                                    onClick={handlePlusQuantity}
                                    aria-label="Increase quantity"
                                >
                                    +
                                </button>
                            </div>

                            <button
                                className="bg-slate-900 text-white px-7 py-3 rounded-xl shadow-2xl hover:text-teal-500"
                                onClick={handleAddToCart}
                            >
                                Add to Cart
                            </button>
                        </div>
                    )}

                    {/* Description (detail) */}
                    <div>
                        <p className="text-2xl font-bold whitespace-pre-line">
                            {detail.description || ""}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

