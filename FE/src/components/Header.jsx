import iconCart from "../assets/images/shopping-cart.png";
import { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toggleStatusTab } from "../stores/Cart";
import Mainmenu from "./MainMenu";
import { jwtDecode } from "jwt-decode";

const Header = () => {
    const [totalQuantity, setTotalQuantity] = useState(0);
    const carts = useSelector((store) => store.cart.items);
    const dispatch = useDispatch();

    const isCustomer = useMemo(() => {
        const token = localStorage.getItem("jwt_token");
        if (!token) return false;

        const cachedRole = localStorage.getItem("jwt_role");
        if (cachedRole && cachedRole.toLowerCase() === "customer") return true;

        try {
            const decoded = jwtDecode(token);
            const role =
                decoded[
                "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
                ] || decoded.role || "";
            return String(role).toLowerCase() === "customer";
        } catch {
            return false;
        }
    }, []);

    useEffect(() => {
        let total = 0;
        carts.forEach((item) => (total += item.quantity));
        setTotalQuantity(total);
    }, [carts]);

    const handleOpenTabCart = () => {
        dispatch(toggleStatusTab());
    };

    return (
        <header
            className="
        fixed top-0 left-0 right-0 z-50
        bg-transparent
        backdrop-blur-md
        border-b border-black/5
      "
        >
            <div className="flex items-center px-6 py-3">
                {/* Left spacer */}
                <div className="flex-1" />

                {/* Centered menu */}
                <div className="flex-1 flex justify-center">
                    <Mainmenu />
                </div>

                {/* Cart right */}
                <div className="flex-1 flex justify-end">
                    {isCustomer && (
                        <div className="relative w-10 h-10 cursor-pointer">
                            <div
                                className="w-full h-full bg-gray-100/90 rounded-full hover:bg-sky-400 flex justify-center items-center"
                                onClick={handleOpenTabCart}
                            >
                                <img src={iconCart} alt="cart icon" className="w-6" />
                            </div>
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex justify-center items-center">
                                {totalQuantity}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
