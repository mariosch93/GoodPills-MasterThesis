import Link from "@mui/joy/Link";
import Typography from "@mui/joy/Typography";
import TwoSidedLayout from "./TwoSidedLayout.jsx";
import { useNavigate } from 'react-router-dom'


export default function HeroLeft() {
    const navigate = useNavigate()
    const token =
        typeof window !== "undefined" ? localStorage.getItem("jwt_token") : null;

    return (
        <TwoSidedLayout>
            <Typography color="primary" sx={{ fontSize: "lg", fontWeight: "lg" }}>
                Your Health, Our Priority
            </Typography>

            <Typography
                level="h1"
                sx={{
                    fontWeight: "xl",
                    fontSize: "clamp(1.875rem, 1.3636rem + 2.1818vw, 3rem)",
                }}
            >
                Your Trusted Pharmacy, Just a Click Away
            </Typography>

            <Typography
                color="text.secondary"
                sx={{ fontSize: "lg", lineHeight: "lg" }}
            >
                Discover premium health products, vitamins, and skincare at unbeatable
                prices. Enjoy fast shipping and expert advice from our dedicated team.
            </Typography>

            {!token && (
                <Typography>
                    Already a member? <Link
                        onClick={() => {
                            localStorage.clear();
                            navigate("/");
                        }}
                        level="title-sm"
                        sx={{ cursor: "pointer" }}
                    >
                        Sign in!
                    </Link>
                </Typography>
            )}
        </TwoSidedLayout>
    );
}
