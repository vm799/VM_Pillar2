/**
 * Pillar Two Dashboard - Main Application
 * 
 * This file orchestrates the entire dashboard application, integrating all components
 * and providing the core functionality for the Pillar Two Tax Dashboard.
 */

// Main application namespace
const PillarTwoDashboard = (function() {
    // Private variables
    let data = [];
    let processedData = [];
    let anomalyDetector = null;
    let activeFilters = {
        year: '2024',
        region: 'all',
        etrThreshold: 'all'
    };
    
    // Configuration
    const config = {
        etrThreshold: 0.15, // 15% minimum ETR
        regions: {
            emea: ['United Kingdom', 'Luxembourg', 'Ireland', 'Switzerland', 'United Arab Emirates', 
                   'France', 'Germany', 'Italy', 'Jersey'],
            apac: ['Singapore', 'Hong Kong', 'Japan', 'Australia', 'China', 'Taiwan', 'South Korea', 'India'],
            americas: ['United States', 'Cayman Islands', 'Bermuda', 'Canada', 'Brazil', 'Mexico']
        }
    };
    
    /**
     * Initializes the dashboard
     * @param {Object} options - Initialization options
     */
    function initialize(options = {}) {
        console.log('Initializing Pillar Two Dashboard...');
        
        // Create the anomaly detector
        anomalyDetector = new TaxAnomalyDetector();
        
        // Load data (from SchrodersHFMData)
        if (window.SchrodersHFMData) {
            data = window.SchrodersHFMData.getAllEntities();
            processData();
        } else {
            console.error('SchrodersHFMData not found. Dashboard will not function properly.');
            data = [];
        }
        
        // Initialize UI components
        initializeUI();
        
        // Set up event listeners
        setupEventListeners();
        
        // Render initial view
        renderDashboard();
        
        console.log('Dashboard initialization complete.');
    }
    
    /**
     * Processes the loaded data (applies filters, detects anomalies)
     */
    function processData() {
        if (!data || data.length === 0) {
            processedData = [];
            return;
        }
        
        // Apply filters
        let filteredData = [...data];
        
        // Filter by region
        if (activeFilters.region !== 'all') {
            filteredData = filteredData.filter(entity => 
                config.regions[activeFilters.region]?.includes(entity.Jurisdiction)
            );
        }
        
        // Filter by ETR threshold
        if (activeFilters.etrThreshold === 'below') {
            filteredData = filteredData.filter(entity => 
                entity.JurisdictionalETR < config.etrThreshold
            );
        } else if (activeFilters.etrThreshold === 'above') {
            filteredData = filteredData.filter(entity => 
                entity.JurisdictionalETR >= config.etrThreshold
            );
        }
        
        // Process data with anomaly detection if not already processed
        if (anomalyDetector && filteredData.some(entity => !entity.hasOwnProperty('isAnomaly'))) {
            processedData = anomalyDetector.detectAnomalies(filteredData);
        } else {
            processedData = filteredData;
        }
        
        console.log(`Processed ${processedData.length} entities after filtering.`);
    }
    
    /**
     * Initializes UI components
     */
    function initializeUI() {
        // Initialize tabs
        if (window.TabManager) {
            TabManager.initializeTabs('.tab', '.main-content', 'entity');
            
            // Listen to tab change events
            TabManager.onTabChanged(function(newTabId, prevTabId) {
                console.log(`Tab changed from ${prevTabId} to ${newTabId}`);
                renderTabContent(newTabId);
            });
        } else {
            console.warn('TabManager not found. Tab navigation will not function properly.');
        }
        
        // Populate filter dropdowns
        populateFilters();
    }
    
    /**
     * Sets up event listeners for UI interactions
     */
    function setupEventListeners() {
        // Filter apply button
        const applyButton = document.getElementById('apply-filters');
        if (applyButton) {
            applyButton.addEventListener('click', applyFilters);
        }
        
        // Year filter dropdown
        const yearFilter = document.getElementById('year-filter');
        if (yearFilter) {
            yearFilter.addEventListener('change', function() {
                activeFilters.year = this.value;
            });
        }
        
        // Region filter dropdown
        const regionFilter = document.getElementById('region-filter');
        if (regionFilter) {
            regionFilter.addEventListener('change', function() {
                activeFilters.region = this.value;
            });
        }
        
        // ETR threshold filter dropdown
        const etrFilter = document.getElementById('etr-filter');
        if (etrFilter) {
            etrFilter.addEventListener('change', function() {
                activeFilters.etrThreshold = this.value;
            });
        }
        
        // Analytics region slicer
        const analyticsSlicer = document.getElementById('analytics-region-slicer');
        if (analyticsSlicer) {
            analyticsSlicer.addEventListener('change', function() {
                renderAnalyticsCharts(this.value);
            });
        }
        
        // Entity table row click handler (using event delegation)
        const entitiesTable = document.querySelector('.entities-table tbody');
        if (entitiesTable) {
            entitiesTable.addEventListener('click', function(event) {
                const row = event.target.closest('tr');
                if (row) {
                    const entityId = parseInt(row.getAttribute('data-entity-id'), 10);
                    if (!isNaN(entityId)) {
                        showEntityDetail(entityId);
                    }
                }
            });
        }
        
        // Modal close buttons (using event delegation)
        document.addEventListener('click', function(event) {
            if (event.target.classList.contains('close-modal')) {
                const modal = event.target.closest('.modal');
                if (modal) {
                    modal.hidden = true;
                }
            }
        });
        
        // Close modal on outside click
        document.addEventListener('click', function(event) {
            if (event.target.classList.contains('modal')) {
                event.target.hidden = true;
            }
        });
        
        // Close modal on ESC key
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') {
                const modals = document.querySelectorAll('.modal:not([hidden])');
                modals.forEach(modal => {
                    modal.hidden = true;
                });
            }
        });
        
        // Run anomaly analysis button
        const runAnalysisButton = document.querySelector('.panel-actions [aria-label="Run anomaly analysis"]');
        if (runAnalysisButton) {
            runAnalysisButton.addEventListener('click', function() {
                renderAnomalyAnalysis();
            });
        }
        
        // Export GIR report button
        const exportGirButton = document.getElementById('export-gir');
        if (exportGirButton) {
            exportGirButton.addEventListener('click', function() {
                alert('Exporting GIR Report. In a production environment, this would generate a downloadable report.');
            });
        }
        
        // Generate report button
        const generateReportButton = document.getElementById('generate-report');
        if (generateReportButton) {
            generateReportButton.addEventListener('click', function() {
                const formatSelect = document.getElementById('report-format');
                const format = formatSelect ? formatSelect.value : 'csv';
                alert(`Generating ${format.toUpperCase()} report. In a production environment, this would download a report file.`);
            });
        }
        
        // Set up validation category button handlers
        const validationCategoryBtns = document.querySelectorAll('.validation-category-btn');
        if (validationCategoryBtns.length > 0) {
            validationCategoryBtns.forEach(btn => {
                btn.addEventListener('click', function() {
                    // Add active class to clicked button
                    validationCategoryBtns.forEach(b => b.classList.remove('btn-primary'));
                    this.classList.add('btn-primary');
                    
                    const category = this.getAttribute('data-category');
                    showValidationCategory(category);
                });
            });
        }
    }

    /**
 * Shows validation content for a specific category
 * @param {string} category - The validation category
 */
