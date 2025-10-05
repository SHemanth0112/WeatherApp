export interface Weather {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface Main {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
}

export interface Sys {
  country: string;
  sunrise: number;
  sunset: number;
}

export interface CurrentWeather {
  id: number;
  name: string;
  weather: Weather[];
  main: Main;
  sys: Sys;
  dt: number;
}

export interface ForecastItem {
  dt: number;
  main: Main;
  weather: Weather[];
  dt_txt: string;
}

export interface ForecastResponse {
  list: ForecastItem[];
  city: {
    name: string;
    country: string;
  };
}

export interface DailyForecast {
  date: string;
  day: string;
  temp_min: number;
  temp_max: number;
  weather: Weather;
  humidity: number;
}

export interface WeatherState {
  loading: boolean;
  error: string | null;
  currentWeather: CurrentWeather | null;
  forecast: DailyForecast[] | null;
  lastSearchedCity: string | null;
}
