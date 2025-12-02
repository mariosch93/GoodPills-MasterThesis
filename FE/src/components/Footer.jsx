import {
    Box,
    Container,
    Typography,
    Link,
    IconButton,
    Grid,
} from "@mui/material";
import { Facebook, Instagram, LinkedIn } from "@mui/icons-material";
import GitHubIcon from "@mui/icons-material/GitHub";

export default function SimpleBottomNavigation() {
    return (
        <Box
            component="footer"
            sx={{
                backgroundColor: "rgba(0,115,187,0.70)",
                color: "#fff",
                py: 1,
                mt: 2,
            }}
        >
            <Container size="xl">
                <Grid container spacing={2} maxWidth="xl">
                    <Grid size={{ xs: 12, md: 8 }}>
                        <Box sx={{ mb: 1 }}>
                            <Typography
                                variant="h6"
                                gutterBottom
                                sx={{
                                    fontWeight: "bold",
                                    background:
                                        "linear-gradient(90deg, #F58529, #DD2A7B, #833AB4, #1877F2, #0A66C2, #000000, #434343)",
                                    WebkitBackgroundClip: "text",
                                    backgroundClip: "text",
                                    color: "transparent",
                                    mb: 2,
                                }}
                            >
                                About Me
                            </Typography>
                            <Typography variant="body2">
                                © 2025 Μάριος Χαρίδης – Διπλωματική εργασία, ΠΜΣ «Πληροφορική», Πανεπιστήμιο Πειραιώς.
                                <br />
                                Η εφαρμογή αποτελεί πρότυπο ηλεκτρονικού φαρμακείου, όπου οι χρήστες μπορούν να εγγράφονται,
                                να περιηγούνται σε φαρμακευτικά προϊόντα και να υποβάλλουν παραγγελίες, ενώ ο διαχειριστής
                                έχει πλήρη δυνατότητα διαχείρισης του καταλόγου προϊόντων και των σχετικών συναλλαγών.
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid size={4}>
                        {/* Marios row */}
                        <Grid container spacing={2} alignItems="center" mb={1}>
                            <Grid item xs={12} md={4}>
                                <Typography
                                    variant="h6"
                                    gutterBottom
                                    sx={{
                                        fontWeight: "bold",
                                        background:
                                            "linear-gradient(90deg, #F58529, #DD2A7B, #833AB4, #1877F2, #0A66C2, #000000, #434343)",
                                        WebkitBackgroundClip: "text",
                                        backgroundClip: "text",
                                        color: "transparent",
                                        mb: 2,
                                    }}
                                >
                                   Lets Connect
                                </Typography>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                    <Typography variant="subtitle1" sx={{ whiteSpace: "nowrap" }}>
                                        {"\u00A0"}
                                        {"\u00A0"}→
                                    </Typography>
                                    <Box sx={{ display: "flex", gap: 0.5 }}>
                                        <IconButton
                                            size="small"
                                            component={Link}
                                            href="https://www.facebook.com/marios.charidis/"
                                            target="_blank"
                                            sx={{
                                                color: "white",
                                                p: 0.5,
                                                "&:hover": { color: "#0A66C2" },
                                            }}
                                        >
                                            <Facebook fontSize="large"/>
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            component={Link}
                                            href="https://instagram.com/marios_charidis"
                                            target="_blank"
                                            sx={{
                                                color: "white",
                                                p: 0.5,
                                                "&:hover": {
                                                    color: "white",
                                                    background:
                                                        "linear-gradient(45deg, #FEDA77, #F58529, #DD2A7B, #8134AF, #515BD4)",
                                                    opacity: 0.9,
                                                },
                                            }}
                                        >
                                            <Instagram fontSize="large"/>
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            component={Link}
                                            href="https://www.linkedin.com/in/marios-charidis/"
                                            target="_blank"
                                            sx={{
                                                color: "white",
                                                p: 0.5,
                                                "&:hover": { color: "#0A66C2" },
                                            }}
                                        >
                                            <LinkedIn fontSize="large"/>
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            component={Link}
                                            href="https://github.com/mariosch93"
                                            target="_blank"
                                            sx={{
                                                color: "white",
                                                p: 0.5,
                                                "&:hover": { color: "#181717" },
                                            }}
                                        >
                                            <GitHubIcon fontSize="large"/>
                                        </IconButton>
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>

                <Box textAlign="center" mt={1} mb={1}>
                    <Typography variant="body2">
                        © Goodpills {new Date().getFullYear()}. All rights reserved.
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
}
