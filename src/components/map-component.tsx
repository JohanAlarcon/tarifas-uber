import React, { useState, useEffect } from "react";
import {
  Autocomplete,
  DirectionsRenderer,
  GoogleMap,
  LoadScript,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";
import {
  Box,
  Typography,
  IconButton,
  CircularProgress,
  Select,
  MenuItem,
  FormHelperText,
  Grid,
  Stack,
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
import Holidays from "date-holidays";
import WhatsAppRequest from "./whatsApp-component";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";

const schema = yup.object().shape({
  origin: yup.string().required("El origen es requerido"),
  destination: yup.string().required("El destino es requerido"),
});

const containerStyle = {
  width: "100%",
  height: "500px",
};

const center = {
  lat: 4.4447, // Latitud de Ibagué
  lng: -75.2427, // Longitud de Ibagué
};

const bounds = {
  north: 5.1238, // Norte del Tolima
  south: 3.1671, // Sur del Tolima
  west: -75.9981, // Oeste del Tolima
  east: -74.5842, // Este del Tolima
};

const restrictions = {
  country: "CO",
};

const options = {
  //types: ['address','establishment','geocode'], // Establecer el tipo de ubicación
  bounds: bounds, // Establecer los límites geográficos
  strictBounds: true, // Limita estrictamente a los bounds proporcionados
};

interface Service {
  id: number;
  name: string;
}

interface MapComponentProps {
  origin: string;
  destination: string;
}

function MapComponent() {
  const [originLocation, setOriginLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [destinationLocation, setDestinationLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const [distance, setDistance] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [price, setPrice] = useState<string | null>(null);
  const [valueService, setValueService] = useState<number>(2);
  const [loading, setLoading] = useState<boolean>(false);
  const [services, setServices] = useState<Service[]>([]);
  const [directionsResponse, setDirectionsResponse] =
    useState<google.maps.DirectionsResult | null>(null);
  const [searchResultOrigin, setSearchResultOrigin] =
    useState<google.maps.places.Autocomplete | null>(null);
  const [searchResultDestination, setSearchResultDestination] =
    useState<google.maps.places.Autocomplete | null>(null);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    libraries: ["places"],
  });

  const {
    register,
    setValue,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm<MapComponentProps>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const onSubmit = (data: MapComponentProps) => {};

  const setNameUbication = (
    lat: number,
    lng: number,
    type: "origin" | "destination"
  ) => {
    const origin = new google.maps.LatLng(lat, lng);
    const geocoder = new google.maps.Geocoder();

    geocoder.geocode({ location: origin }, (results, status) => {
      if (status === "OK" && results) {
        const relevantResult = results.find(
          (result) =>
            result.types.includes("street_address") ||
            result.types.includes("route") ||
            result.types.includes("locality")
        );

        if (relevantResult) {
          const formattedAddress = relevantResult.formatted_address;
          if (type === "origin") {
            setValue("origin", formattedAddress);
            setOriginLocation({ lat, lng });
          } else {
            setValue("destination", formattedAddress);
            setDestinationLocation({ lat, lng });
          }
        } else {
          console.error("No se encontró una dirección clara.");
        }
      } else {
        console.error("Geocode falló: " + status);
      }
    });
  };

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    const latLng = e.latLng;
    if (latLng) {
      const originAddress = getValues("origin");
      if (!originAddress) {
        setNameUbication(latLng.lat(), latLng.lng(), "origin");
      } else {
        setNameUbication(latLng.lat(), latLng.lng(), "destination");
      }
    }
  };

  const handleUseCurrentLocation = (type: "origin" | "destination") => () => {
    if (navigator.geolocation && isLoaded) {
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
    /*const response = await fetch(`/api/tariff?service_type_id=${valueService}`);
    const data = await response.json();*/

    let data = []; 

    if (valueService == 1) {
      data = [
        {
          base_rate: 5000,
          base_km: 5,
          per_km_rate: 1100,
          per_min_rate: 0,
          night_surcharge: 1000,
          festive_surcharge: 1000,
        },
      ];
    } else {
      data = [
        {
          base_rate: 4000,
          base_km: 4,
          per_km_rate: 900,
          per_min_rate: 100,
          night_surcharge: 1000,
          festive_surcharge: 1000,
        },
      ];
    }
    return data;
  };

  const isHoliday = (date: Date): boolean => {
    const hd = new Holidays("CO");
    const holiday = hd.isHoliday(date);
    return Boolean(holiday);
  };

  useEffect(() => {
    const fetchServices = async () => {
      /*const response = await fetch("/api/services");
      const data = await response.json();*/
      const data = [
        { id: 1, name: "Servicio de domicilio" },
        { id: 2, name: "Servicio de transporte" },
      ];
      setServices(data);
    };

    fetchServices();
  }, []);

 /*  useEffect(() => {
    handleUseCurrentLocation("origin")();
  }, [isLoaded]); */

  const onLoadOrigin = (autocomplete: google.maps.places.Autocomplete) => {
    setSearchResultOrigin(autocomplete);
  };

  const onLoadDestination = (autocomplete: google.maps.places.Autocomplete) => {
    setSearchResultDestination(autocomplete);
  };

  const locationSelected = (type: "origin" | "destination") => () => {
    if (type === "origin") {
      const place = searchResultOrigin?.getPlace();
      if (place?.geometry) {
        if (place.geometry.location) {
          setOriginLocation({
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          });
        }
      }
    } else {
      const place = searchResultDestination?.getPlace();
      if (place?.geometry) {
        if (place.geometry.location) {
          setDestinationLocation({
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          });
        }
      }
    }
  };

  const calculateValue = () => {
    if (originLocation && destinationLocation) {
      setLoading(true);
      const service = new google.maps.DistanceMatrixService();
      const directionsService = new google.maps.DirectionsService();

      directionsService.route(
        {
          origin: originLocation,
          destination: destinationLocation,
          travelMode: google.maps.TravelMode.WALKING,
          drivingOptions: {
            departureTime: new Date(),
            trafficModel: google.maps.TrafficModel.BEST_GUESS,
          },
          optimizeWaypoints: true,
        },
        (response, status) => {
          if (status === "OK") {
            setDirectionsResponse(response);
          } else {
            console.error(`Error al obtener la ruta: ${status}`);
          }
        }
      );

      service.getDistanceMatrix(
        {
          origins: [originLocation],
          destinations: [destinationLocation],
          travelMode: google.maps.TravelMode.WALKING,
        },
        async (walkingResponse, walkingStatus) => {
          if (walkingStatus === "OK" && walkingResponse) {
            const walkingDistanceText =
              walkingResponse.rows[0].elements[0].distance.text;

            // Obtener la duración en modo DRIVING
            service.getDistanceMatrix(
              {
                origins: [originLocation],
                destinations: [destinationLocation],
                travelMode: google.maps.TravelMode.DRIVING,
              },
              async (drivingResponse, drivingStatus) => {
                if (drivingStatus === "OK" && drivingResponse) {
                  const drivingTimeText = drivingResponse.rows[0].elements[0].duration.text;
                  //get time in minutes
                  const drivingTime = drivingResponse.rows[0].elements[0].duration.value / 60;

                  // Aquí puedes realizar los cálculos de precio
                  const distance = parseFloat(walkingDistanceText.split(" ")[0]);

                  const data = await getValueService();
                  const base_rate = data[0].base_rate;
                  const base_km = data[0].base_km;
                  const per_km_rate = data[0].per_km_rate;
                  const per_min_rate = data[0].per_min_rate;
                  const night_surcharge = data[0].night_surcharge;
                  const festive_surcharge = data[0].festive_surcharge;

                  let price = base_rate;
                  if (distance > base_km) {
                    price = Number(price) + Number((distance - base_km) * per_km_rate);
                    price += drivingTime * per_min_rate;
                  }

                  if (new Date().getHours() >= 20 || new Date().getHours() <= 5) {
                    price += night_surcharge;
                  }

                  if (isHoliday(new Date())) {
                    price += festive_surcharge;
                  }

                  const formatPrice = new Intl.NumberFormat("es-CO", {
                    style: "currency",
                    currency: "COP",
                  }).format(price);

                  // Actualizar el estado con la distancia y el tiempo
                  setDistance(`La distancia es de ${walkingDistanceText}`);
                  setTime(`El tiempo estimado es de ${drivingTimeText}`);
                  setPrice(`El precio estimado es de ${formatPrice}`);
                  setLoading(false);
                }
              }
            );
          }
        }
      );
    }
  };

  if (!isLoaded) {
    return <CircularProgress color="error" />;
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="stretch"
      width={{ sm: "100%", md: "100%", lg: "80%" }}
      m={{ sm: 2, md: 4, lg: 6 }}
      component="form"
      onSubmit={handleSubmit(onSubmit)}
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
          /* src="/logo-rapimoto.png" */
          src="https://siandsi2.org/application/logo-rapimoto.png"
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
          <Autocomplete
            onLoad={onLoadOrigin}
            onPlaceChanged={locationSelected("origin")}
            bounds={bounds}
            options={options}
            restrictions={restrictions}
          >
            <Paper sx={{ p: "9px 4px", display: "flex", alignItems: "center" }}>
              <IconButton sx={{ p: "10px" }} aria-label="menu" onClick={handleUseCurrentLocation("origin")} >
                <PlaceIcon />
              </IconButton>
              <InputBase
                id="origin"
                sx={{ ml: 1, flex: 1 }}
                placeholder="Escriba la dirección de origen"
                inputProps={{ "aria-label": "Escriba la dirección de origen" }}
                error={!!errors.origin}
                {...register("origin")}
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
          </Autocomplete>
        </Grid>

        <Grid item xs={12} sm={12}>
          <Autocomplete
            onLoad={onLoadDestination}
            onPlaceChanged={locationSelected("destination")}
            bounds={bounds}
            options={options}
            restrictions={restrictions}
          >
            <Paper sx={{ p: "9px 4px", display: "flex", alignItems: "center" }}>
              <IconButton sx={{ p: "10px" }} aria-label="menu" onClick={handleUseCurrentLocation("destination")} >
                <PlaceIcon />
              </IconButton>
              <InputBase
                id="destination"
                sx={{ ml: 1, flex: 1 }}
                placeholder="Escriba la dirección de destino"
                inputProps={{ "aria-label": "Escriba la dirección de destino" }}
                error={!!errors.destination}
                {...register("destination")}
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
          </Autocomplete>
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
          <PriceComponent
            price={price as string}
            distance={distance as string}
            time={time as string}
          />
          <WhatsAppRequest
            distance={distance as string}
            time={time as string}
            price={price as string}
            origin={getValues("origin")}
            destination={getValues("destination")}
            valueService={valueService}
          />
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
            {originLocation && <Marker position={originLocation} label="A" />}
            {destinationLocation && (
              <Marker position={destinationLocation} label="B" />
            )}
            {directionsResponse && (
              <DirectionsRenderer
                directions={directionsResponse}
                options={{
                  polylineOptions: {
                    strokeColor: "#ff5722",
                  },
                }}
              />
            )}
          </GoogleMap>
        </LoadScript>
      ) : (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={12}
          onClick={(e) => handleMapClick(e)}
        >
          {originLocation && <Marker position={originLocation} label="A" />}
          {destinationLocation && (
            <Marker position={destinationLocation} label="B" />
          )}
          {directionsResponse && (
            <DirectionsRenderer
              directions={directionsResponse}
              options={{
                polylineOptions: {
                  strokeColor: "#ff5722",
                },
              }}
            />
          )}
        </GoogleMap>
      )}
      <Footer />
    </Box>
  );
}

export default MapComponent;