function showValidationCategory(category) {
    // Get the validation content container
    const contentContainer = document.getElementById('validationCategoryContent');
    if (!contentContainer) return;
    
    // If ValidationHandler is available, use it
    if (window.ValidationHandler && window.ValidationHandler.showCategoryContent) {
        window.ValidationHandler.showCategoryContent(category);
    } else {
        console.warn('ValidationHandler not available. Validation content will not be displayed.');
    }
}
    
    /**
     * Applies filters and updates the dashboard
     */
    function applyFilters() {
        // Show loading indicator
        toggleLoading(true, 'Applying filters...');
        
        // Apply filters with slight delay for UI feedback
        setTimeout(function() {
            try {
                // Process data with new filters
                processData();
                
                // Update UI
                renderDashboard();
                
                // Show success notification
                showNotification(`Filters applied: ${processedData.length} entities match criteria`, 'success');
            } catch (error) {
                console.error('Error applying filters:', error);
                showNotification('Error applying filters. Please try again.', 'error');
            }
            
            // Hide loading indicator
            toggleLoading(false);
        }, 500);
    }
    
    /**
     * Populates filter dropdowns with options
     */
    function populateFilters() {
        // Year filter is static, options already in HTML
        
        // Region filter is static, options already in HTML
        
        // ETR threshold filter is static, options already in HTML
    }
    
    /**
     * Renders the main dashboard (metrics, entities table, charts)
     */
    function renderDashboard() {
        updateMetrics();
        populateEntitiesTable();
        createCharts();
        renderGIRTable();
    }
    
    /**
     * Updates the key metrics on the dashboard
     */
    function updateMetrics() {
        const metrics = document.querySelectorAll('.metric-value');
        if (metrics.length < 6) return;
        
        // Get summary statistics
        const stats = window.SchrodersHFMData ? window.SchrodersHFMData.getSummaryStats() : {
            totalEntities: processedData.length,
            avgETR: processedData.reduce((sum, entity) => sum + entity.JurisdictionalETR, 0) / 
                   (processedData.length || 1),
            entitiesBelowETR: processedData.filter(entity => entity.JurisdictionalETR < 0.15).length,
            totalTopUpTax: processedData.reduce((sum, entity) => sum + entity.TopUpTax, 0),
            safeHarborEligible: processedData.filter(entity => entity.safeHarbor).length,
            anomaliesDetected: processedData.filter(entity => entity.isAnomaly).length
        };
        
        // Total Entities
        metrics[0].textContent = processedData.length;
        
        // Average ETR
        metrics[1].textContent = formatPercentage(stats.avgETR);
        
        // Entities Below 15% ETR
        metrics[2].textContent = stats.entitiesBelowETR;
        
        // Total Top-Up Tax
        metrics[3].textContent = formatCurrency(stats.totalTopUpTax);
        
        // Safe Harbor Eligible
        metrics[4].textContent = stats.safeHarborEligible;
        
        // Anomalies Detected
        metrics[5].textContent = stats.anomaliesDetected;
        
        // Also update analytics KPI if present
        const avgEtrKpi = document.getElementById('avg-etr-value');
        if (avgEtrKpi) {
            avgEtrKpi.textContent = formatPercentage(stats.avgETR);
        }
    }
    
    /**
     * Populates the entities table with data
     */
    function populateEntitiesTable() {
        const tableBody = document.querySelector('.entities-table tbody');
        if (!tableBody) return;
        
        // Clear existing rows
        tableBody.innerHTML = '';
        
        // Add rows for each entity (limit to top 20 by GloBE Income)
        const topEntities = [...processedData]
            .sort((a, b) => b.GloBEIncome - a.GloBEIncome)
            .slice(0, 20);
        
        topEntities.forEach(entity => {
            const row = document.createElement('tr');
            row.setAttribute('tabindex', '0');
            row.setAttribute('data-entity-id', entity.EntityID);
            
            // Format cell values
            const etrFormatted = formatPercentage(entity.JurisdictionalETR);
            const etrClass = getETRColorClass(entity.JurisdictionalETR);
            
            const incomeFormatted = formatCurrency(entity.GloBEIncome);
            
            const topUpFormatted = entity.TopUpTax > 0 ? 
                formatCurrency(entity.TopUpTax) : '-';
            const topUpClass = entity.TopUpTax > 0 ? 'value-warning' : '';
            
            const safeHarborFormatted = entity.safeHarbor ? 
                '<span class="value-success">Yes</span>' : '<span class="value-warning">No</span>';
            
            const anomalyFormatted = entity.isAnomaly ?
                '<span class="value-warning">Yes</span>' : '<span class="value-success">No</span>';
            
            // Add cells to row
            row.innerHTML = `
                <td>${entity.name}</td>
                <td>${entity.Jurisdiction}</td>
                <td class="${etrClass}">${etrFormatted}</td>
                <td>${incomeFormatted}</td>
                <td class="${topUpClass}">${topUpFormatted}</td>
                <td>${safeHarborFormatted}</td>
                <td>${anomalyFormatted}</td>
            `;
            
            // Add accessibility support for keyboard navigation
            row.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    showEntityDetail(entity.EntityID);
                }
            });
            
            tableBody.appendChild(row);
        });
    }
    
    /**
     * Creates charts for dashboard visualizations
     */
    function createCharts() {
        if (window.ChartRenderer) {
            // Entity tab charts
            ChartRenderer.createETRChart('etr-chart', processedData);
            ChartRenderer.createTopUpChart('topup-chart', processedData);
            
            // Initialize other tab charts when they become visible
            const activeTab = TabManager.getActiveTabId('tabstabselector');
            renderTabContent(activeTab);
        } else {
            console.warn('ChartRenderer not found. Charts will not be displayed.');
        }
    }
    
    /**
     * Renders content for a specific tab
     * @param {string} tabId - The ID of the tab to render content for
     */
    function renderTabContent(tabId) {
        switch (tabId) {
            case 'etr':
                ChartRenderer.createETRMap('etr-map', processedData);
                break;
            
            case 'topup':
                ChartRenderer.createTopUpAnalysisChart('topup-analysis', processedData);
                break;
            
            case 'anomaly':
                renderAnomalyAnalysis();
                break;
            
            case 'analytics':
                renderAnalyticsCharts();
                break;
            
            case 'gir':
                renderGIRTable();
                break;
            
            // No extra rendering needed for other tabs
        }
    }
    
    /**
     * Renders the GIR (Global Information Reporting) table
     */
    function renderGIRTable() {
        const tableBody = document.querySelector('.gir-table tbody');
        if (!tableBody) return;
        
        // Clear existing rows
        tableBody.innerHTML = '';
        
        // Get jurisdictional data
        const jurisdictionData = window.SchrodersHFMData ? 
            window.SchrodersHFMData.getJurisdictionData() : 
            getJurisdictionDataFromEntities();
        
        // Add rows for each jurisdiction
        jurisdictionData.forEach(jurisdiction => {
            const row = document.createElement('tr');
            
            // Format values
            const incomeFormatted = formatCurrency(jurisdiction.totalIncome);
            const taxesFormatted = formatCurrency(jurisdiction.totalTaxesPayable);
            
            // Calculate economic activity score (simple mock for demo)
            const economicActivity = Math.random() < 0.3 ? 'Low' : 
                                     Math.random() < 0.7 ? 'Medium' : 'High';
            
            // Determine safe harbor status based on avg ETR
            const safeHarborStatus = jurisdiction.avgETR >= 0.15 ? 
                '<span class="value-success">Eligible</span>' : 
                '<span class="value-warning">Not Eligible</span>';
            
            // Add cells to row
            row.innerHTML = `
                <td>${jurisdiction.jurisdiction}</td>
                <td>${incomeFormatted}</td>
                <td>${taxesFormatted}</td>
                <td>${economicActivity}</td>
                <td>${safeHarborStatus}</td>
            `;
            
            tableBody.appendChild(row);
        });
    }
    
    /**
     * Aggregates jurisdiction data from entities
     * @returns {Array} Aggregated jurisdiction data
     */
    function getJurisdictionDataFromEntities() {
        const jurisdictionMap = {};
        
        processedData.forEach(entity => {
            const jurisdiction = entity.Jurisdiction;
            
            if (!jurisdictionMap[jurisdiction]) {
                jurisdictionMap[jurisdiction] = {
                    jurisdiction: jurisdiction,
                    entities: 0,
                    totalIncome: 0,
                    totalTaxesPayable: 0,
                    avgETR: 0
                };
            }
            
            jurisdictionMap[jurisdiction].entities += 1;
            jurisdictionMap[jurisdiction].totalIncome += entity.GloBEIncome;
            jurisdictionMap[jurisdiction].totalTaxesPayable += entity.TotalTaxesPayable;
            jurisdictionMap[jurisdiction].avgETR += entity.JurisdictionalETR;
        });
        
        // Calculate averages
        return Object.values(jurisdictionMap).map(jurisdiction => {
            jurisdiction.avgETR = jurisdiction.avgETR / jurisdiction.entities;
            return jurisdiction;
        });
    }
    
    /**
     * Renders the anomaly analysis charts and data
     */
    function renderAnomalyAnalysis() {
        if (window.ChartRenderer) {
            ChartRenderer.createAnomalyChart('anomaly-chart', processedData);
        }
    }
    
    /**
     * Renders analytics charts based on region filter
     * @param {string} region - Region filter value (optional)
     */
    function renderAnalyticsCharts(region = 'all') {
        if (window.ChartRenderer) {
            ChartRenderer.createETRHeatmap('etr-heatmap', processedData);
            ChartRenderer.createETRTrendChart('etr-trend-chart', processedData, region);
        }
    }
    
    /**
     * Shows detailed information for a specific entity
     * @param {number} entityId - ID of the entity to show details for
     */
    function showEntityDetail(entityId) {
        const entity = processedData.find(e => e.EntityID === entityId);
        if (!entity) {
            console.error(`Entity with ID ${entityId} not found`);
            return;
        }
        
        const modal = document.getElementById('entityDetailModal');
        const content = document.getElementById('entity-detail-content');
        const title = document.getElementById('entity-detail-title');
        
        if (!modal || !content) return;
        
        // Set the title
        if (title) {
            title.textContent = entity.name;
        }
        
        // Format ETR and determine status
        const etrFormatted = formatPercentage(entity.JurisdictionalETR);
        const etrStatus = entity.JurisdictionalETR < 0.15 ? 
            `<span class="value-warning">Below Minimum</span>` : 
            `<span class="value-success">Above Minimum</span>`;
        
        // Format Top-Up Tax
        const topUpFormatted = entity.TopUpTax > 0 ? 
            formatCurrency(entity.TopUpTax) : 'None';
        
        // Create HTML content
        content.innerHTML = `
            <div class="entity-detail">
                <div class="detail-section">
                    <h3>Entity Information</h3>
                    <div class="detail-grid">
                        <div class="detail-row">
                            <div class="detail-label">Jurisdiction:</div>
                            <div class="detail-value">${entity.Jurisdiction}</div>
                        </div>
                        <div class="detail-row">
                            <div class="detail-label">Entity ID:</div>
                            <div class="detail-value">${entity.EntityID}</div>
                        </div>
                    </div>
                </div>
                
                <div class="detail-section">
                    <h3>Financial Data</h3>
                    <div class="detail-grid">
                        <div class="detail-row">
                            <div class="detail-label">GloBE Income:</div>
                            <div class="detail-value">${formatCurrency(entity.GloBEIncome)}</div>
                        </div>
                        <div class="detail-row">
                            <div class="detail-label">Jurisdictional ETR:</div>
                            <div class="detail-value">${etrFormatted} ${etrStatus}</div>
                        </div>
                        <div class="detail-row">
                            <div class="detail-label">Total Taxes Payable:</div>
                            <div class="detail-value">${formatCurrency(entity.TotalTaxesPayable)}</div>
                        </div>
                        <div class="detail-row">
                            <div class="detail-label">SBIE:</div>
                            <div class="detail-value">${formatCurrency(entity.SubstanceBasedIncomeExclusion)}</div>
                        </div>
                        <div class="detail-row">
                            <div class="detail-label">Top-Up Tax:</div>
                            <div class="detail-value">${topUpFormatted}</div>
                        </div>
                    </div>
                </div>
                
                ${entity.isAnomaly ? `
                <div class="detail-section">
                    <h3>Anomaly Detection</h3>
                    <div class="anomaly-alert">
                        <p>⚠️ This entity has been flagged with ${entity.anomalyCount} anomalies.</p>
                        <p>Anomaly score: ${entity.anomalyScore.toFixed(2)}</p>
                    </div>
                    <div class="anomaly-list">
                        <h4>Detected Anomalies:</h4>
                        <ul>
                            ${entity.anomalies.map(anomaly => `
                                <li>
                                    <strong>${anomaly.feature}:</strong> ${anomaly.description}
                                    <span class="anomaly-severity ${anomaly.severity}">(${anomaly.severity})</span>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                    <div class="recommendation-list">
                        <h4>Recommendations:</h4>
                        <ul>
                            ${entity.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                        </ul>
                    </div>
                </div>
                ` : ''}
                
                <div class="detail-actions">
                    <button class="btn" onclick="window.print()">Print Report</button>
                    <button class="btn btn-outline close-modal">Close</button>
                </div>
            </div>
        `;
        
        // Show the modal
        modal.hidden = false;
    }
    
    /**
     * Shows validation content for a specific category
     * @param {string} category - The validation category
     */
    function showValidationCategory(category) {
        // Get the validation content container
        const contentContainer = document.getElementById('validationCategoryContent');
        if (!contentContainer) return;
        
        // This function is intended to be a stub that will be extended by
        // dashboard.js which provides the validation functionality
    }
    
    /**
     * Toggles the loading overlay
     * @param {boolean} show - Whether to show or hide the loading overlay
     * @param {string} message - Optional message to display
     */
    function toggleLoading(show, message = 'Loading...') {
        const overlay = document.getElementById('loadingOverlay');
        if (!overlay) {
            // Create a loading overlay if it doesn't exist
            const newOverlay = document.createElement('div');
            newOverlay.id = 'loadingOverlay';
            newOverlay.className = 'loading-overlay';
            newOverlay.innerHTML = `
                <div class="loading-spinner"></div>
                <div class="loading-message">${message}</div>
            `;
            document.body.appendChild(newOverlay);
            return;
        }
        
        overlay.hidden = !show;
        
        const messageElement = overlay.querySelector('.loading-message');
        if (messageElement && message) {
            messageElement.textContent = message;
        }
    }
    
    /**
     * Shows a notification message
     * @param {string} message - The message to display
     * @param {string} type - The notification type ('success', 'error', 'info')
     */
    function showNotification(message, type = 'info') {
        // Check if notification container exists
        let container = document.querySelector('.notification-container');
        if (!container) {
            // Create container if it doesn't exist
            container = document.createElement('div');
            container.className = 'notification-container';
            document.body.appendChild(container);
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Add close button
        const closeBtn = document.createElement('button');
        closeBtn.className = 'notification-close';
        closeBtn.innerHTML = '&times;';
        closeBtn.addEventListener('click', function() {
            container.removeChild(notification);
        });
        notification.appendChild(closeBtn);
        
        // Add to container
        container.appendChild(notification);
        
        // Auto-remove after delay
        setTimeout(function() {
            if (container.contains(notification)) {
                container.removeChild(notification);
            }
        }, 5000);
    }
    
    // Utility functions
    
    /**
     * Format currency values consistently
     * @param {number} value - Value to format
     * @param {string} prefix - Currency prefix (default: $)
     * @param {boolean} inMillions - Whether to display in millions
     * @returns {string} Formatted currency string
     */
    function formatCurrency(value, prefix = '$', inMillions = true) {
        if (inMillions) {
            return `${prefix}${(value / 1000000).toFixed(1)}M`;
        }
        return `${prefix}${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    
    /**
     * Format percentage values consistently
     * @param {number} value - Value to format (decimal, e.g., 0.15)
     * @param {number} decimals - Number of decimal places
     * @returns {string} Formatted percentage string
     */
    function formatPercentage(value, decimals = 1) {
        return `${(value * 100).toFixed(decimals)}%`;
    }
    
    /**
     * Get color class based on ETR value
     * @param {number} etr - ETR value (decimal)
     * @returns {string} CSS class for coloring
     */
    function getETRColorClass(etr) {
        if (etr >= 0.16) return 'value-success';
        if (etr >= 0.15) return '';
        return 'value-warning';
    }
    
    // Public API
    return {
        initialize,
        applyFilters,
        formatCurrency,
        formatPercentage,
        showNotification,
        toggleLoading
    };
})();

// Initialize the dashboard when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if required dependencies are available
    const dependencies = [
        { name: 'Chart.js', check: () => typeof Chart !== 'undefined' },
        { name: 'TabManager', check: () => typeof TabManager !== 'undefined' },
        { name: 'ChartRenderer', check: () => typeof ChartRenderer !== 'undefined' },
        { name: 'SchrodersHFMData', check: () => typeof SchrodersHFMData !== 'undefined' },
        { name: 'TaxAnomalyDetector', check: () => typeof TaxAnomalyDetector !== 'undefined' }
    ];
    
    // Check each dependency
    const missingDependencies = dependencies.filter(dep => !dep.check());
    
    if (missingDependencies.length > 0) {
        console.error('Missing dependencies:', missingDependencies.map(d => d.name).join(', '));
        
        // Add a visible error message to the page
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `
            <h2>Error Loading Dashboard</h2>
            <p>The following required dependencies could not be loaded:</p>
            <ul>
                ${missingDependencies.map(d => `<li>${d.name}</li>`).join('')}
            </ul>
            <p>Please check your network connection and try refreshing the page.</p>
        `;
        
        // Insert at the top of the dashboard
        const dashboard = document.querySelector('.dashboard');
        if (dashboard) {
            dashboard.insertBefore(errorDiv, dashboard.firstChild);
        } else {
            document.body.insertBefore(errorDiv, document.body.firstChild);
        }
        
        return;
    }
    
    // Initialize the dashboard
    PillarTwoDashboard.initialize();
});