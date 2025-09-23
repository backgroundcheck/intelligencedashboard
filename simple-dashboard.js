// Simple Dashboard JavaScript (no external dependencies)
let dashboardData = [];

// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadSampleData();
    setupFileUpload();
});

// Simple CSV parser (no external library needed)
function parseCSV(csvText) {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    const data = [];
    
    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');
        const row = {};
        headers.forEach((header, index) => {
            row[header] = values[index] ? values[index].trim() : '';
        });
        data.push(row);
    }
    
    return data;
}

// Load sample data
async function loadSampleData() {
    try {
        const response = await fetch('sample-data.csv');
        const csvText = await response.text();
        dashboardData = parseCSV(csvText);
        processData();
        hideLoading();
    } catch (error) {
        console.error('Error loading sample data:', error);
        showError('Error loading sample data.');
    }
}

// Setup file upload functionality
function setupFileUpload() {
    const fileInput = document.getElementById('csvFile');
    fileInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file && file.type === 'text/csv') {
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    dashboardData = parseCSV(e.target.result);
                    processData();
                    showSuccess('Data uploaded successfully!');
                } catch (error) {
                    showError('Error parsing uploaded file.');
                }
            };
            reader.readAsText(file);
        } else {
            showError('Please select a valid CSV file.');
        }
    });
}

// Process data and update dashboard
function processData() {
    updateMetrics();
    updateCharts();
    updateTables();
}

// Update key metrics
function updateMetrics() {
    const totalCases = dashboardData.length;
    const totalValue = dashboardData.reduce((sum, row) => {
        const value = parseFloat(row['CASE VALUE']?.replace(/,/g, '') || 0);
        return sum + value;
    }, 0);
    
    const pendingCases = dashboardData.filter(row => 
        row['NEXT DATE BY HIGH COURT'] && row['NEXT DATE BY HIGH COURT'].trim() !== ''
    ).length;
    
    const disposedCases = totalCases - pendingCases;
    
    document.getElementById('total-cases').textContent = totalCases.toLocaleString();
    document.getElementById('total-value').textContent = formatCurrency(totalValue);
    document.getElementById('pending-cases').textContent = pendingCases.toLocaleString();
    document.getElementById('disposed-cases').textContent = disposedCases.toLocaleString();
}

// Update charts (simple text-based charts for now)
function updateCharts() {
    updateCourtChart();
    updateYearChart();
    updateCourtWorkloadChart();
    updateAdvocateChart();
}

// Update court distribution chart
function updateCourtChart() {
    const courtData = {};
    dashboardData.forEach(row => {
        const court = row['TRANSFEREE COURT'] || 'Unknown';
        courtData[court] = (courtData[court] || 0) + 1;
    });
    
    const chartElement = document.getElementById('courtChart');
    chartElement.innerHTML = '';
    
    // Create simple bar chart using HTML/CSS
    const maxValue = Math.max(...Object.values(courtData));
    const chartHTML = Object.entries(courtData)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 8) // Show top 8 courts
        .map(([court, count]) => {
            const percentage = (count / maxValue) * 100;
            return `
                <div style="margin: 5px 0; display: flex; align-items: center;">
                    <div style="width: 120px; font-size: 12px; overflow: hidden; text-overflow: ellipsis;">${court}</div>
                    <div style="flex: 1; background: #e0e0e0; margin: 0 10px; height: 20px; border-radius: 3px;">
                        <div style="background: linear-gradient(45deg, #667eea, #764ba2); height: 100%; width: ${percentage}%; border-radius: 3px; display: flex; align-items: center; justify-content: center; color: white; font-size: 11px; font-weight: bold;">
                            ${count > 5 ? count : ''}
                        </div>
                    </div>
                    <div style="width: 30px; font-size: 12px; font-weight: bold;">${count}</div>
                </div>
            `;
        }).join('');
    
    chartElement.innerHTML = `<div style="width: 100%; padding: 10px;">${chartHTML}</div>`;
}

