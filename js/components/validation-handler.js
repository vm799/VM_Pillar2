/**
 * Validation Handler Module
 * Handles calculation validation functionality for the Pillar Two Dashboard
 */

const ValidationHandler = (function() {
    // Private variables
    let activeCategory = null;
    
    /**
     * Initializes validation functionality
     */
    function initialize() {
        console.log('Initializing ValidationHandler module');
        
        // Set up category button handlers
        setupCategoryButtons();
        
        // Set up modal interaction handlers
        setupModalHandlers();
    }
    
    /**
     * Sets up click handlers for validation category buttons
     */
    function setupCategoryButtons() {
        const validationCategoryBtns = document.querySelectorAll('.validation-category-btn');
        if (validationCategoryBtns.length > 0) {
            validationCategoryBtns.forEach(btn => {
                btn.addEventListener('click', function() {
                    // Remove active class from all buttons
                    validationCategoryBtns.forEach(b => b.classList.remove('active'));
                    
                    // Add active class to clicked button
                    this.classList.add('active');
                    
                    // Show content for selected category
                    const category = this.getAttribute('data-category');
                    showCategoryContent(category);
                });
            });
            
            // Initialize with first category
            const firstCategory = validationCategoryBtns[0].getAttribute('data-category');
            if (firstCategory) {
                validationCategoryBtns[0].classList.add('active');
                showCategoryContent(firstCategory);
            }
        }
    }
    
    /**
     * Sets up modal interaction handlers
     */
    function setupModalHandlers() {
        // Handle validation button clicks (using event delegation)
        document.addEventListener('click', function(event) {
            // Check if clicked element is a validation button or contains one
            const validateBtn = event.target.closest('.validate-btn');
            if (validateBtn) {
                const calculationType = validateBtn.getAttribute('data-calculation');
                validateCalculation(calculationType);
            }
            
            // Check if clicked element is a calculation detail link
            const detailLink = event.target.closest('.calculation-detail-link');
            if (detailLink) {
                const detailId = detailLink.getAttribute('data-detail');
                showCalculationDetail(detailId);
                event.preventDefault();
            }
            
            // Check if clicked element is a regulation link
            const regulationLink = event.target.closest('.regulation-link');
            if (regulationLink) {
                const regulationType = regulationLink.getAttribute('data-regulation');
                showRegulatoryReference(regulationType);
                event.preventDefault();
            }
        });
        
        // Close calculation detail modal handler
        const closeBtn = document.getElementById('closeCalculationDetail');
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                const modal = document.getElementById('calculationDetailModal');
                if (modal) {
                    modal.hidden = true;
                }
            });
        }
    }
    
    /**
     * Shows content for a specific validation category
     * @param {string} category - The validation category to show content for
     */
    function showCategoryContent(category) {
        // Store active category
        activeCategory = category;
        
        // Get the content container
        const contentContainer = document.getElementById('validationCategoryContent');
        if (!contentContainer) {
            console.error('Validation content container not found');
            return;
        }
        
        // Get the appropriate template based on category
        let contentHTML = '';
        
        switch (category) {
            case 'etr':
                contentHTML = createETRValidationContent();
                break;
            case 'sbie':
                contentHTML = createSBIEValidationContent();
                break;
            case 'safeharbor':
                contentHTML = createSafeHarborValidationContent();
                break;
            case 'topup':
                contentHTML = createTopUpValidationContent();
                break;
            case 'adjustments':
                contentHTML = createAdjustmentsValidationContent();
                break;
            default:
                console.warn(`Unknown validation category: ${category}`);
                return;
        }
        
        // Set the content with a fade effect
        contentContainer.style.opacity = '0';
        setTimeout(() => {
            contentContainer.innerHTML = contentHTML;
            contentContainer.style.opacity = '1';
        }, 50);
    }
    
    /**
     * Shows calculation detail in the modal
     * @param {string} detailId - ID of the calculation detail to show
     */
    function showCalculationDetail(detailId) {
        const modal = document.getElementById('calculationDetailModal');
        if (!modal) {
            console.error('Calculation detail modal not found');
            return;
        }
        
        // Set title for accessibility
        const titleElement = document.getElementById('calculation-detail-title');
        if (titleElement) {
            let title = 'Calculation Details';
            
            if (detailId === 'etr_calculation') {
                title = 'ETR Calculation Details';
            } else if (detailId === 'topup_tax') {
                title = 'Top-Up Tax Calculation Details';
            } else if (detailId === 'safe_harbor') {
                title = 'Safe Harbor Calculation Details';
            } else if (detailId === 'sbie_calculation') {
                title = 'SBIE Calculation Details';
            } else if (detailId === 'globe_income') {
                title = 'GloBE Income Calculation Details';
            }
            
            titleElement.textContent = title;
        }
        
        // Hide all calculation details
        const detailElements = modal.querySelectorAll('.calculation-detail');
        detailElements.forEach(el => {
            el.hidden = true;
        });
        
        // Show the requested detail
        const detailElement = document.getElementById(detailId);
        if (detailElement) {
            detailElement.hidden = false;
            modal.hidden = false;
        } else {
            console.error(`Calculation detail element not found for ID: ${detailId}`);
        }
    }
    
    /**
     * Shows regulatory reference in a modal
     * @param {string} regulationType - Type of regulation to show references for
     */
    function showRegulatoryReference(regulationType) {
        // Ensure TaxAnomalyDetector is available
        if (typeof window.TaxAnomalyDetector === 'undefined') {
            console.error('TaxAnomalyDetector not available');
            alert('Regulatory reference not available. TaxAnomalyDetector not loaded.');
            return;
        }
        
        // Create a temporary detector to get the reference
        const detector = new window.TaxAnomalyDetector();
        const reference = detector.getRegulatoryReference(regulationType);
        
        if (!reference || !reference.article) {
            console.error('Regulatory reference not found for:', regulationType);
            return;
        }
        
        // Create a modal to display the regulatory reference
        const modalElement = document.createElement('div');
        modalElement.className = 'modal';
        modalElement.setAttribute('role', 'dialog');
        modalElement.setAttribute('aria-modal', 'true');
        
        const modalHTML = `
            <div class="modal-content">
                <button class="close-modal" aria-label="Close regulatory reference">&times;</button>
                <h2 class="detail-title">${reference.article}</h2>
                <div class="regulatory-text">
                    <p>${reference.text}</p>
                </div>
                ${reference.additionalArticles ? `
                <div class="detail-section">
                    <h3>Related Provisions</h3>
                    <div class="regulatory-text">
                        ${reference.additionalArticles.map(art => `
                            <div class="provision-item">
                                <p><strong>${art.article}:</strong> ${art.text}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
                ` : ''}
            </div>
        `;
        
        modalElement.innerHTML = modalHTML;
        
        // Add event listener to close on background click or close button
        modalElement.addEventListener('click', (event) => {
            if (event.target === modalElement || event.target.classList.contains('close-modal')) {
                modalElement.remove();
            }
        });
        
        // Add ESC key handling
        const handleEsc = (event) => {
            if (event.key === 'Escape') {
                modalElement.remove();
                document.removeEventListener('keydown', handleEsc);
            }
        };
        document.addEventListener('keydown', handleEsc);
        
        document.body.appendChild(modalElement);
    }
    
    /**
     * Validates a calculation with a specific entity
     * @param {string} calculationType - Type of calculation to validate
     */
    function validateCalculation(calculationType) {
        // Ensure TaxAnomalyDetector is available
        if (typeof window.TaxAnomalyDetector === 'undefined') {
            console.error('TaxAnomalyDetector not available');
            alert('Validation not available. TaxAnomalyDetector not loaded.');
            return;
        }
        
        // Ensure SchrodersHFMData is available
        if (typeof window.SchrodersHFMData === 'undefined') {
            console.error('SchrodersHFMData not available');
            alert('Validation not available. Entity data not loaded.');
            return;
        }
        
        // Get an entity to validate (Luxembourg entity for example)
        const entities = window.SchrodersHFMData.getAllEntities();
        const entity = entities.find(e => e.Jurisdiction === 'Luxembourg') || entities[0];
        
        if (!entity) {
            console.error('No entity found for validation');
            alert('Validation not available. No entity found for validation.');
            return;
        }
        
        // Create a detector instance
        const detector = new window.TaxAnomalyDetector();
        
        // Perform validation
        const validationResult = detector.validateCalculation(calculationType, entity);
        
        // Create result modal
        showValidationResult(validationResult, calculationType, entity);
    }
    
    /**
     * Shows validation result in a modal
     * @param {Object} result - Validation result
     * @param {string} calculationType - Type of calculation
     * @param {Object} entity - Entity data
     */
    function showValidationResult(result, calculationType, entity) {
        // Format values for display
        const formatValue = (value) => {
            if (typeof value === 'number') {
                if (value < 1) {
                    return (value * 100).toFixed(1) + '%';
                } else {
                    return '$' + (value / 1000000).toFixed(1) + 'M';
                }
            }
            return value !== undefined ? value.toString() : 'undefined';
        };
        
        // Create modal element
        const modalElement = document.createElement('div');
        modalElement.className = 'modal';
        modalElement.setAttribute('role', 'dialog');
        modalElement.setAttribute('aria-modal', 'true');
        
        // Determine status for styling
        const statusClass = result.isValid ? 'value-success' : 'value-warning';
        const statusBackgroundClass = result.isValid ? 'bg-success' : 'bg-error';
        
        // Create modal content based on validation result
        const modalHTML = `
            <div class="modal-content">
                <button class="close-modal" aria-label="Close validation result">&times;</button>
                <h2 class="detail-title">Validation Result: ${calculationType.toUpperCase()}</h2>
                
                <div class="detail-section ${statusBackgroundClass}">
                    <p class="validation-status ${statusClass}">
                        ${result.isValid ? '✓ Calculation is valid' : '✗ Calculation has issues'}
                    </p>
                </div>
                
                <div class="detail-section">
                    <h3>Entity Information</h3>
                    <div class="calculation-values">
                        <div class="value-row">
                            <div class="value-label">Entity:</div>
                            <div class="value-amount">${entity.name}</div>
                        </div>
                        <div class="value-row">
                            <div class="value-label">Jurisdiction:</div>
                            <div class="value-amount">${entity.Jurisdiction}</div>
                        </div>
                    </div>
                </div>
                
                ${result.calculatedValue !== undefined ? `
                <div class="detail-section">
                    <h3>Calculation Results</h3>
                    <div class="calculation-values">
                        <div class="value-row">
                            <div class="value-label">Calculated Value:</div>
                            <div class="value-amount">${formatValue(result.calculatedValue)}</div>
                        </div>
                        <div class="value-row">
                            <div class="value-label">Reported Value:</div>
                            <div class="value-amount">${formatValue(result.reportedValue)}</div>
                        </div>
                        ${result.difference !== undefined ? `
                        <div class="value-row">
                            <div class="value-label">Difference:</div>
                            <div class="value-amount">${formatValue(result.difference)}</div>
                        </div>` : ''}
                    </div>
                </div>
                ` : ''}
                
                ${result.errors && result.errors.length > 0 ? `
                <div class="detail-section error-section">
                    <h3>Errors</h3>
                    <ul class="validation-error-list">
                        ${result.errors.map(error => `<li>${error}</li>`).join('')}
                    </ul>
                </div>
                ` : ''}
                
                ${result.warnings && result.warnings.length > 0 ? `
                <div class="detail-section warning-section">
                    <h3>Warnings</h3>
                    <ul class="validation-warning-list">
                        ${result.warnings.map(warning => `<li>${warning}</li>`).join('')}
                    </ul>
                </div>
                ` : ''}
                
                <div class="detail-actions">
                    <button class="btn" aria-label="Close result">Close</button>
                </div>
            </div>
        `;
        
        modalElement.innerHTML = modalHTML;
        
        // Add event listeners for closing
        modalElement.addEventListener('click', (event) => {
            if (event.target === modalElement || 
                event.target.classList.contains('close-modal') || 
                event.target.classList.contains('btn')) {
                modalElement.remove();
            }
        });
        
        // Add ESC key handling
        const handleEsc = (event) => {
            if (event.key === 'Escape') {
                modalElement.remove();
                document.removeEventListener('keydown', handleEsc);
            }
        };
        document.addEventListener('keydown', handleEsc);
        
        document.body.appendChild(modalElement);
    }
    
    // Template generators for validation content
    
    /**
     * Creates ETR validation content
     * @returns {string} HTML content
     */
    function createETRValidationContent() {
        return `
        <div class="panel">
            <div class="panel-header">
                <h2 class="panel-title">ETR Calculation Validation</h2>
            </div>
            
            <div class="validation-container">
                <div class="detail-section">
                    <h3>Regulatory Reference</h3>
                    <p><strong>Article 5.1 of the OECD Model Rules:</strong> "The effective tax rate of a jurisdiction is the total adjusted covered taxes of the constituent entities located in the jurisdiction divided by the net GloBE income of the jurisdiction for the fiscal year."</p>
                    <div class="regulatory-link-container">
                        <a href="#" class="regulation-link" data-regulation="etr">View Full Regulatory Text</a>
                    </div>
                </div>
                
                <div class="detail-section">
                    <h3>Formula Implementation</h3>
                    <div class="formula-code">
                        Jurisdictional ETR = Adjusted Covered Taxes / Net GloBE Income
                    </div>
                </div>
                
                <div class="component-grid">
                    <div class="component-column">
                        <h3>Components</h3>
                        <ul class="component-list">
                            <li class="component-item">
                                <div class="component-row">
                                    <span class="component-label">Adjusted Covered Taxes:</span>
                                    <span class="component-value">$12.6M</span>
                                </div>
                                <div class="component-link">
                                    <a href="#" class="calculation-detail-link" data-detail="covered_taxes">View Calculation</a>
                                </div>
                            </li>
                            <li class="component-item">
                                <div class="component-row">
                                    <span class="component-label">Net GloBE Income:</span>
                                    <span class="component-value">$98.3M</span>
                                </div>
                                <div class="component-link">
                                    <a href="#" class="calculation-detail-link" data-detail="globe_income">View Calculation</a>
                                </div>
                            </li>
                            <li class="component-result">
                                <div class="component-row">
                                    <span class="component-label">Jurisdictional ETR:</span>
                                    <span class="value-warning">12.8%</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                    
                    <div class="component-column">
                        <h3>Validation Checks</h3>
                        <ul class="validation-list">
                            <li class="validation-item">
                                <div class="validation-row">
                                    <span>Data Source Verification:</span>
                                    <span class="value-success">✓ Verified</span>
                                </div>
                            </li>
                            <li class="validation-item">
                                <div class="validation-row">
                                    <span>Formula Implementation:</span>
                                    <span class="value-success">✓ Correct</span>
                                </div>
                            </li>
                            <li class="validation-item">
                                <div class="validation-row">
                                    <span>Regulatory Compliance:</span>
                                    <span class="value-success">✓ Compliant</span>
                                </div>
                            </li>
                            <li class="validation-item">
                                <div class="validation-row">
                                    <span>Manual Validation:</span>
                                    <span class="value-warning">Pending Review</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
                
                <div class="detail-section">
                    <h3>Flow Diagram</h3>
                    <div class="diagram-container">
                        <svg width="800" height="300" viewBox="0 0 800 300" xmlns="http://www.w3.org/2000/svg">
                            <!-- Background -->
                            <rect x="0" y="0" width="800" height="300" fill="#f8f9fa" rx="8" ry="8" />
                            
                            <!-- Boxes for the ETR calculation flow -->
                            <rect x="100" y="60" width="200" height="60" rx="8" ry="8" fill="#e3f2fd" stroke="#0072ce" stroke-width="2" />
                            <rect x="100" y="180" width="200" height="60" rx="8" ry="8" fill="#e3f2fd" stroke="#0072ce" stroke-width="2" />
                            
                            <rect x="500" y="120" width="200" height="60" rx="8" ry="8" fill="#e8f5e9" stroke="#4caf50" stroke-width="2" />
                            
                            <!-- Labels -->
                            <text x="200" y="90" text-anchor="middle" font-family="Arial" font-size="14" fill="#003865">Adjusted Covered Taxes</text>
                            <text x="200" y="210" text-anchor="middle" font-family="Arial" font-size="14" fill="#003865">Net GloBE Income</text>
                            <text x="600" y="150" text-anchor="middle" font-family="Arial" font-size="14" fill="#003865">Jurisdictional ETR</text>
                            
                            <!-- Division symbol -->
                            <line x1="350" y1="130" x2="450" y2="130" stroke="#003865" stroke-width="2" />
                            <line x1="350" y1="150" x2="450" y2="150" stroke="#003865" stroke-width="2" />
                            
                            <!-- Connecting lines -->
                            <line x1="200" y1="120" x2="200" y2="150" stroke="#003865" stroke-width="2" stroke-dasharray="5,5" />
                            <line x1="300" y1="90" x2="350" y2="130" stroke="#003865" stroke-width="2" />
                            <line x1="300" y1="210" x2="350" y2="150" stroke="#003865" stroke-width="2" />
                            <line x1="450" y1="140" x2="500" y2="140" stroke="#003865" stroke-width="2" marker-end="url(#arrowhead)" />
                            
                            <!-- Arrowhead marker -->
                            <defs>
                                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
                                    <polygon points="0 0, 10 3.5, 0 7" fill="#003865" />
                                </marker>
                            </defs>
                            
                            <!-- Main formula -->
                            <rect x="150" y="260" width="500" height="30" rx="4" ry="4" fill="#fff" stroke="#ddd" stroke-width="1" />
                            <text x="400" y="280" text-anchor="middle" font-family="monospace" font-size="14" fill="#003865">Jurisdictional ETR = Adjusted Covered Taxes / Net GloBE Income</text>
                        </svg>
                    </div>
                </div>
                
                <div class="detail-actions">
                    <button class="btn validate-btn" data-calculation="etr" aria-label="Validate ETR calculation">Validate Calculation</button>
                    <button class="btn btn-outline" aria-label="Add comment to ETR calculation">Add Comment</button>
                </div>
            </div>
        </div>
        `;
    }
    
    /**
     * Creates SBIE validation content
     * @returns {string} HTML content
     */
    function createSBIEValidationContent() {
        return `
        <div class="panel">
            <div class="panel-header">
                <h2 class="panel-title">SBIE Calculation Validation</h2>
            </div>
            
            <div class="validation-container">
                <div class="detail-section">
                    <h3>Regulatory Reference</h3>
                    <p><strong>Article 5.3 of the OECD Model Rules:</strong> "The substance-based income exclusion for a jurisdiction is the sum of the payroll component and the tangible asset component for each constituent entity located in the jurisdiction."</p>
                    <div class="regulatory-link-container">
                        <a href="#" class="regulation-link" data-regulation="sbie">View Full Regulatory Text</a>
                    </div>
                </div>
                
                <div class="detail-section">
                    <h3>Formula Implementation</h3>
                    <div class="formula-code">
                        SBIE = (Payroll Costs × 5%) + (Carrying Value of Tangible Assets × 5%)
                    </div>
                </div>
                
                <div class="component-grid">
                    <div class="component-column">
                        <h3>Components</h3>
                        <ul class="component-list">
                            <li class="component-item">
                                <div class="component-row">
                                    <span class="component-label">Payroll Costs:</span>
                                    <span class="component-value">$152.4M</span>
                                </div>
                            </li>
                            <li class="component-item">
                                <div class="component-row">
                                    <span class="component-label">Payroll Component (5%):</span>
                                    <span class="component-value">$7.62M</span>
                                </div>
                            </li>
                            <li class="component-item">
                                <div class="component-row">
                                    <span class="component-label">Tangible Assets:</span>
                                    <span class="component-value">$141.6M</span>
                                </div>
                            </li>
                            <li class="component-item">
                                <div class="component-row">
                                    <span class="component-label">Tangible Assets Component (5%):</span>
                                    <span class="component-value">$7.08M</span>
                                </div>
                            </li>
                            <li class="component-result">
                                <div class="component-row">
                                    <span class="component-label">Total SBIE:</span>
                                    <span class="component-value">$14.7M</span>
                                </div>
                                <div class="component-link">
                                    <a href="#" class="calculation-detail-link" data-detail="sbie_calculation">View Full Calculation</a>
                                </div>
                            </li>
                        </ul>
                    </div>
                    
                    <div class="component-column">
                        <h3>Validation Checks</h3>
                        <ul class="validation-list">
                            <li class="validation-item">
                                <div class="validation-row">
                                    <span>Data Source Verification:</span>
                                    <span class="value-success">✓ Verified</span>
                                </div>
                            </li>
                            <li class="validation-item">
                                <div class="validation-row">
                                    <span>Formula Implementation:</span>
                                    <span class="value-success">✓ Correct</span>
                                </div>
                            </li>
                            <li class="validation-item">
                                <div class="validation-row">
                                    <span>Regulatory Compliance:</span>
                                    <span class="value-success">✓ Compliant</span>
                                </div>
                            </li>
                            <li class="validation-item">
                                <div class="validation-row">
                                    <span>Manual Validation:</span>
                                    <span class="value-warning">Pending Review</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
                
                <div class="detail-actions">
                    <button class="btn validate-btn" data-calculation="sbie" aria-label="Validate SBIE calculation">Validate Calculation</button>
                    <button class="btn btn-outline" aria-label="Add comment to SBIE calculation">Add Comment</button>
                </div>
            </div>
        </div>
        `;
    }
    
    /**
     * Creates Top-Up Tax validation content
     * @returns {string} HTML content
     */
    function createTopUpValidationContent() {
        return `
        <div class="panel">
            <div class="panel-header">
                <h2 class="panel-title">Top-Up Tax Calculation Validation</h2>
            </div>
            
            <div class="validation-container">
                <div class="detail-section">
                    <h3>Regulatory Reference</h3>
                    <p><strong>Article 5.2 of the OECD Model Rules:</strong> "The top-up tax percentage for a jurisdiction for a fiscal year is the positive percentage point difference between the minimum rate and the jurisdiction's effective tax rate."</p>
                    <div class="regulatory-link-container">
                        <a href="#" class="regulation-link" data-regulation="topup">View Full Regulatory Text</a>
                    </div>
                </div>
                
                <div class="detail-section">
                    <h3>Formula Implementation</h3>
                    <div class="formula-code">
                        Top-Up Tax = Top-Up Tax Percentage × (GloBE Income - Substance-Based Income Exclusion)
                    </div>
                </div>
                
                <div class="component-grid">
                    <div class="component-column">
                        <h3>Components</h3>
                        <ul class="component-list">
                            <li class="component-item">
                                <div class="component-row">
                                    <span class="component-label">Minimum ETR:</span>
                                    <span class="component-value">15.0%</span>
                                </div>
                            </li>
                            <li class="component-item">
                                <div class="component-row">
                                    <span class="component-label">Jurisdictional ETR:</span>
                                    <span class="component-value">12.8%</span>
                                </div>
                                <div class="component-link">
                                    <a href="#" class="calculation-detail-link" data-detail="etr_calculation">View Calculation</a>
                                </div>
                            </li>
                            <li class="component-item">
                                <div class="component-row">
                                    <span class="component-label">Top-Up Tax Percentage:</span>
                                    <span class="component-value">2.2%</span>
                                </div>
                            </li>
                            <li class="component-item">
                                <div class="component-row">
                                    <span class="component-label">GloBE Income:</span>
                                    <span class="component-value">$98.3M</span>
                                </div>
                            </li>
                            <li class="component-item">
                                <div class="component-row">
                                    <span class="component-label">SBIE:</span>
                                    <span class="component-value">$14.7M</span>
                                </div>
                            </li>
                            <li class="component-item">
                                <div class="component-row">
                                    <span class="component-label">GloBE Income Less SBIE:</span>
                                    <span class="component-value">$83.6M</span>
                                </div>
                            </li>
                            <li class="component-result">
                                <div class="component-row">
                                    <span class="component-label">Top-Up Tax:</span>
                                    <span class="component-value">$2.2M</span>
                                </div>
                                <div class="component-link">
                                    <a href="#" class="calculation-detail-link" data-detail="topup_tax">View Full Calculation</a>
                                </div>
                            </li>
                        </ul>
                    </div>
                    
                    <div class="component-column">
                        <h3>Validation Checks</h3>
                        <ul class="validation-list">
                            <li class="validation-item">
                                <div class="validation-row">
                                    <span>Data Source Verification:</span>
                                    <span class="value-success">✓ Verified</span>
                                </div>
                            </li>
                            <li class="validation-item">
                                <div class="validation-row">
                                    <span>Formula Implementation:</span>
                                    <span class="value-success">✓ Correct</span>
                                </div>
                            </li>
                            <li class="validation-item">
                                <div class="validation-row">
                                    <span>Regulatory Compliance:</span>
                                    <span class="value-success">✓ Compliant</span>
                                </div>
                            </li>
                            <li class="validation-item">
                                <div class="validation-row">
                                    <span>Manual Validation:</span>
                                    <span class="value-warning">Pending Review</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
                
                <div class="detail-actions">
                    <button class="btn validate-btn" data-calculation="topup" aria-label="Validate Top-Up Tax calculation">Validate Calculation</button>
                    <button class="btn btn-outline" aria-label="Add comment to Top-Up Tax calculation">Add Comment</button>
                </div>
            </div>
        </div>
        `;
    }
    
    /**
     * Creates Safe Harbor validation content
     * @returns {string} HTML content
     */
    function createSafeHarborValidationContent() {
        return `
        <div class="panel">
            <div class="panel-header">
                <h2 class="panel-title">Safe Harbor Rules Validation</h2>
            </div>
            
            <div class="validation-container">
                <div class="detail-section">
                    <h3>Regulatory Reference</h3>
                    <p><strong>OECD Pillar Two Safe Harbor Provisions:</strong> "The Safe Harbor provisions provide a simplified method to determine whether top-up tax is due in a jurisdiction, reducing compliance burden for MNE groups when certain conditions are met."</p>
                    <div class="regulatory-link-container">
                        <a href="#" class="regulation-link" data-regulation="safeharbor">View Full Regulatory Text</a>
                    </div>
                </div>
                
                <div class="detail-section">
                    <h3>Safe Harbor Tests</h3>
                    
                    <div class="test-container">
                        <div class="test-header">
                            <h4>De Minimis Test</h4>
                            <div class="formula-code">
                                Revenue < €10M and Profit < €1M
                            </div>
                        </div>
                        <div class="test-status">
                            <span>Entity Status:</span>
                            <span class="value-warning">Not Qualified - Above Thresholds</span>
                        </div>
                    </div>
                    
                    <div class="test-container">
                        <div class="test-header">
                            <h4>Routine Profits Test</h4>
                            <div class="formula-code">
                                Return on Tangible Assets and Payroll below specified margins
                            </div>
                        </div>
                        <div class="test-status">
                            <span>Entity Status:</span>
                            <span class="value-warning">Not Qualified - Returns Above Thresholds</span>
                        </div>
                    </div>
                    
                    <div class="test-container">
                        <div class="test-header">
                            <h4>Simplified ETR Test</h4>
                            <div class="formula-code">
                                Simplified ETR >= Minimum ETR (15%)
                            </div>
                        </div>
                        <div class="test-status">
                            <span>Entity Status:</span>
                            <span class="value-warning">Not Qualified - ETR 12.8% below 15%</span>
                        </div>
                        <div class="component-link">
                            <a href="#" class="calculation-detail-link" data-detail="safe_harbor">View Full Analysis</a>
                        </div>
                    </div>
                </div>
                
                <div class="detail-section">
                    <h3>Implementation Notes</h3>
                    <div class="implementation-notes">
                        <p>The Safe Harbor rules have been implemented according to the latest OECD guidelines. Each test evaluates whether the jurisdiction qualifies for simplified compliance procedures, potentially eliminating the need for top-up tax calculations.</p>
                        <p>For Luxembourg SARL, all three tests indicate that Safe Harbor provisions cannot be applied, and full Pillar Two calculations are required.</p>
                    </div>
                </div>
                
                <div class="detail-actions">
                    <button class="btn validate-btn" data-calculation="safeharbor" aria-label="Validate Safe Harbor calculation">Validate Calculation</button>
                    <button class="btn btn-outline" aria-label="Add comment to Safe Harbor calculation">Add Comment</button>
                </div>
            </div>
        </div>
        `;
    }
    
    /**
     * Creates GloBE Adjustments validation content
     * @returns {string} HTML content
     */
    function createAdjustmentsValidationContent() {
        return `
        <div class="panel">
            <div class="panel-header">
                <h2 class="panel-title">GloBE Adjustments Validation</h2>
            </div>
            
            <div class="validation-container">
                <div class="detail-section">
                    <h3>Regulatory Reference</h3>
                    <p><strong>Article 3 of the OECD Model Rules:</strong> "Various adjustments are made to the financial accounting net income or loss to arrive at the GloBE income or loss."</p>
                </div>

                <div class="detail-section">
                    <h3>Flow Diagram</h3>
                    <div class="diagram-container">
                        <svg width="800" height="340" viewBox="0 0 800 340" xmlns="http://www.w3.org/2000/svg">
                            <!-- Background -->
                            <rect x="0" y="0" width="800" height="340" fill="#f8f9fa" rx="8" ry="8" />
                            
                            <!-- Boxes for the calculation flow -->
                            <rect x="50" y="60" width="150" height="50" rx="8" ry="8" fill="#e3f2fd" stroke="#0072ce" stroke-width="2" />
                            <rect x="50" y="150" width="150" height="50" rx="8" ry="8" fill="#e3f2fd" stroke="#0072ce" stroke-width="2" />
                            <rect x="240" y="100" width="150" height="60" rx="8" ry="8" fill="#fff3e0" stroke="#ff9800" stroke-width="2" />
                            
                            <rect x="50" y="240" width="150" height="50" rx="8" ry="8" fill="#e3f2fd" stroke="#0072ce" stroke-width="2" />
                            <rect x="240" y="240" width="150" height="50" rx="8" ry="8" fill="#e3f2fd" stroke="#0072ce" stroke-width="2" />
                            <rect x="425" y="240" width="150" height="50" rx="8" ry="8" fill="#fff3e0" stroke="#ff9800" stroke-width="2" />
                            
                            <rect x="425" y="110" width="150" height="50" rx="8" ry="8" fill="#fff3e0" stroke="#ff9800" stroke-width="2" />
                            <rect x="610" y="175" width="150" height="60" rx="8" ry="8" fill="#e8f5e9" stroke="#4caf50" stroke-width="2" />
                            
                            <!-- Labels -->
                            <text x="125" y="90" text-anchor="middle" font-family="Arial" font-size="14" fill="#003865">Min Rate (15%)</text>
                            <text x="125" y="180" text-anchor="middle" font-family="Arial" font-size="14" fill="#003865">Entity ETR</text>
                            <text x="315" y="135" text-anchor="middle" font-family="Arial" font-size="14" fill="#003865">Subtract</text>
                            
                            <text x="125" y="270" text-anchor="middle" font-family="Arial" font-size="14" fill="#003865">GloBE Income</text>
                            <text x="315" y="270" text-anchor="middle" font-family="Arial" font-size="14" fill="#003865">SBIE</text>
                            <text x="500" y="270" text-anchor="middle" font-family="Arial" font-size="14" fill="#003865">Excess Profit</text>
                            
                            <text x="500" y="140" text-anchor="middle" font-family="Arial" font-size="14" fill="#003865">Top-Up %</text>
                            <text x="685" y="205" text-anchor="middle" font-family="Arial" font-size="14" fill="#003865">Top-Up Tax</text>
                            
                            <!-- Arrows -->
                            <path d="M200 85 L240 130" stroke="#666" stroke-width="2" fill="none" marker-end="url(#arrowhead)" />
                            <path d="M200 175 L240 130" stroke="#666" stroke-width="2" fill="none" marker-end="url(#arrowhead)" />
                            <path d="M390 130 L425 135" stroke="#666" stroke-width="2" fill="none" marker-end="url(#arrowhead)" />
                            
                            <path d="M200 265 L240 265" stroke="#666" stroke-width="2" fill="none" marker-end="url(#arrowhead)" />
                            <path d="M390 265 L425 265" stroke="#666" stroke-width="2" fill="none" marker-end="url(#arrowhead)" />
                            
                            <path d="M500 190 L500 240" stroke="#666" stroke-width="2" fill="none" marker-end="url(#arrowhead)" />
                            <path d="M575 265 L610 205" stroke="#666" stroke-width="2" fill="none" marker-end="url(#arrowhead)" />
                            <path d="M575 135 L610 175" stroke="#666" stroke-width="2" fill="none" marker-end="url(#arrowhead)" />
                            
                            <!-- Arrowhead marker -->
                            <defs>
                                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
                                    <polygon points="0 0, 10 3.5, 0 7" fill="#666" />
                                </marker>
                            </defs>
                            
                            <!-- Formula -->
                            <rect x="170" y="310" width="460" height="30" rx="4" ry="4" fill="#fff" stroke="#ddd" stroke-width="1" />
                            <text x="400" y="330" text-anchor="middle" font-family="monospace" font-size="14" fill="#003865">Top-Up Tax = Top-Up % × (GloBE Income - SBIE)</text>
                        </svg>
                    </div>
                </div>
                
                <div class="table-responsive">
                    <table class="adjustments-table">
                        <thead>
                            <tr>
                                <th scope="col">Adjustment Type</th>
                                <th scope="col">Amount</th>
                                <th scope="col">Regulatory Base</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Net tax expense adjustments</td>
                                <td class="align-right">-$4.2M</td>
                                <td>Article 3.2.1</td>
                            </tr>
                            <tr>
                                <td>Excluded dividends</td>
                                <td class="align-right">-$3.1M</td>
                                <td>Article 3.2.2</td>
                            </tr>
                            <tr>
                                <td>Excluded equity gains/losses</td>
                                <td class="align-right">-$1.5M</td>
                                <td>Article 3.2.3</td>
                            </tr>
                            <tr>
                                <td>Policy disallowed expenses</td>
                                <td class="align-right">-$1.8M</td>
                                <td>Article 3.2.5</td>
                            </tr>
                            <tr>
                                <td>Prior period errors/changes</td>
                                <td class="align-right">+$0.3M</td>
                                <td>Article 3.2.6</td>
                            </tr>
                            <tr class="total-row">
                                <td>Total Adjustments</td>
                                <td class="align-right">-$10.3M</td>
                                <td></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                
                <div class="globe-income-calculation">
                    <h4>GloBE Income Calculation</h4>
                    <div class="calculation-values">
                        <div class="value-row">
                            <div class="value-label">Financial Accounting Net Income:</div>
                            <div class="value-amount">$108.6M</div>
                        </div>
                        <div class="value-row">
                            <div class="value-label">Total Adjustments:</div>
                            <div class="value-amount">-$10.3M</div>
                        </div>
                        <div class="value-row result-row">
                            <div class="value-label">GloBE Income:</div>
                            <div class="value-amount">$98.3M</div>
                        </div>
                    </div>
                </div>
                
                <div class="detail-actions">
                    <button class="btn validate-btn" data-calculation="adjustments" aria-label="Validate GloBE adjustments">Validate Adjustments</button>
                    <button class="btn btn-outline" aria-label="Add comment to GloBE adjustments">Add Comment</button>
                </div>
            </div>
        </div>
        `;
    }
    
    // Public API
    return {
        initialize,
        showCategoryContent
    };
})();

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    ValidationHandler.initialize();
});