import { useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toggleStatusTab } from "../stores/Cart";
import CartItem from "./CartItem";
import { useNavigate } from "react-router-dom";

const CartTab = () => {
    const rawCarts = useSelector((store) => store.cart.items);
    const statusTab = useSelector((store) => store.cart.statusTab);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [error, setError] = useState("");

    // Σταθεροποιούμε το array ώστε να μην αλλάζει reference σε κάθε render
    const carts = useMemo(() => rawCarts ?? [], [rawCarts]);

    const totalPrice = useMemo(
        () =>
            carts.reduce(
                (sum, item) =>
                    sum + (item.product?.price || 0) * (item.quantity || 0),
                0
            ),
        [carts]
    );

    const handleCloseTabCart = () => {
        dispatch(toggleStatusTab());
    };

    const handleCheckout = () => {
        if (carts.length === 0) {
            setError("ΠΑΡΑΚΑΛΩ ΕΠΙΛΕΞΤΕ ΠΡΟΪΟΝ");
            setTimeout(() => setError(""), 2200);
            return;
        }
        dispatch(toggleStatusTab());
        navigate("/checkout");
    };

    return (
        <div
            className={`fixed top-0 right-0 bg-gray-700 shadow-2xl w-96 h-full grid grid-rows-[60px_1fr_auto]
      transform transition-transform duration-500 ${statusTab ? "" : "translate-x-full"
                }`}
        >
            <h2 className="p-5 text-white text-2xl">Shopping Cart</h2>

            <div className="p-5 h-full overflow-y-auto flex flex-col gap-4">
                {carts.length > 0 ? (
                    carts.map((item) => (
                        <CartItem
                            key={item.product?.productId ?? `${item.product?.title}-${item.quantity}`}
                            data={item}
                        />
                    ))
                ) : (
                    <p className="text-white">Your cart is empty</p>
                )}
            </div>

            {error && (
                <div className="px-4 pb-2 text-sm text-red-300">{error}</div>
            )}

            <div className="grid grid-cols-2 items-center p-4 border-t border-gray-600">
                <span className="text-white font-bold">
                    Total: €{totalPrice.toFixed(2)}
                </span>
                <div className="flex gap-2 justify-end">
                    <button
                        className="bg-black text-white px-3 py-1 rounded"
                        onClick={handleCloseTabCart}
                    >
                        Close
                    </button>
                    <button
                        className="bg-teal-600 text-white px-3 py-1 rounded"
                        onClick={handleCheckout}
                    >
                        Checkout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartTab;

