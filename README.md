# Earthquake Damage Report Application

A bilingual (Thai/English) single-page web application for reporting room damage from earthquakes and generating PDF reports.

## Features

- Bilingual support (Thai/English)
- Mobile-friendly UI designed for users aged 18-90
- Room damage reporting with room number and owner information
- Image uploading from gallery with detailed damage information
- PDF report generation

## User Flow

1. User opens the application
2. User inputs room number
3. User inputs owner name
4. User selects images from gallery (multiple selection supported)
5. For each image, user inputs details:
   - The room that was damaged
   - The location of the damage
   - The extent of the damage
6. User clicks/taps the "Generate PDF" button to create a report

## Technology Stack

- React with TypeScript
- Material-UI for responsive design
- i18next for internationalization
- jsPDF for PDF generation

## Installation and Setup

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/earthshaker.git
   cd earthshaker
   ```

2. Install dependencies:
   ```
   npm install --legacy-peer-deps
   ```

3. Start the development server:
   ```
   npm start
   ```

4. Build for production:
   ```
   npm run build
   ```

## Browser Compatibility

The application is designed to work on modern browsers, including:
- Chrome
- Firefox
- Safari
- Edge

For the best experience, please use the latest version of your browser.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
