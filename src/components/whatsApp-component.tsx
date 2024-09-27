import React, { useState } from 'react';
import { Button, Typography, Box, Paper, Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CloseIcon from '@mui/icons-material/Close';
import { PiNumberCircleOneFill, PiNumberCircleTwoFill, PiNumberCircleThreeFill } from 'react-icons/pi';

interface WhatsAppRequestProps {
  distance: string;
  time: string;
  price: string;
  origin: string;
  destination: string;
  valueService: number;
}

const groups = [
  'https://chat.whatsapp.com/JqNFHOPttelHtEUGgLs66y'
];

function WhatsAppRequest({ distance, time, price, origin, destination, valueService }: WhatsAppRequestProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [group, setGroup] = useState(groups[Math.floor(Math.random() * groups.length)]);

  const generateWhatsAppMessage = () => {
    return `🛵 *Solicitud de ${valueService === 1 ? 'Domicilio' : 'Transporte'}* 🛵

        Hola, quiero solicitar un servicio. Aquí están los detalles del viaje:

        📍 *Origen*: ${origin}
        📍 *Destino*: ${destination}
        📏 *Distancia*: ${distance}
        ⏳ *Tiempo estimado*: ${time}
        💵 *Precio*: ${price}

        Por favor, indíquenme el conductor más cercano disponible.`;
    };

  const handleModalOpen = () => setOpen(true);
  const handleModalClose = () => setOpen(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateWhatsAppMessage());
    setCopied(true);
    setTimeout(() => setCopied(false), 3000); 
  };

  return (
    <>
      <Paper sx={{ padding: 3, mt: 2, backgroundColor: '#f1fff8', borderTopLeftRadius: 9, borderTopRightRadius: 9 }}>
        <Typography variant="h6" textAlign="center" fontWeight="bold" color="#00796b">
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
            onClick={handleModalOpen}
            sx={{ fontSize: '1.0rem', borderRadius: 9 }}
          >
            Solicitar servicio por WhatsApp
          </Button>
        </Box>
      </Paper>

      <Dialog open={open} onClose={handleModalClose} fullWidth maxWidth="sm">
        <DialogTitle>
          Solicitar Servicio por WhatsApp
          <IconButton
            aria-label="close"
            onClick={handleModalClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Box mb={2}>
            <Typography variant="h6" gutterBottom>
               <PiNumberCircleOneFill style={{ color: '#F0131C', marginRight: 5,fontSize: 33 }} /> Copia el mensaje
            </Typography>
            <Typography variant="body1" mb={2}>
              Copia el siguiente mensaje y pégalo en el grupo de WhatsApp para solicitar el servicio.
            </Typography>
            <Paper
              sx={{
                padding: 2,
                backgroundColor: '#f5f5f5',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                {generateWhatsAppMessage()}
              </Typography>
              <IconButton color="primary" onClick={copyToClipboard}>
                <ContentCopyIcon />
              </IconButton>
            </Paper>
            {copied && <Typography color="success.main" mt={1}>¡Mensaje copiado!</Typography>}
          </Box>

          <Box mb={2}>
            <Typography variant="h6" gutterBottom>
              <PiNumberCircleTwoFill style={{ color: '#F0131C', marginRight: 5,fontSize: 33 }}/> Únete al grupo de WhatsApp
            </Typography>
            <Typography variant="body1" mb={2}>
              Haz clic en el botón para unirte al grupo de WhatsApp y solicitar el servicio.
            </Typography>
            <Button
              variant="contained"
              color="success"
              fullWidth
              href={group}
              target="_blank"
              startIcon={<WhatsAppIcon />}
              sx={{ mb: 2, borderRadius: 9 }}
            >
              Unirme al grupo de WhatsApp
            </Button>
          </Box>

          <Box>
            <Typography variant="h6" gutterBottom>
              <PiNumberCircleThreeFill style={{ color: '#F0131C', marginRight: 5,fontSize: 33 }}/> Pega el mensaje y solicita el servicio
            </Typography>
            <Typography variant="body1">
              Una vez estés en el grupo, pega el mensaje que copiaste anteriormente y envíalo para que tu solicitud sea atendida.
            </Typography>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleModalClose} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default WhatsAppRequest;