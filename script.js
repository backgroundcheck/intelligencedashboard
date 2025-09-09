// Global variables
let dashboardData = [];
let charts = {};

// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadSampleData();
    setupFileUpload();
});

// Load sample data
async function loadSampleData() {
    try {
        const response = await fetch('sample-data.csv');
        const csvText = await response.text();
        
        Papa.parse(csvText, {
            header: true,
            skipEmptyLines: true,
            complete: function(results) {
                if (results.errors.length > 0) {
                    console.warn('CSV parsing warnings:', results.errors);
                }
                dashboardData = results.data;
                processData();
                hideLoading();
            },
            error: function(error) {
                console.error('Error parsing CSV:', error);
                showError('Error loading data. Please check the CSV file format.');
            }
        });
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
                Papa.parse(e.target.result, {
                    header: true,
                    skipEmptyLines: true,
                    complete: function(results) {
                        dashboardData = results.data;
                        processData();
                        showSuccess('Data uploaded successfully!');
                    },
                    error: function(error) {
                        showError('Error parsing uploaded file.');
                    }
                });
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

// Update all charts
function updateCharts() {
    updateCourtChart();
    updateYearChart();
    updateCourtWorkloadChart();
    updateAdvocateChart();
}

// Update court distribution pie chart
function updateCourtChart() {
    const courtData = {};
    dashboardData.forEach(row => {
        const court = row['TRANSFEREE COURT'] || 'Unknown';
        courtData[court] = (courtData[court] || 0) + 1;
    });
    
    const ctx = document.getElementById('courtChart').getContext('2d');
    
    if (charts.courtChart) {
        charts.courtChart.destroy();
    }
    
    charts.courtChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: Object.keys(courtData),
            datasets: [{
                data: Object.values(courtData),
                backgroundColor: [
                    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
                    '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF'
                ],
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const percentage = ((context.parsed / dashboardData.length) * 100).toFixed(1);
                            return `${context.label}: ${context.parsed} cases (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

// Update yearly trend line chart
function updateYearChart() {
    const yearData = {};
    dashboardData.forEach(row => {
        const year = row['CASE YEAR'] || 'Unknown';
        yearData[year] = (yearData[year] || 0) + 1;
    });
    
    const sortedYears = Object.keys(yearData).sort();
    const ctx = document.getElementById('yearChart').getContext('2d');
    
    if (charts.yearChart) {
        charts.yearChart.destroy();
    }
    
    charts.yearChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: sortedYears,
            datasets: [{
                label: 'Cases Filed',
                data: sortedYears.map(year => yearData[year]),
                borderColor: '#36A2EB',
                backgroundColor: 'rgba(54, 162, 235, 0.1)',
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#36A2EB',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        title: function(context) {
                            return `Year ${context[0].label}`;
                        },
                        label: function(context) {
                            return `Cases Filed: ${context.parsed.y}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Year'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Number of Cases'
                    },
                    beginAtZero: true
                }
            }
        }
    });
}

// Update court workload bar chart
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
    
    const courts = Object.keys(courtStats).sort((a, b) => courtStats[b].cases - courtStats[a].cases);
    const ctx = document.getElementById('courtWorkloadChart').getContext('2d');
    
    if (charts.courtWorkloadChart) {
        charts.courtWorkloadChart.destroy();
    }
    
    charts.courtWorkloadChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: courts,
            datasets: [{
                label: 'Number of Cases',
                data: courts.map(court => courtStats[court].cases),
                backgroundColor: 'rgba(54, 162, 235, 0.8)',
                borderColor: '#36A2EB',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        afterLabel: function(context) {
                            const court = context.label;
                            const value = courtStats[court].value;
                            return `Total Value: ${formatCurrency(value)}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Courts'
                    },
                    ticks: {
                        maxRotation: 45
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Number of Cases'
                    },
                    beginAtZero: true
                }
            }
        }
    });
    
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
    
    // Get top 10 advocates
    const topAdvocates = Object.entries(advocateData)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10);
    
    const ctx = document.getElementById('advocateChart').getContext('2d');
    
    if (charts.advocateChart) {
        charts.advocateChart.destroy();
    }
    
    charts.advocateChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: topAdvocates.map(([name,]) => name),
            datasets: [{
                data: topAdvocates.map(([, count]) => count),
                backgroundColor: [
                    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
                    '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0', '#36A2EB'
                ],
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 15,
                        usePointStyle: true,
                        generateLabels: function(chart) {
                            const data = chart.data;
                            return data.labels.map((label, i) => ({
                                text: label.length > 20 ? label.substring(0, 20) + '...' : label,
                                fillStyle: data.datasets[0].backgroundColor[i],
                                index: i
                            }));
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.parsed} cases`;
                        }
                    }
                }
            }
        }
    });
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
            <td class="text-value">${formatCurrency(stats.value / 10000000)} Cr</td>
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
    document.getElementById('loading').style.display = 'none';
    document.getElementById('dashboard-content').style.display = 'block';
}

function showError(message) {
    // Create a simple toast notification
    const toast = document.createElement('div');
    toast.className = 'alert alert-danger position-fixed';
    toast.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    toast.innerHTML = `
        <i class="fas fa-exclamation-triangle me-2"></i>
        ${message}
        <button type="button" class="btn-close" onclick="this.parentElement.remove()"></button>
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        if (toast.parentElement) {
            toast.remove();
        }
    }, 5000);
}

function showSuccess(message) {
    // Create a simple toast notification
    const toast = document.createElement('div');
    toast.className = 'alert alert-success position-fixed';
    toast.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    toast.innerHTML = `
        <i class="fas fa-check-circle me-2"></i>
        ${message}
        <button type="button" class="btn-close" onclick="this.parentElement.remove()"></button>
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        if (toast.parentElement) {
            toast.remove();
        }
    }, 3000);
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

// Responsive chart resizing
window.addEventListener('resize', function() {
    Object.values(charts).forEach(chart => {
        if (chart) {
            chart.resize();
        }
    });
});

// Export functions to global scope for button onclick handlers
window.updateTopCases = updateTopCases;
window.updateTopAdvocates = updateTopAdvocates;