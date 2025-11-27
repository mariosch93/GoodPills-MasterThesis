import { Outlet } from "react-router-dom";
import Header from "./Header";
import CartTab from "./CartTab";
import { useSelector } from "react-redux";
import Footer from "./Footer";
import homeBg from "../assets/images/homeBg.png";
import { useMemo } from "react";
import { jwtDecode } from "jwt-decode";
import HeroLeft01 from "./HeroLeft01";
import HeroLeft02 from "./HeroLeft02";

const Layout = () => {
    const statusTabCart = useSelector((store) => store.cart.statusTab);

    const isCustomer = useMemo(() => {
        const token = localStorage.getItem("jwt_token");
        if (!token) return false;

        const cachedRole = localStorage.getItem("jwt_role");
        if (cachedRole && cachedRole.toLowerCase() === "customer") return true;

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

    return (
        <div
            className="bg-zinc-200 dark:bg-zinc-900 text-black dark:text-white min-h-screen flex flex-col transition-colors duration-300"
            style={{ backgroundImage: `url(${homeBg})` }}
        >
            <Header />

            <main className="flex-1 w-full max-w-[98vw] mx-auto pt-16">
                <div
                    className={`overflow-auto max-h-full p-5 transform transition-transform duration-500 ${isCustomer && statusTabCart ? "-translate-x-56" : ""
                        }`}
                >
                    <HeroLeft01 />
                    <br />
                    <HeroLeft02 />
                    <br />
                    <Outlet />
                </div>
            </main>

            <Footer />

            {isCustomer && <CartTab />}
        </div>
    );
};

export default Layout;
