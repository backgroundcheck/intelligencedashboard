# Intelligence Dashboard

An AI-driven modern interactive dashboard for legal case data analysis and visualization.

## Features

- **Interactive Data Visualization**: Modern charts and graphs using Chart.js
- **Top Case Analysis**: View top 1000 cases by case value with customizable limits
- **Advocate Analytics**: Top 100 advocates by case count with detailed statistics
- **Court-wise Analysis**: Workload distribution and performance metrics across different courts
- **Yearly Trends**: Track case filing patterns over time
- **Status Tracking**: Monitor pending vs disposed cases
- **Data Upload**: Upload custom CSV files to analyze your own legal case data
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

## Quick Start

1. **Open the Dashboard**: Simply open `index.html` in your web browser
2. **View Sample Data**: The dashboard loads with sample legal case data automatically
3. **Explore Visualizations**: Navigate through different sections using the top navigation
4. **Upload Custom Data**: Use the file upload feature to analyze your own CSV data

## Dashboard Sections

### 📊 Overview
- Key metrics summary (total cases, total value, pending/disposed counts)
- Court distribution pie chart
- Yearly filing trend analysis

### 🏆 Top Cases
- Configurable list of top cases by monetary value
- Detailed case information including parties, courts, and status
- Support for up to 1000 cases display

### ⚖️ Court Analysis
- Court workload distribution bar chart
- Detailed court statistics table
- Case value analysis by court

### 👥 Advocate Analytics
- Top advocates by case count (up to 100)
- Case distribution among legal practitioners
- Total case value handled by each advocate

## Data Format

The dashboard expects CSV files with the following columns:

| Column | Description |
|--------|-------------|
| Sr. No. | Serial number |
| PARTY1 | Plaintiff/Petitioner name |
| PARTY2 | Defendant/Respondent name |
| CASE VALUE | Monetary value of the case (in PKR) |
| TRANSFEREE COURT | Court handling the case |
| CASE YEAR | Year the case was filed |
| NEXT DATE BY HIGH COURT | Next hearing date (empty for disposed cases) |
| ADVOCATE | Legal representative name |

## Technical Details

### Technologies Used
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Bootstrap 5.3 with custom CSS
- **Charts**: Chart.js for data visualization
- **CSV Processing**: Papa Parse library
- **Icons**: Font Awesome 6.0

### Browser Compatibility
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

### Performance
- Client-side processing for fast data manipulation
- Optimized for datasets up to 10,000 records
- Responsive design with mobile optimization

## Installation

No installation required! This is a static web application that runs entirely in the browser.

1. Clone or download this repository
2. Open `index.html` in any modern web browser
3. The dashboard will load automatically with sample data

## Customization

### Adding New Visualizations
Edit `script.js` to add new chart types or modify existing ones. The dashboard uses Chart.js, so you can implement any chart type supported by the library.

### Styling Changes
Modify `style.css` to customize colors, fonts, and layout. The CSS uses custom properties for easy theme customization.

### Data Processing
Update the data processing functions in `script.js` to handle additional data formats or add new calculated fields.

## Sample Data

The included `sample-data.csv` contains 50 sample legal cases with realistic data structure. This demonstrates:
- High-value commercial litigation
- Various court jurisdictions
- Different case statuses (pending/disposed)
- Multiple legal practitioners
- Cases spanning multiple years (2021-2023)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly across different browsers
5. Submit a pull request

## License

This project is open source and available under the MIT License.

## Support

For questions or issues, please create an issue in the GitHub repository.