// Update yearly trend chart
function updateYearChart() {
    const yearData = {};
    dashboardData.forEach(row => {
        const year = row['CASE YEAR'] || 'Unknown';
        yearData[year] = (yearData[year] || 0) + 1;
    });
    
    const chartElement = document.getElementById('yearChart');
    const sortedYears = Object.keys(yearData).sort();
    const maxValue = Math.max(...Object.values(yearData));
    
    const chartHTML = sortedYears.map(year => {
        const count = yearData[year];
        const height = (count / maxValue) * 150;
        return `
            <div style="display: inline-block; margin: 0 5px; text-align: center;">
                <div style="height: 150px; display: flex; align-items: end;">
                    <div style="background: linear-gradient(to top, #667eea, #764ba2); width: 40px; height: ${height}px; border-radius: 3px 3px 0 0; display: flex; align-items: center; justify-content: center; color: white; font-size: 11px; font-weight: bold;">
                        ${count > 3 ? count : ''}
                    </div>
                </div>
                <div style="font-size: 12px; font-weight: bold; margin-top: 5px;">${year}</div>
                <div style="font-size: 10px; color: #666;">${count} cases</div>
            </div>
        `;
    }).join('');
    
    chartElement.innerHTML = `<div style="display: flex; justify-content: center; align-items: end; padding: 10px;">${chartHTML}</div>`;
}

// Update court workload chart
function updateCourtWorkloadChart() {
    const courtStats = {};
    dashboardData.forEach(row => {
        const court = row['TRANSFEREE COURT'] || 'Unknown';
        const value = parseFloat(row['CASE VALUE']?.replace(/,/g, '') || 0);
        
        if (!courtStats[court]) {
            courtStats[court] = { cases: 0, value: 0 };
        }
        courtStats[court].cases += 1;
        courtStats[court].value += value;
    });
    
    const chartElement = document.getElementById('courtWorkloadChart');
    const courts = Object.keys(courtStats).sort((a, b) => courtStats[b].cases - courtStats[a].cases);
    const maxCases = Math.max(...courts.map(court => courtStats[court].cases));
    
    const chartHTML = courts.slice(0, 6).map(court => {
        const stats = courtStats[court];
        const percentage = (stats.cases / maxCases) * 100;
        return `
            <div style="margin: 8px 0; display: flex; align-items: center;">
                <div style="width: 100px; font-size: 11px; overflow: hidden; text-overflow: ellipsis;">${court}</div>
                <div style="flex: 1; background: #e0e0e0; margin: 0 10px; height: 24px; border-radius: 3px;">
                    <div style="background: linear-gradient(45deg, #28a745, #20c997); height: 100%; width: ${percentage}%; border-radius: 3px; display: flex; align-items: center; justify-content: center; color: white; font-size: 11px; font-weight: bold;">
                        ${stats.cases > 3 ? stats.cases : ''}
                    </div>
                </div>
                <div style="width: 60px; font-size: 11px;">
                    <div style="font-weight: bold;">${stats.cases} cases</div>
                    <div style="color: #666;">${formatCurrency(stats.value / 10000000)} Cr</div>
                </div>
            </div>
        `;
    }).join('');
    
    chartElement.innerHTML = `<div style="width: 100%; padding: 10px;">${chartHTML}</div>`;
    
    // Update court stats table
    updateCourtStatsTable(courtStats);
}

// Update advocate distribution chart
function updateAdvocateChart() {
    const advocateData = {};
    dashboardData.forEach(row => {
        const advocate = row['ADVOCATE'] || 'Unknown';
        advocateData[advocate] = (advocateData[advocate] || 0) + 1;
    });
    
    const topAdvocates = Object.entries(advocateData)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 8);
    
    const chartElement = document.getElementById('advocateChart');
    const maxCases = Math.max(...topAdvocates.map(([, count]) => count));
    
    const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF'];
    
    const chartHTML = topAdvocates.map(([advocate, count], index) => {
        const percentage = (count / maxCases) * 100;
        const displayName = advocate.length > 20 ? advocate.substring(0, 20) + '...' : advocate;
        return `
            <div style="margin: 6px 0; display: flex; align-items: center;">
                <div style="width: 120px; font-size: 11px; overflow: hidden; text-overflow: ellipsis;">${displayName}</div>
                <div style="flex: 1; background: #e0e0e0; margin: 0 10px; height: 20px; border-radius: 3px;">
                    <div style="background: ${colors[index] || '#667eea'}; height: 100%; width: ${percentage}%; border-radius: 3px; display: flex; align-items: center; justify-content: center; color: white; font-size: 11px; font-weight: bold;">
                        ${count > 2 ? count : ''}
                    </div>
                </div>
                <div style="width: 30px; font-size: 12px; font-weight: bold;">${count}</div>
            </div>
        `;
    }).join('');
    
    chartElement.innerHTML = `<div style="width: 100%; padding: 10px;">${chartHTML}</div>`;
}

