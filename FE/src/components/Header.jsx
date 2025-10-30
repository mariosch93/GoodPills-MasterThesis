import iconCart from "../assets/images/shopping-cart.png";
import { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toggleStatusTab } from "../stores/Cart";
import Mainmenu from "./MainMenu";
import { jwtDecode } from "jwt-decode"; // για ασφαλή ανάγνωση ρόλου από το token

const Header = () => {
    const [totalQuantity, setTotalQuantity] = useState(0);
    const carts = useSelector((store) => store.cart.items);
    const dispatch = useDispatch();

    // Υπολόγισε αν ο χρήστης είναι πελάτης
    const isCustomer = useMemo(() => {
        const token = localStorage.getItem("jwt_token");
        if (!token) return false;

        // Αν έχεις ήδη αποθηκεύσει ρόλο στο login:
        const cachedRole = localStorage.getItem("jwt_role");
        if (cachedRole && cachedRole.toLowerCase() === "customer") return true;

        // Αλλιώς κάνε decode από το token με fallback στα γνωστά claim keys
        try {
            const decoded = jwtDecode(token);
            const role =
                decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
                decoded.role ||
                "";
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
        <header className="flex justify-between items-center mb-5">
            <Mainmenu />

            <div className="flex justify-center items-center space-x-4 m-4">
                {/* Εμφάνισε το cart μόνο για authenticated Customer */}
                {isCustomer && (
                    <div className="relative w-10 h-10">
                        <div
                            className="w-full h-full bg-gray-100 rounded-full hover:bg-sky-400 flex justify-center items-center"
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
        </header>
    );
};

export default Header;
