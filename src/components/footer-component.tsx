import { Facebook, Instagram, Twitter } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import Link from "next/link";

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#f5f5f5",
        padding: "20px 0",
        borderBottomLeftRadius: 9,
        borderBottomRightRadius: 9,
      }}
      textAlign="center"
    >
      <Typography
        variant="caption"
        fontWeight="bold"
        sx={{
          letterSpacing: 2,
          color: "#333",
          fontSize: "0.9rem",
        }}
      >
        ¡Bienvenidos a <span style={{ color: "#ff5722" }}>Rapimoto</span>! Tu
        solución de transporte rápido y seguro en Ibagué.
      </Typography>
      <Box
        sx={{
          mt: 2,
          display: "flex",
          justifyContent: "center",
          gap: 2,
        }}
      >
        <Link
          href="https://www.facebook.com/profile.php?id=100094530770455"
          target="_blank"
          color="inherit"
        >
          <Facebook sx={{ fontSize: 30, color: "#4267B2" }} />
        </Link>
        <Link
          href="https://www.instagram.com/rapimoto3"
          target="_blank"
          color="inherit"
        >
          <Instagram sx={{ fontSize: 30, color: "#C13584" }} />
        </Link>
        <Link
          href="https://www.twitter.com/rapimoto"
          target="_blank"
          color="inherit"
        >
          <Twitter sx={{ fontSize: 30, color: "#1DA1F2" }} />
        </Link>
      </Box>
    </Box>
  );
}

export default Footer;
