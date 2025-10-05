import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { WeatherService } from './weather.service';
import { environment } from '../../../environments/environment';

describe('WeatherService', () => {
  let service: WeatherService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [WeatherService]
    });
    service = TestBed.inject(WeatherService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch current weather for a city', () => {
    const mockWeather = {
      id: 1,
      name: 'London',
      weather: [{ id: 1, main: 'Clear', description: 'clear sky', icon: '01d' }],
      main: { temp: 20, feels_like: 19, temp_min: 18, temp_max: 22, pressure: 1013, humidity: 65 },
      sys: { country: 'GB', sunrise: 1234567890, sunset: 1234567890 },
      dt: Date.now()
    };

    service.getCurrentWeather('London').subscribe(weather => {
      expect(weather).toEqual(mockWeather);
      expect(weather.name).toBe('London');
    });

    const req = httpMock.expectOne(
      `${environment.openWeatherApiUrl}/weather?q=London&appid=${environment.openWeatherApiKey}&units=metric`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockWeather);
  });

  it('should handle 404 error when city not found', () => {
    service.getCurrentWeather('InvalidCity').subscribe({
      next: () => fail('should have failed with 404 error'),
      error: (error) => {
        expect(error.message).toContain('City not found');
      }
    });

    const req = httpMock.expectOne(
      `${environment.openWeatherApiUrl}/weather?q=InvalidCity&appid=${environment.openWeatherApiKey}&units=metric`
    );
    req.flush('Not Found', { status: 404, statusText: 'Not Found' });
  });

  it('should handle 401 error for invalid API key', () => {
    service.getCurrentWeather('London').subscribe({
      next: () => fail('should have failed with 401 error'),
      error: (error) => {
        expect(error.message).toContain('Invalid API key');
      }
    });

    const req = httpMock.expectOne(
      `${environment.openWeatherApiUrl}/weather?q=London&appid=${environment.openWeatherApiKey}&units=metric`
    );
    req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
  });

  it('should fetch 5-day forecast for a city', () => {
    const mockForecast = {
      list: [
        {
          dt: 1234567890,
          main: { temp: 20, feels_like: 19, temp_min: 18, temp_max: 22, pressure: 1013, humidity: 65 },
          weather: [{ id: 1, main: 'Clear', description: 'clear sky', icon: '01d' }],
          dt_txt: '2023-01-01 12:00:00'
        }
      ],
      city: { name: 'London', country: 'GB' }
    };

    service.getForecast('London').subscribe(forecast => {
      expect(forecast).toBeTruthy();
      expect(Array.isArray(forecast)).toBe(true);
    });

    const req = httpMock.expectOne(
      `${environment.openWeatherApiUrl}/forecast?q=London&appid=${environment.openWeatherApiKey}&units=metric`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockForecast);
  });
});
