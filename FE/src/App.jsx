import "./App.css";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Detail from "./pages/Detail";
import OpeningPage from "./pages/OpeningPage";
import Signup from "./pages/Signup";
import ResetPassword from "./pages/ResetPassword";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./AuthProvider";
import AdminPanel from "./pages/AdminPanel";
import Checkout from "./checkout/Checkout";
import ResetPasswordOpening from "./pages/ResetPasswordOpening";
import ViewOrder from "./pages/ViewOrder";
import AdminEditProduct from "./pages/AdminEditProduct";
import Profile from "./pages/Profile";

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<OpeningPage />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/resetpasswordopening" element={<ResetPasswordOpening />} />
                    <Route path="/resetpasswordlogged" element={<ResetPassword />} />
                    <Route path="/home" element={<Layout />}>
                        <Route index element={<Home />} />
                        <Route path=":slug" element={<Detail />} />
                    </Route>
                    <Route path="/adminpanel" element={<AdminPanel />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/vieworder" element={<ViewOrder />} />
                    <Route path="/admin/products/:id/edit" element={<AdminEditProduct />} />
                    <Route path="/profile" element={<Profile />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
