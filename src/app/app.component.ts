import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

import { WeatherService } from './core/services/weather.service';
import { CurrentWeather, DailyForecast, WeatherState } from './core/models/weather.model';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { WeatherDisplayComponent } from './components/weather-display/weather-display.component';
import { ForecastComponent } from './components/forecast/forecast.component';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { ErrorMessageComponent } from './components/error-message/error-message.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SearchBarComponent,
    WeatherDisplayComponent,
    ForecastComponent,
    LoadingSpinnerComponent,
    ErrorMessageComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private readonly LAST_CITY_KEY = 'weatherApp.lastCity';

  // State management
  state: WeatherState = {
    loading: false,
    error: null,
    currentWeather: null,
    forecast: null,
    lastSearchedCity: null
  };

  // View state
  showForecast = false;
  hasSearched = false;

  constructor(private weatherService: WeatherService) {}

  ngOnInit(): void {
    this.loadLastSearchedCity();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onCitySearch(city: string): void {
    if (!city.trim()) return;
    
    this.hasSearched = true;
    this.state.loading = true;
    this.state.error = null;
    this.state.currentWeather = null;
    this.state.forecast = null;

    // Search for current weather
    this.weatherService.getCurrentWeather(city)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (weather) => {
          this.state.currentWeather = weather;
          this.state.lastSearchedCity = city;
          this.saveLastSearchedCity(city);
          this.loadForecast(city);
        },
        error: (error) => {
          this.state.loading = false;
          this.state.error = error.message;
        }
      });
  }

  onRetry(): void {
    if (this.state.lastSearchedCity) {
      this.onCitySearch(this.state.lastSearchedCity);
    }
  }

  onToggleForecast(): void {
    this.showForecast = !this.showForecast;
    
    // Load forecast if not already loaded and we have current weather
    if (this.showForecast && !this.state.forecast && this.state.currentWeather) {
      this.loadForecast(this.state.currentWeather.name);
    }
  }

  onClearLastCity(): void {
    this.state.lastSearchedCity = null;
    this.state.currentWeather = null;
    this.state.forecast = null;
    this.showForecast = false;
    this.hasSearched = false;
    localStorage.removeItem(this.LAST_CITY_KEY);
  }

  private loadForecast(city: string): void {
    this.weatherService.getForecast(city)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (forecast) => {
          this.state.forecast = forecast;
          this.state.loading = false;
        },
        error: (error) => {
          this.state.loading = false;
          // Don't show error for forecast, just log it
          console.warn('Failed to load forecast:', error.message);
        }
      });
  }

  private loadLastSearchedCity(): void {
    const lastCity = localStorage.getItem(this.LAST_CITY_KEY);
    if (lastCity) {
      this.state.lastSearchedCity = lastCity;
      this.onCitySearch(lastCity);
    }
  }

  private saveLastSearchedCity(city: string): void {
    localStorage.setItem(this.LAST_CITY_KEY, city);
  }

  get hasWeatherData(): boolean {
    return !!(this.state.currentWeather || this.state.forecast);
  }

  get canShowForecast(): boolean {
    return (this.state.forecast?.length ?? 0) > 0;
  }
}
