import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface CitySuggestion {
  name: string;
  country: string;
  state?: string;
  lat: number;
  lon: number;
}

@Injectable({ providedIn: 'root' })
export class CityAutocompleteService {
  // Using explicit endpoint to avoid changing existing environment configuration
  private readonly GEO_BASE_URL = 'https://api.openweathermap.org/geo/1.0';

  constructor(private http: HttpClient) {}

  searchCities(query: string, apiKey: string, limit = 5): Observable<CitySuggestion[]> {
    const trimmed = (query ?? '').trim();
    if (!trimmed || trimmed.length < 2) {
      return of([]);
    }

    const url = `${this.GEO_BASE_URL}/direct?q=${encodeURIComponent(trimmed)}&limit=${limit}&appid=${apiKey}`;
    return this.http.get<any[]>(url).pipe(
      map(results => (results || []).map(item => ({
        name: item.name,
        country: item.country,
        state: item.state,
        lat: item.lat,
        lon: item.lon
      }) as CitySuggestion)),
      catchError(() => of([]))
    );
  }
}


