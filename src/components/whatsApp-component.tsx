import { Button, Typography, Box, Paper } from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp'; 
import { useState, useEffect } from "react";

interface WhatsAppRequestProps {
    distance: string;
    time: string;
    price: string;
    origin: string;
    destination: string;
    valueService: number;
}

function WhatsAppRequest ({ distance, time, price, origin, destination, valueService }: WhatsAppRequestProps) {
  
    const [whatsappGroupLink, setWhatsappGroupLink] = useState('');

    useEffect(() => {
        const fetchGroups = async () => {
            const response = await fetch("/api/groups");
            const data = await response.json();
            const randomGroup = data[Math.floor(Math.random() * data.length)];
            setWhatsappGroupLink(randomGroup.link);
            console.log('new link', randomGroup.link);
          };
        fetchGroups();
    }, [time]);

    const generateWhatsAppMessage = () => {

        const message = `🛵 *Solicitud de ${valueService === 1 ? 'Domicilio' : 'Transporte'}* 🛵
        
        Hola, quiero solicitar un servicio. Aquí están los detalles del viaje:

        📍 *Origen*: ${origin}
        📍 *Destino*: ${destination}
        📏 *Distancia*: ${distance}
        ⏳ *Tiempo estimado*: ${time}
        💵 *Precio*: ${price}

        Por favor, indíquenme el conductor más cercano disponible.`;

        return encodeURIComponent(message);

    };

    const handleRequest = () => {
        /* const whatsappUrl = `https://wa.me/?text=${generateWhatsAppMessage()}`;
        window.open(whatsappGroupLink, '_blank');
        window.location.href = whatsappUrl;  */
        const phone = '573106972580';
        const message = generateWhatsAppMessage();
        window.open(`https://api.whatsapp.com/send?phone=${phone}&text=${message}`, '_blank');

    };

  return (
    <Paper sx={{ padding: 3, mt: 2, backgroundColor: '#f1fff8', borderTopLeftRadius: 9, borderTopRightRadius: 9 }}>
      <Typography variant="h6" textAlign="center"  fontWeight="bold" color="#00796b">
        ¿Deseas solicitar este servicio?
      </Typography>
      <Typography variant="body1" textAlign="center" mb={3}>
        Haz clic en el botón para solicitar un conductor en nuestro grupo de WhatsApp.
      </Typography>
      
      <Box textAlign="center">
        <Button
          variant="contained"
          color="success"
          startIcon={<WhatsAppIcon />}
          onClick={handleRequest}
          sx={{ fontSize: '1.2rem', padding: '10px 20px' }}
        >
          Solicitar servicio por WhatsApp
        </Button>
      </Box>
    </Paper>
  );
};

export default WhatsAppRequest;
