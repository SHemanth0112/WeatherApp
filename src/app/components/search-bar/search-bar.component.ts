import { Component, EventEmitter, Output, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { CityAutocompleteService, CitySuggestion } from '../../core/services/city-autocomplete.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnInit {
  @Output() citySearch = new EventEmitter<string>();
  @ViewChild('cityInput') cityInput!: ElementRef<HTMLInputElement>;
  
  cityName = '';
  isValid = true;
  errorMessage = '';

  // Autocomplete state
  suggestions$: Observable<CitySuggestion[]> | null = null;
  private inputChange$ = new Subject<string>();
  constructor(private autocompleteService: CityAutocompleteService) {}
  ngOnInit(): void {
    // Focus the input on component initialization
    setTimeout(() => {
      if (this.cityInput) {
        this.cityInput.nativeElement.focus();
      }
    }, 100);

    // Wire up debounced input to suggestions stream
    this.suggestions$ = this.inputChange$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      switchMap(q => this.autocompleteService.searchCities(q, environment.openWeatherApiKey, 6))
    );
  }

  onSearch(): void {
    this.validateInput();
    
    if (this.isValid) {
      this.citySearch.emit(this.cityName.trim());
      this.errorMessage = '';
    }
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.onSearch();
    }
  }

  onInputChange(value: string): void {
    this.cityName = value ?? '';
    this.isValid = true;
    this.errorMessage = '';
    this.inputChange$.next(this.cityName);
  }

  private validateInput(): void {
    const trimmedCity = this.cityName.trim();
    
    if (!trimmedCity) {
      this.isValid = false;
      this.errorMessage = 'Please enter a city name';
      return;
    }
    
    if (trimmedCity.length < 2) {
      this.isValid = false;
      this.errorMessage = 'City name must be at least 2 characters';
      return;
    }
    
    if (!/^[a-zA-Z\s\-']+$/.test(trimmedCity)) {
      this.isValid = false;
      this.errorMessage = 'City name contains invalid characters';
      return;
    }
    
    this.isValid = true;
    this.errorMessage = '';
  }

  clearInput(): void {
    this.cityName = '';
    this.isValid = true;
    this.errorMessage = '';
    this.cityInput.nativeElement.focus();
  }

  onSelectSuggestion(s: CitySuggestion): void {
    this.cityName = `${s.name}`;
    // Keep existing behavior: do not auto-search, let user press Enter/click
    setTimeout(() => {
      this.cityInput.nativeElement.focus();
    }, 0);
  }
}
