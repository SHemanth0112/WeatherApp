import { Component, EventEmitter, Output, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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

  ngOnInit(): void {
    // Focus the input on component initialization
    setTimeout(() => {
      if (this.cityInput) {
        this.cityInput.nativeElement.focus();
      }
    }, 100);
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
}