// Update tables
function updateTables() {
    updateTopCases();
    updateTopAdvocates();
}

// Update top cases table
function updateTopCases() {
    const limit = parseInt(document.getElementById('topCasesLimit').value) || 10;
    const sortedCases = [...dashboardData]
        .sort((a, b) => {
            const valueA = parseFloat(a['CASE VALUE']?.replace(/,/g, '') || 0);
            const valueB = parseFloat(b['CASE VALUE']?.replace(/,/g, '') || 0);
            return valueB - valueA;
        })
        .slice(0, Math.min(limit, 1000));
    
    const tableBody = document.getElementById('topCasesTable');
    tableBody.innerHTML = '';
    
    sortedCases.forEach(row => {
        const tr = document.createElement('tr');
        const value = parseFloat(row['CASE VALUE']?.replace(/,/g, '') || 0);
        const status = row['NEXT DATE BY HIGH COURT'] && row['NEXT DATE BY HIGH COURT'].trim() !== '' ? 'Pending' : 'Disposed';
        const statusClass = status === 'Pending' ? 'status-pending' : 'status-disposed';
        
        tr.innerHTML = `
            <td>${row['Sr. No.'] || '-'}</td>
            <td>${row['PARTY1'] || '-'}</td>
            <td>${row['PARTY2'] || '-'}</td>
            <td class="text-value">${formatCurrency(value)}</td>
            <td>${row['TRANSFEREE COURT'] || '-'}</td>
            <td>${row['CASE YEAR'] || '-'}</td>
            <td><span class="status-badge ${statusClass}">${status}</span></td>
        `;
        tableBody.appendChild(tr);
    });
}

// Update top advocates table
function updateTopAdvocates() {
    const limit = parseInt(document.getElementById('topAdvocatesLimit').value) || 10;
    const advocateStats = {};
    
    dashboardData.forEach(row => {
        const advocate = row['ADVOCATE'] || 'Unknown';
        const value = parseFloat(row['CASE VALUE']?.replace(/,/g, '') || 0);
        
        if (!advocateStats[advocate]) {
            advocateStats[advocate] = { cases: 0, value: 0 };
        }
        advocateStats[advocate].cases += 1;
        advocateStats[advocate].value += value;
    });
    
    const topAdvocates = Object.entries(advocateStats)
        .sort(([,a], [,b]) => b.cases - a.cases)
        .slice(0, Math.min(limit, 100));
    
    const tableBody = document.getElementById('topAdvocatesTable');
    tableBody.innerHTML = '';
    
    topAdvocates.forEach(([advocate, stats]) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${advocate}</td>
            <td>${stats.cases}</td>
            <td class="text-value">${(stats.value / 10000000).toFixed(1)} Cr</td>
        `;
        tableBody.appendChild(tr);
    });
}

// Update court stats table
function updateCourtStatsTable(courtStats) {
    const courts = Object.keys(courtStats).sort((a, b) => courtStats[b].cases - courtStats[a].cases);
    const tableBody = document.getElementById('courtStatsTable');
    tableBody.innerHTML = '';
    
    courts.forEach(court => {
        const tr = document.createElement('tr');
        const stats = courtStats[court];
        tr.innerHTML = `
            <td>${court}</td>
            <td>${stats.cases}</td>
            <td class="text-value">${(stats.value / 10000000).toFixed(1)}</td>
        `;
        tableBody.appendChild(tr);
    });
}

// Utility functions
function formatCurrency(amount) {
    if (amount >= 10000000) { // 1 Crore
        return `₹${(amount / 10000000).toFixed(1)} Cr`;
    } else if (amount >= 100000) { // 1 Lakh
        return `₹${(amount / 100000).toFixed(1)} L`;
    } else if (amount >= 1000) { // 1 Thousand
        return `₹${(amount / 1000).toFixed(1)} K`;
    } else {
        return `₹${amount.toLocaleString()}`;
    }
}

function hideLoading() {
    document.getElementById('loading').classList.add('hidden');
    document.getElementById('dashboard-content').classList.remove('hidden');
}

function showError(message) {
    // Simple alert for now (could be enhanced with better notifications)
    alert('Error: ' + message);
}

function showSuccess(message) {
    // Simple alert for now (could be enhanced with better notifications)
    alert('Success: ' + message);
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Export functions to global scope for button onclick handlers
window.updateTopCases = updateTopCases;
window.updateTopAdvocates = updateTopAdvocates;