import { Link } from "react-router-dom";
import iconCart from "../assets/images/shopping-cart.png";
import { useDispatch } from "react-redux";
import { addToCart } from "../stores/Cart";
import { jwtDecode } from "jwt-decode";

function getRoleFromToken() {
    const token = localStorage.getItem("jwt_token");
    if (!token) return null;
    try {
        const decoded = jwtDecode(token);
        return (
            decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
            decoded.role ||
            null
        );
    } catch {
        return null;
    }
}

const ProductCart = (props) => {
    const { title, price, base64Image } = props.data;
    const dispatch = useDispatch();

    const showAddToCart = (getRoleFromToken() || "").toLowerCase() === "customer";

    const handleAddToCart = () => {
        dispatch(
            addToCart({
                product: props.data,
                quantity: 1,
            })
        );
    };

    return (
        <div
            className="p-5 rounded-xl shadow-sm text-black 
                 bg-gray-900/20 backdrop-blur-md 
                 dark:bg-neutral-900/60 border-black
                 hover:shadow-lg hover:shadow-[rgb(35,175,180)]
                 flex flex-col"
        >
            <Link to={`/home/${encodeURIComponent(title)}`}>
                {base64Image && (
                    <img
                        src={base64Image}
                        alt={title}
                        className="w-full h-80 object-cover object-top drop-shadow-[0_80px_30px_#0007]"
                    />
                )}
            </Link>

            <h3 className="text-2xl py-3 text-center font-medium">{title}</h3>

            {/* footer στο κάτω μέρος */}
            <div className="mt-auto flex justify-between items-center">
                <p>
                    €
                    <span className="text-2xl font-medium">
                        {Number(price ?? 0).toFixed(2)}
                    </span>
                </p>

                {showAddToCart && (
                    <button
                        onClick={handleAddToCart}
                        className="bg-gray-400 p-2 rounded-md text-sm hover:bg-teal-500 flex gap-2"
                    >
                        <img src={iconCart} alt="" className="w-5" />
                        Add To Cart
                    </button>
                )}
            </div>
        </div>
    );
};

export default ProductCart;

