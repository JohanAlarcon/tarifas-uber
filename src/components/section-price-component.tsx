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
        sx={{ padding: 3, 
            borderTopLeftRadius: 9,
            borderTopRightRadius: 9,
            backgroundColor: "#f5f5f5", 
            mt: 4 }}
      >
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} sm={4} textAlign="center">
            <TwoWheelerIcon sx={{ fontSize: 40, color: "#1976d2" }} />
            <Typography variant="h6" mt={1} fontWeight="bold" color="#1976d2">
              {distance}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              Distancia
            </Typography>
          </Grid>
  
          <Grid item xs={12} sm={4} textAlign="center">
            <AccessTimeIcon sx={{ fontSize: 40, color: "#4caf50" }} />
            <Typography variant="h6" mt={1} fontWeight="bold" color="#4caf50">
              {time}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              Tiempo estimado
            </Typography>
          </Grid>
  
          <Grid item xs={12} sm={4} textAlign="center">
            <MonetizationOnIcon sx={{ fontSize: 40, color: "#fe3c3c" }} />
            <Typography variant="h6" mt={1} fontWeight="bold" color="#fe3c3c">
              {price}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              Precio estimado
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    );
  }
  
  export default PriceComponent;
  