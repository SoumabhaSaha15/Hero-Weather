import React from "react";
import { addToast } from "@heroui/react";
import Search from "./components/Search";
import Weather from "./components/Weather";
import AxiosBase from "./utility/AxiosBase";
import Forecast from "./components/Forecast";
import GetLocation from "./utility/GetLocationAccess";
import WeatherDetails from "./components/WeatherDetails";
import { useDataStore } from "./context/DataStoreContext";
import { weatherResponseSchema } from "./validators/weather";
import { forecastResponseSchema } from "./validators/forecast";
import { coordQuerySchema, placeQuerySchema } from "./validators/query";

const App: React.FC = () => {
  const dataConsumer = useDataStore();
  const setDefaultLocation = () => GetLocation(async ({ coords: { longitude, latitude } }) => {
    try {
      const paramsString = (new URLSearchParams(coordQuerySchema.parse({ lon: longitude, lat: latitude }))).toString();
      const weatherResponse = await AxiosBase.get(import.meta.env.VITE_OW_WEATHER + `?${paramsString}`);
      const forecastResponse = await AxiosBase.get(import.meta.env.VITE_OW_FORECAST + `?${paramsString}`);
      dataConsumer.setWeather(weatherResponseSchema.parse(weatherResponse.data));
      dataConsumer.setForecast(forecastResponseSchema.parse(forecastResponse.data));
    } catch (error) {
      console.error(error);
    }
  }, async (e) => {
    addToast({ title: e.message, color: "warning" });
    try {
      const paramsString = (new URLSearchParams(placeQuerySchema.parse({ q: "Kolkata" }))).toString();
      const weatherResponse = await AxiosBase.get(import.meta.env.VITE_OW_WEATHER + `?${paramsString}`);
      const forecastResponse = await AxiosBase.get(import.meta.env.VITE_OW_FORECAST + `?${paramsString}`);
      dataConsumer.setWeather(weatherResponseSchema.parse(weatherResponse.data));
      dataConsumer.setForecast(forecastResponseSchema.parse(forecastResponse.data));
    } catch (error) {
      console.error(error);
    }
  });

  React.useEffect(()=>{setDefaultLocation();},[]);
  React.useEffect(() => {
    if (dataConsumer.weather !== null) {
      const hour = new Date((dataConsumer.weather.dt) * 1000).getHours();
      document.documentElement.style.backgroundImage = (hour >= 18 || hour <= 5) ? `url('./evening.jpeg')` : `url('./morning.jpeg')`;
    }
  }, [dataConsumer.weather]);

  return (
    <div className="h-screen max-h-screen w-full grid grid-cols-1 md:grid-cols-2 md:gap-2">

      <div className="p-2 h-screen max-h-screen overflow-y-auto relative" id="Weather">
        <Search setDefaultLocation={setDefaultLocation} />
        <Weather />
        <WeatherDetails />
      </div>

      <div id="Forecast" className="relative p-2 h-screen max-h-screen overflow-y-auto">
        <Forecast />
      </div>

    </div>
  );
}

export default App;
