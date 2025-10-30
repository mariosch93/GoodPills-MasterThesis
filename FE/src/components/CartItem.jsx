import { useDispatch } from "react-redux";
import { changeQuantity, removeFromCart } from "../stores/Cart";

const CartItem = ({ data }) => {
    const { product, quantity } = data || {};
    const dispatch = useDispatch();

    if (!product) return null;

    const name = product.title || product.name || "Untitled";
    const price = typeof product.price === "number" ? product.price : 0;

    const handleMinusQuantity = () => {
        if (quantity > 1) {
            dispatch(
                changeQuantity({
                    productId: product.productId,
                    quantity: quantity - 1,
                })
            );
        } else {
            dispatch(removeFromCart(product.productId));
        }
    };

    const handlePlusQuantity = () => {
        dispatch(
            changeQuantity({
                productId: product.productId,
                quantity: quantity + 1,
            })
        );
    };

    return (
        <div className="p-1">
            <div className="w-full flex justify-between items-center text-white p-2">
                {/* Εικόνα μόνο αν υπάρχει base64Image */}
                {product.base64Image ? (
                    <img
                        src={product.base64Image}
                        alt={name}
                        className="w-12 h-12 object-cover rounded"
                    />
                ) : null}

                <h3 className="flex-1 px-2 truncate">{name}</h3>

                <p className="p-2">€{(price * quantity).toFixed(2)}</p>

                <div className="w-20 flex justify-between gap-2">
                    <button
                        className="flex items-center justify-center bg-gray-200 rounded-full w-6 h-6 text-cyan-600 hover:brightness-150 transition duration-200"
                        onClick={handleMinusQuantity}
                        aria-label="Decrease quantity"
                    >
                        -
                    </button>
                    <span>{quantity}</span>
                    <button
                        className="flex items-center justify-center bg-gray-200 rounded-full w-6 h-6 text-cyan-600 hover:brightness-150 transition duration-200"
                        onClick={handlePlusQuantity}
                        aria-label="Increase quantity"
                    >
                        +
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartItem;
