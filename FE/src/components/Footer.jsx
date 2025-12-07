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
    // <Box
    //     component="footer"
    //     sx={{
    //         backgroundColor: "rgba(0,115,187,0.70)",
    //         color: "#fff",
    //         py: 1,
    //         mt: 2,
    //     }}
    // >
    <Box
      sx={{
        mt: 4,
        overflow: "hidden",
        boxShadow: "0 12px 40px rgba(0,0,0,0.45)",
        background:
          "linear-gradient(90deg,#071428 0%, #1b2b3b 60%, #29121a 100%)",
        color: "white",
        p: { xs: 2, md: 2 },

        // custom corner radii (top-left, top-right, bottom-right, bottom-left)
        borderRadius: "80px 80px 0px 0px",
      }}
    >
      <Container size="xl">
        <Grid container spacing={2} maxWidth="xl">
          <Grid size={{ xs: 12, md: 8 }}>
            <Box sx={{ mb: 1 }}>
              <Typography
                fontSize="1.2rem"
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
                Μάριος Χαρίδης – Διπλωματική εργασία, ΠΜΣ «Πληροφορική»,
                Πανεπιστήμιο Πειραιώς.
                <br />
                Πρότυπη εφαρμογή ηλεκτρονικού φαρμακείου με δυνατότητες
                εγγραφής, περιήγησης προϊόντων και διαχείρισης παραγγελιών.
              </Typography>
            </Box>
          </Grid>
          <Grid size={4}>
            <Grid container spacing={2} alignItems="center" mb={1}>
              <Grid item xs={12} md={4}>
                <Typography
                  fontSize="1.2rem"
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
                      <Facebook fontSize="large" />
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
                      <Instagram fontSize="large" />
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
                      <LinkedIn fontSize="large" />
                    </IconButton>
                    <IconButton
                      size="small"
                      component={Link}
                      href="https://github.com/mariosch93"
                      target="_blank"
                      sx={{
                        color: "white",
                        p: 0.5,
                        "&:hover": { color: "#faff18" },
                      }}
                    >
                      <GitHubIcon fontSize="large" />
                    </IconButton>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid size={{ xs: 12, md: 12 }}>
          <Typography
            fontSize="1.2rem"
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
            Where to find us
          </Typography>
          {/* Put this where your map should appear */}
          <Box
            sx={{
              position: "relative",
              width: "100%",
              height: "30%",
              paddingTop: { xs: "75%", sm: "56.25%", md: "20%" }, // 16:9 aspect ratio
              borderRadius: 2,
              overflow: "hidden",
              boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.03)",
            }}
          >
            <iframe
              title="University of Piraeus map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3146.521770723339!2d23.650404375097697!3d37.94160127194384!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14a1bbe5bb8515a1%3A0x3e0dce8e58812705!2sUniversity%20of%20Piraeus!5e0!3m2!1sen!2sgr!4v1765120344319!5m2!1sen!2sgr"
              style={{
                border: 0,
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
              }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />
          </Box>
        </Grid>
        <Box textAlign="center" mt={2}>
          <Typography variant="body2">
            © Goodpills {new Date().getFullYear()}. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
