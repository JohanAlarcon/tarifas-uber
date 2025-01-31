import TwoWheelerIcon from '@mui/icons-material/TwoWheeler';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import { Grid, Paper, Typography } from '@mui/material';

interface PriceComponentProps {
  price: String;
  distance: String;
  time: String;
}

function PriceComponent({ price, distance, time }: PriceComponentProps) {
  return (
    <Paper
      sx={{
        padding: 1,
        borderRadius: 2, // Bordes más suaves
        backgroundColor: "#f5f5f5",
        mt: 2, // Menor margen superior
        boxShadow: 1, // Sombra más suave
      }}
    >
      <Grid container spacing={1} justifyContent="center" alignItems="center">
        {/* Distancia */}
        <Grid item xs={4} textAlign="center">
          <TwoWheelerIcon sx={{ fontSize: 24, color: "#1976d2" }} />
          <Typography variant="body1" mt={0.5} fontWeight="medium" color="#1976d2">
            {distance}
          </Typography>
        </Grid>

        {/* Tiempo */}
        <Grid item xs={4} textAlign="center">
          <AccessTimeIcon sx={{ fontSize: 24, color: "#fe3c3c" }} />
          <Typography variant="body1" mt={0.5} fontWeight="medium" color="#fe3c3c">
            {time}
          </Typography>
        </Grid>

        {/* Precio */}
        <Grid item xs={4} textAlign="center">
          <MonetizationOnIcon sx={{ fontSize: 24, color: "#4caf50" }} />
          <Typography variant="body1" mt={0.5} fontWeight="medium" color="#4caf50">
            {price}
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default PriceComponent;