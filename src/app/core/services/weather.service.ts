import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { CurrentWeather, ForecastResponse, DailyForecast, ForecastItem } from '../models/weather.model';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private readonly API_KEY = environment.openWeatherApiKey;
  private readonly BASE_URL = environment.openWeatherApiUrl;
  
  // Simple in-memory cache
  private currentWeatherCache = new Map<string, CurrentWeather>();
  private forecastCache = new Map<string, DailyForecast[]>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  constructor(private http: HttpClient) {}

  getCurrentWeather(city: string): Observable<CurrentWeather> {
    const cacheKey = city.toLowerCase();
    const cached = this.currentWeatherCache.get(cacheKey);
    
    if (cached && this.isCacheValid(cached.dt)) {
      return of(cached);
    }

    const url = `${this.BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${this.API_KEY}&units=metric`;
    
    return this.http.get<CurrentWeather>(url).pipe(
      map(weather => {
        // Add timestamp for cache validation
        const weatherWithTimestamp = { ...weather, dt: Date.now() };
        this.currentWeatherCache.set(cacheKey, weatherWithTimestamp);
        return weatherWithTimestamp;
      }),
      catchError(this.handleError)
    );
  }

  getForecast(city: string): Observable<DailyForecast[]> {
    const cacheKey = city.toLowerCase();
    const cached = this.forecastCache.get(cacheKey);
    
    if (cached && this.isCacheValid(cached[0]?.date)) {
      return of(cached);
    }

    const url = `${this.BASE_URL}/forecast?q=${encodeURIComponent(city)}&appid=${this.API_KEY}&units=metric`;
    
    return this.http.get<ForecastResponse>(url).pipe(
      map(response => {
        const dailyForecasts = this.aggregateForecastData(response);
        this.forecastCache.set(cacheKey, dailyForecasts);
        return dailyForecasts;
      }),
      catchError(this.handleError)
    );
  }

  private aggregateForecastData(response: ForecastResponse): DailyForecast[] {
    const dailyData = new Map<string, ForecastItem[]>();
    
    response.list.forEach(item => {
      const date = new Date(item.dt * 1000).toDateString();
      if (!dailyData.has(date)) {
        dailyData.set(date, []);
      }
      dailyData.get(date)!.push(item);
    });

    const forecasts: DailyForecast[] = [];
    const today = new Date().toDateString();
    
    dailyData.forEach((items, date) => {
      if (date !== today) { // Skip today
        const temps = items.map(item => item.main.temp);
        const humidities = items.map(item => item.main.humidity);
        
        forecasts.push({
          date,
          day: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
          temp_min: Math.min(...temps),
          temp_max: Math.max(...temps),
          weather: items[Math.floor(items.length / 2)].weather[0], // Use middle item's weather
          humidity: Math.round(humidities.reduce((a, b) => a + b, 0) / humidities.length)
        });
      }
    });

    return forecasts.slice(0, 5); // Return next 5 days
  }

  private isCacheValid(timestamp: any): boolean {
    if (!timestamp) return false;
    const now = Date.now();
    const cacheTime = typeof timestamp === 'number' ? timestamp : new Date(timestamp).getTime();
    return (now - cacheTime) < this.CACHE_DURATION;
  }

  private handleError = (error: HttpErrorResponse): Observable<never> => {
    let errorMessage = 'An unknown error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Network error: ${error.error.message}`;
    } else {
      // Server-side error
      switch (error.status) {
        case 404:
          errorMessage = 'City not found. Please check the spelling and try again.';
          break;
        case 401:
          errorMessage = 'Invalid API key. Please check your configuration.';
          break;
        case 429:
          errorMessage = 'Too many requests. Please try again later.';
          break;
        case 500:
          errorMessage = 'Server error. Please try again later.';
          break;
        default:
          errorMessage = `Error ${error.status}: ${error.message}`;
      }
    }
    
    return throwError(() => new Error(errorMessage));
  };

  clearCache(): void {
    this.currentWeatherCache.clear();
    this.forecastCache.clear();
  }
}
