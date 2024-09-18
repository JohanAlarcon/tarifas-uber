import React, { useState, useRef, useEffect } from "react";
import {GoogleMap,LoadScript,Marker,useJsApiLoader,
} from "@react-google-maps/api";
import {Box,Typography,IconButton,CircularProgress,Select,MenuItem,FormHelperText,Grid,Stack,
} from "@mui/material";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import Divider from "@mui/material/Divider";
import SearchIcon from "@mui/icons-material/Search";
import PlaceIcon from "@mui/icons-material/Place";
import SendIcon from "@mui/icons-material/Send";
import LoadingButton from "@mui/lab/LoadingButton";
import PriceComponent from "./section-price-component";
import Avatar from "@mui/material/Avatar";
import Footer from "./footer-component";
import Holidays from 'date-holidays';
import WhatsAppRequest from "./whatsApp-component";

const containerStyle = {
  width: "100%",
  height: "500px",
};

const center = {
  lat: 4.4447, // Latitud de Ibagué
  lng: -75.2427, // Longitud de Ibagué
};

interface Service {
  id: number;
  name: string;
}

function MapComponent() {
  const [origin, setOrigin] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [destination, setDestination] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [distance, setDistance] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [price, setPrice] = useState<string | null>(null);
  const [valueService, setValueService] = useState<number>(2);
  const [loading, setLoading] = useState<boolean>(false);
  const [services, setServices] = useState<Service[]>([]);
  const originInputRef = useRef<HTMLInputElement>(null);
  const destinationInputRef = useRef<HTMLInputElement>(null);
  const [originAddress, setOriginAddress] = useState("");
  const [destinationAddress, setDestinationAddress] = useState("");
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    libraries: ["places"],
  });

  const setNameUbication = (
    lat: number,
    lng: number,
    type: "origin" | "destination"
  ) => {
    const origin = new google.maps.LatLng(lat, lng);
    const geocoder = new google.maps.Geocoder();

    geocoder.geocode({ location: origin }, (results, status) => {
      if (status === "OK") {
        if (results && results[0]) {
          if (type === "origin") {
            setOriginAddress(results[0].formatted_address);
            setOrigin({ lat, lng });
          } else {
            setDestinationAddress(results[0].formatted_address);
            setDestination({ lat, lng });
          }
        }
      }
    });
  };

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    const latLng = e.latLng;
    if (latLng) {
      if (!originAddress) {
        setNameUbication(latLng.lat(), latLng.lng(), "origin");
      } else {
        setNameUbication(latLng.lat(), latLng.lng(), "destination");
      }
    }
  };

  const handleUseCurrentLocation = (type: "origin" | "destination") => () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setNameUbication(latitude, longitude, type);
        },
        (error) => {
          console.error("Error obteniendo la ubicación: ", error);
        }
      );
    } else {
      console.error("Geolocalización no está soportada por este navegador.");
    }
  };

  const getValueService = async () => {
    const response = await fetch(`/api/tariff?service_type_id=${valueService}`);
    const data = await response.json();
    return data;
  };

  const isHoliday = (date: Date): boolean => {
    const hd = new Holidays('CO'); 
    const holiday = hd.isHoliday(date); 
    return Boolean(holiday); 
  };

  useEffect(() => {
    const fetchClients = async () => {
      const response = await fetch("/api/services");
      const data = await response.json();
      setServices(data);
    };

    fetchClients();
  }, []);

  useEffect(() => {
    if (originInputRef.current && destinationInputRef.current) {
      const ibagueBounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(4.3928, -75.2712), // Esquina suroeste de Ibagué
        new google.maps.LatLng(4.4969, -75.178) // Esquina noreste de Ibagué
      );

      const options = {
        bounds: ibagueBounds,
        componentRestrictions: { country: "CO" },
        fields: [
          "address_components",
          "geometry",
          "icon",
          "name",
          "place_id",
          "formatted_address",
        ],
        origin: center,
        strictBounds: false,
        types: ["establishment"],
      };

      const originAutocomplete = new google.maps.places.Autocomplete(
        originInputRef.current,
        options
      );
      const destinationAutocomplete = new google.maps.places.Autocomplete(
        destinationInputRef.current,
        options
      );

      originAutocomplete.addListener("place_changed", () => {
        const place = originAutocomplete.getPlace();
        if (place.geometry && place.geometry.location) {
          setOrigin({
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          });
        }
        setOriginAddress(place.formatted_address || "");
      });

      destinationAutocomplete.addListener("place_changed", () => {
        const place = destinationAutocomplete.getPlace();
        if (place.geometry && place.geometry.location) {
          setDestination({
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          });
        }
        setDestinationAddress(place.formatted_address || "");
      });
    }
  }, [isLoaded]);

  if (!isLoaded) {
    return <CircularProgress color="error" />;
  }

  const calculateValue = () => {
    setLoading(true);
    if (origin && destination) {
      const service = new google.maps.DistanceMatrixService();
      service.getDistanceMatrix(
        {
          origins: [origin],
          destinations: [destination],
          travelMode: google.maps.TravelMode.DRIVING,
        },
        async (response, status) => {
          if (status === "OK" && response) {
            const distanceText = response.rows[0].elements[0].distance.text;
            const timeText = response.rows[0].elements[0].duration.text;
            const data = await getValueService();
            const base_rate = data[0].base_rate;
            const base_km = data[0].base_km;
            const per_km_rate = data[0].per_km_rate;
            const per_min_rate = data[0].per_min_rate;
            const night_surcharge = data[0].night_surcharge;
            const festive_surcharge = data[0].festive_surcharge;

            let price = base_rate;
            const distance = parseFloat(distanceText.split(" ")[0]);
            const time = parseFloat(timeText.split(" ")[0]);
            if (distance > base_km) {
              price = Number(price) + Number((distance - base_km) * per_km_rate);
              //price += time * per_min_rate;
            }

            if (new Date().getHours() >= 20 || new Date().getHours() <= 6) {
              price += night_surcharge;
            }

            if (isHoliday(new Date())) {
              price += festive_surcharge;
            }

            const formatPrice = new Intl.NumberFormat("es-CO", {
              style: "currency",
              currency: "COP",
            }).format(price);

            setDistance(`La distancia es de ${distanceText}`);
            setTime(`El tiempo estimado es de ${timeText}`);
            setPrice(`El precio estimado es de ${formatPrice}`);
            setLoading(false);
          }
        }
      );
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="stretch"
      width={{ sm: "100%", md: "100%", lg: "80%" }}
      m={{ sm: 2, md: 4, lg: 6 }}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        mb={3}
        alignItems="center"
        justifyContent="center"
      >
        <Avatar
          alt="Rapimoto"
          src="/logo-rapimoto.png"
          sx={{ width: 90, height: 90, mb: { xs: 2, sm: 0 } }}
        />
        <Typography
          variant="overline"
          textAlign={{ xs: "center", sm: "left" }}
          fontSize="0.9rem"
        >
          Calcula la distancia entre dos ubicaciones en Ibagué con{" "}
          <strong>Rapimoto</strong>. Elige entre barrios, conjuntos y
          direcciones precisas.
        </Typography>
      </Stack>

      <Grid container spacing={1} justifyContent="center">
        <Grid item xs={12} sm={12}>
          <Select
            id="tipo"
            label="tipo"
            name="tipo"
            variant="outlined"
            value={valueService}
            onChange={(e) => setValueService(e.target.value as number)}
            color="warning"
            fullWidth
          >
            <MenuItem value={0} disabled>
              Seleccione un servicio
            </MenuItem>
            {services.map((service) => (
              <MenuItem key={service.id} value={service.id}>
                {service.name}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>Seleccione un servicio</FormHelperText>
        </Grid>

        <Grid item xs={12} sm={12}>
          <Paper sx={{ p: "9px 4px", display: "flex", alignItems: "center" }}>
            <IconButton sx={{ p: "10px" }} aria-label="menu">
              <PlaceIcon />
            </IconButton>
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="Escriba la dirección de origen"
              inputProps={{ "aria-label": "Escriba la dirección de origen" }}
              onChange={(e) => setOriginAddress(e.target.value)}
              value={originAddress}
              inputRef={originInputRef}
            />
            <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
              <SearchIcon />
            </IconButton>
            <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
            <IconButton
              color="primary"
              onClick={handleUseCurrentLocation("origin")}
            >
              <MyLocationIcon />
            </IconButton>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={12}>
          <Paper sx={{ p: "9px 4px", display: "flex", alignItems: "center" }}>
            <IconButton sx={{ p: "10px" }} aria-label="menu">
              <PlaceIcon />
            </IconButton>
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="Escriba la dirección de destino"
              inputProps={{ "aria-label": "Escriba la dirección de destino" }}
              onChange={(e) => setDestinationAddress(e.target.value)}
              value={destinationAddress}
              inputRef={destinationInputRef}
            />
            <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
              <SearchIcon />
            </IconButton>
            <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
            <IconButton
              color="primary"
              onClick={handleUseCurrentLocation("destination")}
            >
              <MyLocationIcon />
            </IconButton>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <LoadingButton
            disabled={loading}
            loading={loading}
            variant="contained"
            color="error"
            onClick={calculateValue}
            fullWidth
            endIcon={<SendIcon />}
          >
            Cotizar viaje
          </LoadingButton>
        </Grid>
      </Grid>
      {distance && (
        <>
          <PriceComponent price={price as string} distance={distance as string} time={time as string}/>
          <WhatsAppRequest distance={distance as string} time={time as string} price={price as string} origin={originAddress} destination={destinationAddress} valueService={valueService}/>
        </>
      )}

      {window.google === undefined ? (
        <LoadScript
          googleMapsApiKey={
            process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string
          }
        >
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={12}
            onClick={(e) => handleMapClick(e)}
          >
            {origin && <Marker position={origin} label="A" />}
            {destination && <Marker position={destination} label="B" />}
          </GoogleMap>
        </LoadScript>
      ) : (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={12}
          onClick={(e) => handleMapClick(e)}
        >
          {origin && <Marker position={origin} label="A" />}
          {destination && <Marker position={destination} label="B" />}
        </GoogleMap>
      )}
      <Footer />
    </Box>
  );
}

export default MapComponent;
