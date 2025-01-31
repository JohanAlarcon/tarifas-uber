import { Facebook, Instagram } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import Link from "next/link";
import { FaTiktok } from 'react-icons/fa';

const redes = [
  {
    name: "Facebook",
    icon: Facebook,
    url: "https://www.facebook.com/share/19nHFwTgmj/?mibextid=wwXIfr",
    style: { fontSize: 30, color: "#4267B2" },
  },
  {
    name: "Instagram",
    icon: Instagram,
    url: "https://www.instagram.com/serviciosdomiciliariosibague?igsh=MXV3MjdxNzJrd2lneA==",
    style: { fontSize: 30, color: "#C13584" },
  },
  {
    name: "Tiktok",
    icon: FaTiktok,
    url: "",
    style: { fontSize: 26, color: '#000' },
  },
];

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
        ¡Bienvenidos a <span style={{ color: "#ff5722" }}>Servicios domiciliarios</span>! Tu
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

        {redes.map((red, index) => 
          red.url !== "" && (
            <Link key={index} href={red.url} target="_blank" color="inherit">
              {red.icon === FaTiktok ? <red.icon style={red.style} /> :
              <red.icon sx={red.style} />
              }
            </Link>
          )
        )}

      </Box>
    </Box>
  );
}

export default Footer;
