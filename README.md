# Weather App

A responsive Angular weather application that displays current weather conditions and 5-day forecasts for any city worldwide. Built with Angular 16+ and TypeScript.

## Features

- 🌡️ **Current Weather**: Real-time temperature, conditions, humidity, and more
- 📅 **5-Day Forecast**: Extended weather predictions with daily highs/lows
- 🔍 **City Search**: Search for weather in any city worldwide
- 💾 **Persistent Storage**: Remembers your last searched city
- 📱 **Responsive Design**: Works perfectly on mobile and desktop
- ♿ **Accessible**: Full keyboard navigation and screen reader support
- ⚡ **Fast**: In-memory caching to reduce API calls

## Prerequisites

- Node.js (version 16 or higher)
- npm (version 8 or higher)
- Angular CLI (version 16 or higher)

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Get OpenWeatherMap API Key

1. Visit [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for a free account
3. Navigate to the API keys section
4. Copy your API key

### 3. Configure API Key

Edit `src/environments/environment.ts` and replace `YOUR_API_KEY_HERE` with your actual API key:

```typescript
export const environment = {
  production: false,
  openWeatherApiKey: 'your_actual_api_key_here',
  openWeatherApiUrl: 'https://api.openweathermap.org/data/2.5'
};
```

### 4. Run the Application

```bash
ng serve --open
```

The application will open in your browser at `http://localhost:4200`.

## Build for Production

```bash
ng build
```

The build artifacts will be stored in the `dist/` directory.

## Usage

1. **Search for Weather**: Enter a city name in the search bar and press Enter or click Search
2. **View Current Weather**: See temperature, conditions, humidity, and other weather details
3. **Toggle Forecast**: Use the toggle switch to show/hide the 5-day forecast
4. **Clear History**: Click the "Clear" button to remove your last searched city

## API Rate Limits

The free OpenWeatherMap API has the following limits:
- 1,000 calls per day
- 60 calls per minute

The app includes in-memory caching to minimize API calls and stay within these limits.

## Project Structure

```
src/
├── app/
│   ├── components/           # Reusable UI components
│   │   ├── search-bar/      # City search input
│   │   ├── weather-display/ # Current weather display
│   │   ├── forecast/        # 5-day forecast display
│   │   ├── loading-spinner/ # Loading indicator
│   │   └── error-message/   # Error display
│   ├── core/
│   │   ├── models/          # TypeScript interfaces
│   │   └── services/        # Weather API service
│   └── app.component.*     # Main application component
├── environments/            # Environment configuration
└── styles.css              # Global styles
```

## Technologies Used

- **Angular 16+**: Modern web framework
- **TypeScript**: Type-safe JavaScript
- **RxJS**: Reactive programming
- **CSS3**: Responsive styling with flexbox and grid
- **OpenWeatherMap API**: Weather data source

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development

### Running Tests

```bash
ng test
```

### Code Linting

```bash
ng lint
```

## Troubleshooting

### Common Issues

1. **API Key Not Working**
   - Ensure your API key is correctly set in `environment.ts`
   - Check that your OpenWeatherMap account is activated
   - Verify you haven't exceeded the rate limits

2. **City Not Found**
   - Try using the city's English name
   - Include country code if ambiguous (e.g., "London, UK")
   - Check spelling and try alternative names

3. **Build Errors**
   - Ensure all dependencies are installed: `npm install`
   - Check TypeScript version compatibility
   - Clear node_modules and reinstall if needed

### Getting Help

If you encounter issues:
1. Check the browser console for error messages
2. Verify your API key is working with a simple test
3. Ensure you have a stable internet connection
4. Check the OpenWeatherMap API status

## License

This project is open source and available under the MIT License.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.