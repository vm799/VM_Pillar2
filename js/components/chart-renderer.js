/**
 * Chart Renderer Module
 * Handles all chart rendering for the Pillar Two Dashboard with robust error handling
 */

const ChartRenderer = (function() {
    // Private variables and utility functions
    const chartInstances = {};
    
    /**
     * Safely gets a canvas context, with error handling
     * @param {string} canvasId - The ID of the canvas element
     * @returns {CanvasRenderingContext2D|null} - The canvas context or null if not available
     */
    function getCanvasContext(canvasId) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) {
            console.warn(`Canvas element with ID '${canvasId}' not found`);
            return null;
        }
        
        try {
            // Make sure the canvas has proper dimensions
            if (canvas.width === 0 || canvas.height === 0) {
                canvas.width = canvas.offsetWidth || 300;
                canvas.height = canvas.offsetHeight || 200;
            }
            
            // Get and return the context
            return canvas.getContext('2d');
        } catch(e) {
            console.error(`Failed to get context for canvas '${canvasId}':`, e);
            return null;
        }
    }
    
    /**
     * Safely creates or updates a chart
     * @param {string} chartId - The ID for the chart (should match canvas ID)
     * @param {object} config - Chart.js configuration object
     * @returns {Chart|null} - The created chart instance or null if creation failed
     */
    function createOrUpdateChart(chartId, config) {
        const ctx = getCanvasContext(chartId);
        if (!ctx) return null;
        
        // If a chart with this ID already exists, destroy it first
        if (chartInstances[chartId]) {
            chartInstances[chartId].destroy();
            delete chartInstances[chartId];
        }
        
        try {
            // Add responsiveness to the chart
            const defaultOptions = {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    }
                }
            };
            
            // Merge default options with provided config
            config.options = Object.assign({}, defaultOptions, config.options || {});
            
            // Create the new chart
            const chart = new Chart(ctx, config);
            chartInstances[chartId] = chart;
            return chart;
        } catch(e) {
            console.error(`Failed to create chart '${chartId}':`, e);
            return null;
        }
    }
    
    // Public API
    return {
        /**
         * Creates or updates an ETR chart
         * @param {string} canvasId - The ID of the canvas element
         * @param {Array} entities - The entities to display in the chart
         * @returns {Chart|null} - The created chart instance or null if creation failed
         */
        createETRChart: function(canvasId, entities) {
            if (!entities || !entities.length) {
                console.warn('No entities provided for ETR chart');
                return null;
            }
            
            // Sort and get top jurisdictions by GloBE Income
            const topJurisdictions = [...entities]
                .sort((a, b) => b.GloBEIncome - a.GloBEIncome)
                .reduce((acc, entity) => {
                    if (!acc.find(item => item.Jurisdiction === entity.Jurisdiction)) {
                        acc.push(entity);
                    }
                    return acc;
                }, [])
                .slice(0, 10);
            
            const labels = topJurisdictions.map(entity => entity.Jurisdiction);
            const data = topJurisdictions.map(entity => entity.JurisdictionalETR * 100);
            const threshold = Array(labels.length).fill(15); // 15% threshold line
            
            const chartConfig = {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'ETR %',
                            data: data,
                            backgroundColor: data.map(value => value < 15 ? '#f44336' : '#4caf50'),
                            borderWidth: 0
                        },
                        {
                            label: 'Minimum Rate (15%)',
                            data: threshold,
                            type: 'line',
                            borderColor: '#ff9800',
                            borderWidth: 2,
                            pointRadius: 0,
                            fill: false
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Effective Tax Rate (%)'
                            },
                            ticks: {
                                callback: function(value) {
                                    return value + '%';
                                }
                            }
                        }
                    },
                    plugins: {
                        title: {
                            display: true,
                            text: 'Jurisdictional Effective Tax Rates (ETR)'
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    const value = context.parsed.y;
                                    let riskLevel = 'High Risk';
                                    if (value >= 20) riskLevel = 'Low Risk';
                                    else if (value >= 15) riskLevel = 'Medium Risk';
                                    
                                    return [
                                        `ETR: ${value.toFixed(1)}%`,
                                        `Risk Level: ${riskLevel}`,
                                        `Required Rate: 15%`,
                                        `Difference: ${(value - 15).toFixed(1)}%`
                                    ];
                                }
                            }
                        }
                    }
                }
            };
            
            return createOrUpdateChart(canvasId, chartConfig);
        },

        /**
         * Creates or updates a Top-Up Tax chart
         * @param {string} canvasId - The ID of the canvas element
         * @param {Array} entities - The entities to display in the chart
         * @returns {Chart|null} - The created chart instance or null if creation failed
         */
        createTopUpChart: function(canvasId, entities) {
            if (!entities || !entities.length) {
                console.warn('No entities provided for Top-Up Tax chart');
                return null;
            }
            
            // Filter and sort entities with top-up tax
            const entitiesWithTopUp = [...entities]
                .filter(entity => entity.TopUpTax > 0)
                .sort((a, b) => b.TopUpTax - a.TopUpTax)
                .slice(0, 10); // Top 10 entities
            
            const labels = entitiesWithTopUp.map(entity => entity.Jurisdiction);
            const data = entitiesWithTopUp.map(entity => entity.TopUpTax / 1000000); // Convert to millions
            
            const chartConfig = {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Top-Up Tax (Millions $)',
                            data: data,
                            backgroundColor: '#f44336',
                            borderWidth: 0
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Top-Up Tax ($ Millions)'
                            }
                        }
                    },
                    plugins: {
                        title: {
                            display: true,
                            text: 'Top-Up Tax by Jurisdiction'
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    const index = context.dataIndex;
                                    const entity = entitiesWithTopUp[index];
                                    return [
                                        `Top-Up Tax: $${context.formattedValue}M`,
                                        `ETR: ${(entity.JurisdictionalETR * 100).toFixed(1)}%`,
                                        `Shortfall: ${((0.15 - entity.JurisdictionalETR) * 100).toFixed(1)}%`
                                    ];
                                }
                            }
                        }
                    }
                }
            };
            
            return createOrUpdateChart(canvasId, chartConfig);
        },

        /**
         * Creates or updates an ETR Map
         * @param {string} canvasId - The ID of the canvas element
         * @param {Array} entities - The entities to display in the chart
         * @returns {Chart|null} - The created chart instance or null if creation failed
         */
        createETRMap: function(canvasId, entities) {
            if (!entities || !entities.length) {
                console.warn('No entities provided for ETR Map');
                return null;
            }
            
            // Aggregate data by jurisdiction
            const jurisdictionData = {};
            entities.forEach(entity => {
                if (!jurisdictionData[entity.Jurisdiction]) {
                    jurisdictionData[entity.Jurisdiction] = {
                        count: 0,
                        totalETR: 0,
                        totalIncome: 0
                    };
                }
                
                jurisdictionData[entity.Jurisdiction].count += 1;
                jurisdictionData[entity.Jurisdiction].totalETR += entity.JurisdictionalETR;
                jurisdictionData[entity.Jurisdiction].totalIncome += entity.GloBEIncome;
            });
            
            // Calculate average ETR by jurisdiction
            const jurisdictions = Object.keys(jurisdictionData);
            const avgETRs = jurisdictions.map(j => 
                (jurisdictionData[j].totalETR / jurisdictionData[j].count) * 100
            );
            
            // Size bubbles based on income
            const bubbleSizes = jurisdictions.map(j => 
                Math.sqrt(jurisdictionData[j].totalIncome) / 5000
            );
            
            const chartConfig = {
                type: 'bubble',
                data: {
                    datasets: [{
                        label: 'Jurisdictional ETR',
                        data: jurisdictions.map((j, i) => ({
                            x: i, // Position on x-axis
                            y: avgETRs[i], // ETR value
                            r: bubbleSizes[i] // Bubble size based on income
                        })),
                        backgroundColor: avgETRs.map(etr => 
                            etr < 15 ? 'rgba(244, 67, 54, 0.7)' : 'rgba(76, 175, 80, 0.7)'
                        )
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: {
                            type: 'category',
                            labels: jurisdictions,
                            title: {
                                display: true,
                                text: 'Jurisdiction'
                            },
                            ticks: {
                                autoSkip: false,
                                maxRotation: 90,
                                minRotation: 45
                            }
                        },
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'ETR (%)'
                            },
                            ticks: {
                                callback: function(value) {
                                    return value + '%';
                                }
                            }
                        }
                    },
                    plugins: {
                        title: {
                            display: true,
                            text: 'ETR by Jurisdiction (bubble size represents GloBE Income)'
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    const index = context.dataIndex;
                                    const j = jurisdictions[index];
                                    return [
                                        `Jurisdiction: ${j}`,
                                        `ETR: ${avgETRs[index].toFixed(1)}%`,
                                        `Income: $${(jurisdictionData[j].totalIncome / 1000000).toFixed(1)}M`,
                                        `Entities: ${jurisdictionData[j].count}`
                                    ];
                                }
                            }
                        }
                    }
                }
            };
            
            return createOrUpdateChart(canvasId, chartConfig);
        },

        /**
         * Creates or updates a Top-Up Tax Analysis chart
         * @param {string} canvasId - The ID of the canvas element
         * @param {Array} entities - The entities to display in the chart
         * @returns {Chart|null} - The created chart instance or null if creation failed
         */
        createTopUpAnalysisChart: function(canvasId, entities) {
            if (!entities || !entities.length) {
                console.warn('No entities provided for Top-Up Analysis chart');
                return null;
            }
            
            // Calculate ETR gap and top-up tax for each entity
            const analysisData = entities
                .filter(e => e.TopUpTax > 0)
                .map(e => ({
                    name: e.name,
                    jurisdiction: e.Jurisdiction,
                    etrGap: Math.max(0, 0.15 - e.JurisdictionalETR),
                    topUpTax: e.TopUpTax / 1000000, // In millions
                    income: e.GloBEIncome / 1000000 // In millions
                }))
                .sort((a, b) => b.topUpTax - a.topUpTax)
                .slice(0, 8); // Top 8 for readability
            
            const chartConfig = {
                type: 'bar',
                data: {
                    labels: analysisData.map(d => d.name),
                    datasets: [
                        {
                            label: 'ETR Gap (%)',
                            data: analysisData.map(d => d.etrGap * 100),
                            backgroundColor: 'rgba(255, 152, 0, 0.7)',
                            yAxisID: 'y-axis-1',
                            order: 2
                        },
                        {
                            label: 'Top-Up Tax ($M)',
                            data: analysisData.map(d => d.topUpTax),
                            backgroundColor: 'rgba(244, 67, 54, 0.7)',
                            yAxisID: 'y-axis-2',
                            type: 'line',
                            borderColor: 'rgba(244, 67, 54, 1)',
                            borderWidth: 2,
                            pointRadius: 4,
                            order: 1
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        'y-axis-1': {
                            type: 'linear',
                            position: 'left',
                            title: {
                                display: true,
                                text: 'ETR Gap (%)'
                            },
                            ticks: {
                                callback: function(value) {
                                    return value + '%';
                                }
                            },
                            grid: {
                                drawOnChartArea: false
                            }
                        },
                        'y-axis-2': {
                            type: 'linear',
                            position: 'right',
                            title: {
                                display: true,
                                text: 'Top-Up Tax ($M)'
                            },
                            grid: {
                                drawOnChartArea: false
                            }
                        }
                    },
                    plugins: {
                        title: {
                            display: true,
                            text: 'Top-Up Tax Analysis: ETR Gap vs. Tax Amount'
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    const index = context.dataIndex;
                                    const datasetIndex = context.datasetIndex;
                                    const entity = analysisData[index];
                                    
                                    if (datasetIndex === 0) {
                                        return `ETR Gap: ${(entity.etrGap * 100).toFixed(1)}%`;
                                    } else {
                                        return [
                                            `Top-Up Tax: $${entity.topUpTax.toFixed(1)}M`,
                                            `Jurisdiction: ${entity.jurisdiction}`,
                                            `GloBE Income: $${entity.income.toFixed(1)}M`
                                        ];
                                    }
                                }
                            }
                        }
                    }
                }
            };
            
            return createOrUpdateChart(canvasId, chartConfig);
        },

        /**
         * Creates or updates an Anomaly Detection chart
         * @param {string} canvasId - The ID of the canvas element
         * @param {Array} entities - The entities to display in the chart
         * @returns {Chart|null} - The created chart instance or null if creation failed
         */
        createAnomalyChart: function(canvasId, entities) {
            if (!entities || !entities.length) {
                console.warn('No entities provided for Anomaly chart');
                return null;
            }
            
            // Get entities with anomalies
            const anomalousEntities = entities.filter(e => e.isAnomaly);
            
            // Count anomaly types
            const anomalyTypes = {};
            anomalousEntities.forEach(entity => {
                if (entity.anomalies && Array.isArray(entity.anomalies)) {
                    entity.anomalies.forEach(anomaly => {
                        const feature = anomaly.feature || 'Unknown';
                        anomalyTypes[feature] = (anomalyTypes[feature] || 0) + 1;
                    });
                }
            });
            
            // Prepare data for chart
            const labels = Object.keys(anomalyTypes);
            const counts = labels.map(label => anomalyTypes[label]);
            
            const chartConfig = {
                type: 'pie',
                data: {
                    labels: labels,
                    datasets: [{
                        data: counts,
                        backgroundColor: [
                            'rgba(244, 67, 54, 0.7)',
                            'rgba(255, 152, 0, 0.7)',
                            'rgba(76, 175, 80, 0.7)',
                            'rgba(33, 150, 243, 0.7)',
                            'rgba(156, 39, 176, 0.7)',
                            'rgba(255, 87, 34, 0.7)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Anomaly Detection Results by Type'
                        },
                        legend: {
                            position: 'right'
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    const label = context.label || '';
                                    const value = context.formattedValue;
                                    const total = counts.reduce((a, b) => a + b, 0);
                                    const percentage = Math.round((context.raw / total) * 100);
                                    return `${label}: ${value} (${percentage}%)`;
                                }
                            }
                        }
                    }
                }
            };
            
            return createOrUpdateChart(canvasId, chartConfig);
        },

        /**
         * Creates or updates an ETR Trend chart for analytics
         * @param {string} canvasId - The ID of the canvas element
         * @param {Array} entities - The entities to display in the chart
         * @param {string} region - The region to filter by (optional)
         * @returns {Chart|null} - The created chart instance or null if creation failed
         */
        createETRTrendChart: function(canvasId, entities, region = 'all') {
            if (!entities || !entities.length) {
                console.warn('No entities provided for ETR Trend chart');
                return null;
            }
            
            // Define mock historical data for trend analysis
            const years = ['2021', '2022', '2023', '2024'];
            
            // Filter entities by region if specified
            let filteredEntities = [...entities];
            const regionMapping = {
                'emea': ['United Kingdom', 'Luxembourg', 'Ireland', 'Switzerland', 'United Arab Emirates'],
                'apac': ['Singapore', 'Hong Kong', 'Japan', 'Australia'],
                'americas': ['United States', 'Cayman Islands', 'Bermuda']
            };
            
            if (region !== 'all' && regionMapping[region]) {
                filteredEntities = entities.filter(e => 
                    regionMapping[region].includes(e.Jurisdiction)
                );
            }
            
            // Get jurisdictions from filtered entities
            const jurisdictions = [...new Set(filteredEntities.map(e => e.Jurisdiction))];
            
            // Create mock trend data (random but consistent)
            const mockTrends = {};
            jurisdictions.forEach(j => {
                const currentETR = filteredEntities.find(e => e.Jurisdiction === j)?.JurisdictionalETR || 0.15;
                mockTrends[j] = years.map((year, index) => {
                    // Generate a trend that ends at the current ETR
                    // Use a seed based on jurisdiction name for consistent randomness
                    const seed = j.charCodeAt(0) + j.charCodeAt(j.length - 1);
                    const randomFactor = Math.sin(seed * index) * 0.03;
                    
                    if (year === '2024') {
                        return currentETR * 100; // Current year's actual value
                    } else {
                        // Historical values that trend towards the current value
                        const trendFactor = index / years.length;
                        const baseValue = 0.15 * 100; // 15% base
                        const targetValue = currentETR * 100;
                        return baseValue + (targetValue - baseValue) * trendFactor + randomFactor * 100;
                    }
                });
            });
            
            // Prepare datasets
            const datasets = Object.keys(mockTrends).map((jurisdiction, index) => {
                // Generate a consistent color based on the jurisdiction name
                const hue = (jurisdiction.charCodeAt(0) * 13) % 360;
                const color = `hsl(${hue}, 70%, 50%)`;
                
                return {
                    label: jurisdiction,
                    data: mockTrends[jurisdiction],
                    borderColor: color,
                    backgroundColor: `hsla(${hue}, 70%, 50%, 0.2)`,
                    borderWidth: 2,
                    pointRadius: 3,
                    tension: 0.3 // Slightly smoother lines
                };
            });
            
            const chartConfig = {
                type: 'line',
                data: {
                    labels: years,
                    datasets: datasets
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            title: {
                                display: true,
                                text: 'ETR (%)'
                            },
                            ticks: {
                                callback: function(value) {
                                    return value + '%';
                                }
                            },
                            min: 0,
                            suggestedMax: 30
                        }
                    },
                    plugins: {
                        title: {
                            display: true,
                            text: `ETR Trends by Jurisdiction (${region.toUpperCase()})`
                        },
                        annotation: {
                            annotations: {
                                line1: {
                                    type: 'line',
                                    yMin: 15,
                                    yMax: 15,
                                    borderColor: 'rgba(255, 99, 132, 0.5)',
                                    borderWidth: 2,
                                    borderDash: [6, 6],
                                    label: {
                                        content: 'Minimum ETR (15%)',
                                        display: true,
                                        position: 'end'
                                    }
                                }
                            }
                        }
                    }
                }
            };
            
            return createOrUpdateChart(canvasId, chartConfig);
        },

        /**
         * Creates or updates an ETR Heatmap for analytics
         * @param {string} canvasId - The ID of the canvas element
         * @param {Array} entities - The entities to display in the chart
         * @returns {Chart|null} - The created chart instance or null if creation failed
         */
        createETRHeatmap: function(canvasId, entities) {
            if (!entities || !entities.length) {
                console.warn('No entities provided for ETR Heatmap');
                return null;
            }
            
            // Group jurisdictions by region
            const regionMapping = {
                'EMEA': ['United Kingdom', 'Luxembourg', 'Ireland', 'Switzerland', 'United Arab Emirates'],
                'APAC': ['Singapore', 'Hong Kong', 'Japan', 'Australia'],
                'Americas': ['United States', 'Cayman Islands', 'Bermuda']
            };
            
            // Prepare data for chart
            const data = [];
            Object.keys(regionMapping).forEach(region => {
                regionMapping[region].forEach(jurisdiction => {
                    const matchingEntities = entities.filter(e => e.Jurisdiction === jurisdiction);
                    if (matchingEntities.length > 0) {
                        const avgETR = matchingEntities.reduce((sum, e) => sum + e.JurisdictionalETR, 0) / matchingEntities.length;
                        data.push({
                            x: region,
                            y: jurisdiction,
                            v: avgETR * 100 // Convert to percentage
                        });
                    }
                });
            });
            
            // Create custom heatmap
            const regions = ['EMEA', 'APAC', 'Americas'];
            const allJurisdictions = [...new Set(data.map(d => d.y))].sort();
            
            // Prepare dataset
            const datasets = regions.map(region => {
                const regionData = data.filter(d => d.x === region);
                
                return {
                    label: region,
                    data: allJurisdictions.map(j => {
                        const matchingData = regionData.find(d => d.y === j);
                        return matchingData ? matchingData.v : null;
                    }),
                    backgroundColor: function(context) {
                        const value = context.dataset.data[context.dataIndex];
                        if (value === null) return 'rgba(200, 200, 200, 0.2)';
                        
                        // Color based on ETR value (red below 15%, green above)
                        if (value < 15) {
                            // Calculate intensity based on how far below 15%
                            const intensity = 0.5 + (15 - value) / 30;
                            return `rgba(244, 67, 54, ${intensity})`;
                        } else {
                            // Calculate intensity based on how far above 15%
                            const intensity = 0.5 + (value - 15) / 30;
                            return `rgba(76, 175, 80, ${Math.min(0.85, intensity)})`;
                        }
                    }
                };
            });
            
            // Create horizontal bar chart that mimics a heatmap
            const chartConfig = {
                type: 'bar',
                data: {
                    labels: allJurisdictions,
                    datasets: datasets
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    indexAxis: 'y',
                    scales: {
                        x: {
                            stacked: false,
                            title: {
                                display: true,
                                text: 'ETR (%)'
                            },
                            ticks: {
                                callback: function(value) {
                                    return value + '%';
                                }
                            }
                        },
                        y: {
                            stacked: true,
                            title: {
                                display: true,
                                text: 'Jurisdiction'
                            }
                        }
                    },
                    plugins: {
                        title: {
                            display: true,
                            text: 'ETR Heatmap by Region and Jurisdiction'
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    const value = context.raw;
                                    if (value === null) return 'No data available';
                                    
                                    const riskLevel = value < 15 ? 'High Risk' : value < 20 ? 'Medium Risk' : 'Low Risk';
                                    return [
                                        `${context.dataset.label}: ${value.toFixed(1)}%`,
                                        `Risk Level: ${riskLevel}`
                                    ];
                                }
                            }
                        }
                    }
                }
            };
            
            return createOrUpdateChart(canvasId, chartConfig);
        },

        /**
         * Destroys all charts to prevent memory leaks
         */
        destroyAllCharts: function() {
            Object.keys(chartInstances).forEach(chartId => {
                if (chartInstances[chartId]) {
                    chartInstances[chartId].destroy();
                    delete chartInstances[chartId];
                }
            });
        }
    };
})();

// Export to global scope
window.ChartRenderer = ChartRenderer;