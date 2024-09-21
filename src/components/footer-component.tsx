import { Facebook, Instagram } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import Link from "next/link";
import { FaTiktok } from 'react-icons/fa';

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
          href="https://www.instagram.com/rapi.moto3?igsh=a3A2dmVpM29tZDI0"
          target="_blank"
          color="inherit"
        >
          <Instagram sx={{ fontSize: 30, color: "#C13584" }} />
        </Link>
        <Link
          href="https://www.tiktok.com/@rapimoto3?_t=8prZ0R4CC7Z&_r=1"
          target="_blank"
          color="inherit"
        >
          <FaTiktok style={{ fontSize: 27, color: '#000' }} />
        </Link>
      </Box>
    </Box>
  );
}

export default Footer;
