import Button from "@mui/joy/Button";
import Link from "@mui/joy/Link";
import Typography from "@mui/joy/Typography";
import ArrowForward from "@mui/icons-material/ArrowForward";
import TwoSidedLayout from "./TwoSidedLayout.jsx";

export default function HeroLeft01() {

    const token = typeof window !== "undefined"
    ? localStorage.getItem("jwt_token")
    : null;

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
                textColor="text.secondary"
                sx={{ fontSize: "lg", lineHeight: "lg" }}
            >
                Discover premium health products, vitamins, and skincare at unbeatable prices. Enjoy fast shipping and expert advice from our dedicated team.
            </Typography>

            {!token && (
            <Typography>
                Already a member? <Link sx={{ fontWeight: "xl" }}>Sign in</Link>
            </Typography>)}

        </TwoSidedLayout>
    );
}
