/**
 * Mock Schroders HFM Data for Pillar Two Dashboard
 * 
 * This file provides realistic mock data for Schroders entities based on
 * publicly available information, adapted for Pillar Two tax purposes.
 * 
 * Sources:
 * - Schroders Annual Report 2023
 * - Public regulatory filings
 * - Estimated data where not publicly available
 */

const SchrodersHFMData = (function() {
    // Entity data
    const entities = [
        // EMEA Entities
        {
            EntityID: 1,
            name: "Schroder Investment Management Ltd",
            Jurisdiction: "United Kingdom",
            JurisdictionalETR: 0.25,
            GloBEIncome: 425000000,
            TopUpTax: 0,
            SubstanceBasedIncomeExclusion: 58500000,
            TotalTaxesPayable: 106250000,
            payrollCosts: 850000000,
            tangibleAssets: 320000000,
            safeHarbor: true,
            financialNetIncome: 432000000,
            adjustments: [
                { type: 'Tax expense adjustments', amount: -7000000 }
            ]
        },
        {
            EntityID: 2,
            name: "Schroder & Co. Limited",
            Jurisdiction: "United Kingdom",
            JurisdictionalETR: 0.23,
            GloBEIncome: 67000000,
            TopUpTax: 0,
            SubstanceBasedIncomeExclusion: 12500000,
            TotalTaxesPayable: 15410000,
            payrollCosts: 180000000,
            tangibleAssets: 70000000,
            safeHarbor: true,
            financialNetIncome: 71000000,
            adjustments: [
                { type: 'Excluded dividends', amount: -4000000 }
            ]
        },
        {
            EntityID: 3,
            name: "Schroder Investment Management (Luxembourg) S.A.",
            Jurisdiction: "Luxembourg",
            JurisdictionalETR: 0.124,
            GloBEIncome: 106400000,
            TopUpTax: 2800000,
            SubstanceBasedIncomeExclusion: 17800000,
            TotalTaxesPayable: 13200000,
            payrollCosts: 205000000,
            tangibleAssets: 151000000,
            safeHarbor: false,
            financialNetIncome: 110200000,
            adjustments: [
                { type: 'Policy disallowed expenses', amount: -3800000 }
            ]
        },
        {
            EntityID: 4,
            name: "Schroder Investment Management (Ireland) Limited",
            Jurisdiction: "Ireland",
            JurisdictionalETR: 0.155,
            GloBEIncome: 82500000,
            TopUpTax: 0,
            SubstanceBasedIncomeExclusion: 13400000,
            TotalTaxesPayable: 12790000,
            payrollCosts: 198000000,
            tangibleAssets: 70000000,
            safeHarbor: true,
            financialNetIncome: 86100000,
            adjustments: [
                { type: 'Net tax expense', amount: -3600000 }
            ]
        },
        {
            EntityID: 5,
            name: "Schroder Investment Management (Switzerland) AG",
            Jurisdiction: "Switzerland",
            JurisdictionalETR: 0.19,
            GloBEIncome: 84500000,
            TopUpTax: 0,
            SubstanceBasedIncomeExclusion: 16200000,
            TotalTaxesPayable: 16055000,
            payrollCosts: 220000000,
            tangibleAssets: 104000000,
            safeHarbor: true,
            financialNetIncome: 88700000,
            adjustments: [
                { type: 'Excluded equity gains', amount: -4200000 }
            ]
        },
        {
            EntityID: 6,
            name: "Schroder Investment Management Middle East Limited",
            Jurisdiction: "United Arab Emirates",
            JurisdictionalETR: 0.05,
            GloBEIncome: 42500000,
            TopUpTax: 4250000,
            SubstanceBasedIncomeExclusion: 2200000,
            TotalTaxesPayable: 2125000,
            payrollCosts: 32000000,
            tangibleAssets: 12000000,
            safeHarbor: false,
            financialNetIncome: 44300000,
            adjustments: [
                { type: 'Tax-exempt income', amount: -1800000 }
            ]
        },
        {
            EntityID: 7,
            name: "Schroders Capital Management (Switzerland) AG",
            Jurisdiction: "Switzerland",
            JurisdictionalETR: 0.17,
            GloBEIncome: 38500000,
            TopUpTax: 0,
            SubstanceBasedIncomeExclusion: 7200000,
            TotalTaxesPayable: 6545000,
            payrollCosts: 85000000,
            tangibleAssets: 59000000,
            safeHarbor: true,
            financialNetIncome: 40100000,
            adjustments: [
                { type: 'Prior period errors', amount: -1600000 }
            ]
        },
        {
            EntityID: 8,
            name: "BlueOrchard Finance AG",
            Jurisdiction: "Switzerland",
            JurisdictionalETR: 0.16,
            GloBEIncome: 17300000,
            TopUpTax: 0,
            SubstanceBasedIncomeExclusion: 3100000,
            TotalTaxesPayable: 2768000,
            payrollCosts: 42000000,
            tangibleAssets: 20000000,
            safeHarbor: true,
            financialNetIncome: 18100000,
            adjustments: [
                { type: 'Net tax expense', amount: -800000 }
            ]
        },
        {
            EntityID: 9,
            name: "Schroder AIDA SAS",
            Jurisdiction: "France",
            JurisdictionalETR: 0.28,
            GloBEIncome: 14800000,
            TopUpTax: 0,
            SubstanceBasedIncomeExclusion: 2900000,
            TotalTaxesPayable: 4144000,
            payrollCosts: 38000000,
            tangibleAssets: 20000000,
            safeHarbor: true,
            financialNetIncome: 15400000,
            adjustments: [
                { type: 'Tax base differences', amount: -600000 }
            ]
        },
        {
            EntityID: 10,
            name: "Schroder Investment Management GmbH",
            Jurisdiction: "Germany",
            JurisdictionalETR: 0.29,
            GloBEIncome: 23600000,
            TopUpTax: 0,
            SubstanceBasedIncomeExclusion: 4100000,
            TotalTaxesPayable: 6844000,
            payrollCosts: 52000000,
            tangibleAssets: 30000000,
            safeHarbor: true,
            financialNetIncome: 24500000,
            adjustments: [
                { type: 'Non-deductible expenses', amount: -900000 }
            ]
        },
        
        // APAC Entities
        {
            EntityID: 11,
            name: "Schroder Investment Management (Singapore) Ltd",
            Jurisdiction: "Singapore",
            JurisdictionalETR: 0.13,
            GloBEIncome: 196000000,
            TopUpTax: 3920000,
            SubstanceBasedIncomeExclusion: 22000000,
            TotalTaxesPayable: 25480000,
            payrollCosts: 350000000,
            tangibleAssets: 90000000,
            safeHarbor: false,
            financialNetIncome: 202000000,
            adjustments: [
                { type: 'Excluded dividends', amount: -6000000 }
            ]
        },
        {
            EntityID: 12,
            name: "Schroder Investment Management (Hong Kong) Limited",
            Jurisdiction: "Hong Kong",
            JurisdictionalETR: 0.128,
            GloBEIncome: 154000000,
            TopUpTax: 3388000,
            SubstanceBasedIncomeExclusion: 19500000,
            TotalTaxesPayable: 19712000,
            payrollCosts: 230000000,
            tangibleAssets: 160000000,
            safeHarbor: false,
            financialNetIncome: 159000000,
            adjustments: [
                { type: 'Tax concessions', amount: -5000000 }
            ]
        },
        {
            EntityID: 13,
            name: "Schroder Investment Management (Japan) Limited",
            Jurisdiction: "Japan",
            JurisdictionalETR: 0.31,
            GloBEIncome: 132000000,
            TopUpTax: 0,
            SubstanceBasedIncomeExclusion: 24500000,
            TotalTaxesPayable: 40920000,
            payrollCosts: 310000000,
            tangibleAssets: 180000000,
            safeHarbor: true,
            financialNetIncome: 136500000,
            adjustments: [
                { type: 'Local GAAP adjustments', amount: -4500000 }
            ]
        },
        {
            EntityID: 14,
            name: "Schroder Investment Management (Australia) Limited",
            Jurisdiction: "Australia",
            JurisdictionalETR: 0.28,
            GloBEIncome: 123000000,
            TopUpTax: 0,
            SubstanceBasedIncomeExclusion: 21000000,
            TotalTaxesPayable: 34440000,
            payrollCosts: 260000000,
            tangibleAssets: 160000000,
            safeHarbor: true,
            financialNetIncome: 127800000,
            adjustments: [
                { type: 'Non-taxable income', amount: -4800000 }
            ]
        },
        {
            EntityID: 15,
            name: "Schroders Capital Management (China) Limited",
            Jurisdiction: "China",
            JurisdictionalETR: 0.22,
            GloBEIncome: 46800000,
            TopUpTax: 0,
            SubstanceBasedIncomeExclusion: 8500000,
            TotalTaxesPayable: 10296000,
            payrollCosts: 120000000,
            tangibleAssets: 50000000,
            safeHarbor: true,
            financialNetIncome: 48500000,
            adjustments: [
                { type: 'Permanent differences', amount: -1700000 }
            ]
        },
        {
            EntityID: 16,
            name: "SPX Credit Management Pte Ltd",
            Jurisdiction: "Singapore",
            JurisdictionalETR: 0.14,
            GloBEIncome: 18500000,
            TopUpTax: 185000,
            SubstanceBasedIncomeExclusion: 3400000,
            TotalTaxesPayable: 2590000,
            payrollCosts: 48000000,
            tangibleAssets: 20000000,
            safeHarbor: false,
            financialNetIncome: 19200000,
            adjustments: [
                { type: 'Tax incentives', amount: -700000 }
            ]
        },
        {
            EntityID: 17,
            name: "Schroder Investment Management (Taiwan) Limited",
            Jurisdiction: "Taiwan",
            JurisdictionalETR: 0.19,
            GloBEIncome: 16800000,
            TopUpTax: 0,
            SubstanceBasedIncomeExclusion: 2900000,
            TotalTaxesPayable: 3192000,
            payrollCosts: 42000000,
            tangibleAssets: 16000000,
            safeHarbor: true,
            financialNetIncome: 17400000,
            adjustments: [
                { type: 'Tax base differences', amount: -600000 }
            ]
        },
        
        // Americas Entities
        {
            EntityID: 18,
            name: "Schroder Investment Management North America Inc.",
            Jurisdiction: "United States",
            JurisdictionalETR: 0.26,
            GloBEIncome: 435000000,
            TopUpTax: 0,
            SubstanceBasedIncomeExclusion: 75000000,
            TotalTaxesPayable: 113100000,
            payrollCosts: 920000000,
            tangibleAssets: 580000000,
            safeHarbor: true,
            financialNetIncome: 442000000,
            adjustments: [
                { type: 'State tax differences', amount: -7000000 }
            ]
        },
        {
            EntityID: 19,
            name: "Schroder Fund Advisors LLC",
            Jurisdiction: "United States",
            JurisdictionalETR: 0.25,
            GloBEIncome: 78500000,
            TopUpTax: 0,
            SubstanceBasedIncomeExclusion: 12800000,
            TotalTaxesPayable: 19625000,
            payrollCosts: 180000000,
            tangibleAssets: 76000000,
            safeHarbor: true,
            financialNetIncome: 80300000,
            adjustments: [
                { type: 'Disallowed expenses', amount: -1800000 }
            ]
        },
        {
            EntityID: 20,
            name: "Schroders Capital Management (US) Inc.",
            Jurisdiction: "United States",
            JurisdictionalETR: 0.24,
            GloBEIncome: 56400000,
            TopUpTax: 0,
            SubstanceBasedIncomeExclusion: 9500000,
            TotalTaxesPayable: 13536000,
            payrollCosts: 125000000,
            tangibleAssets: 65000000,
            safeHarbor: true,
            financialNetIncome: 58200000,
            adjustments: [
                { type: 'Temporary differences', amount: -1800000 }
            ]
        },
        {
            EntityID: 21,
            name: "Schroder Investment Management (Canada) Limited",
            Jurisdiction: "Canada",
            JurisdictionalETR: 0.27,
            GloBEIncome: 42300000,
            TopUpTax: 0,
            SubstanceBasedIncomeExclusion: 7200000,
            TotalTaxesPayable: 11421000,
            payrollCosts: 95000000,
            tangibleAssets: 49000000,
            safeHarbor: true,
            financialNetIncome: 43500000,
            adjustments: [
                { type: 'Provincial tax adjustments', amount: -1200000 }
            ]
        },
        {
            EntityID: 22,
            name: "Schroder Management (Bermuda) Limited",
            Jurisdiction: "Bermuda",
            JurisdictionalETR: 0.01,
            GloBEIncome: 52400000,
            TopUpTax: 7336000,
            SubstanceBasedIncomeExclusion: 70000,
            TotalTaxesPayable: 524000,
            payrollCosts: 800000,
            tangibleAssets: 600000,
            safeHarbor: false,
            financialNetIncome: 53200000,
            adjustments: [
                { type: 'Tax-exempt income', amount: -800000 }
            ]
        },
        {
            EntityID: 23,
            name: "Schroder Investment Management (Cayman) Limited",
            Jurisdiction: "Cayman Islands",
            JurisdictionalETR: 0.005,
            GloBEIncome: 68500000,
            TopUpTax: 9935000,
            SubstanceBasedIncomeExclusion: 80000,
            TotalTaxesPayable: 342500,
            payrollCosts: 1200000,
            tangibleAssets: 400000,
            safeHarbor: false,
            financialNetIncome: 69300000,
            adjustments: [
                { type: 'Excluded dividends', amount: -800000 }
            ]
        },
        {
            EntityID: 24,
            name: "Schroder Aida Brasil Gestao de Recursos Ltda",
            Jurisdiction: "Brazil",
            JurisdictionalETR: 0.32,
            GloBEIncome: 14600000,
            TopUpTax: 0,
            SubstanceBasedIncomeExclusion: 2800000,
            TotalTaxesPayable: 4672000,
            payrollCosts: 38000000,
            tangibleAssets: 18000000,
            safeHarbor: true,
            financialNetIncome: 15100000,
            adjustments: [
                { type: 'Local GAAP differences', amount: -500000 }
            ]
        },
        {
            EntityID: 25,
            name: "Schroder Investment Management Mexico S.A. de C.V.",
            Jurisdiction: "Mexico",
            JurisdictionalETR: 0.30,
            GloBEIncome: 12800000,
            TopUpTax: 0,
            SubstanceBasedIncomeExclusion: 2400000,
            TotalTaxesPayable: 3840000,
            payrollCosts: 32000000,
            tangibleAssets: 16000000,
            safeHarbor: true,
            financialNetIncome: 13200000,
            adjustments: [
                { type: 'Inflation adjustments', amount: -400000 }
            ]
        },
        
        // Additional Entities
        {
            EntityID: 26,
            name: "Schroders Capital Management (Jersey) Limited",
            Jurisdiction: "Jersey",
            JurisdictionalETR: 0.09,
            GloBEIncome: 24500000,
            TopUpTax: 1470000,
            SubstanceBasedIncomeExclusion: 3400000,
            TotalTaxesPayable: 2205000,
            payrollCosts: 45000000,
            tangibleAssets: 23000000,
            safeHarbor: false,
            financialNetIncome: 25300000,
            adjustments: [
                { type: 'Exempt income', amount: -800000 }
            ]
        },
        {
            EntityID: 27,
            name: "Schroder Property Investment Management (Italy) Srl",
            Jurisdiction: "Italy",
            JurisdictionalETR: 0.24,
            GloBEIncome: 18600000,
            TopUpTax: 0,
            SubstanceBasedIncomeExclusion: 3200000,
            TotalTaxesPayable: 4464000,
            payrollCosts: 42000000,
            tangibleAssets: 22000000,
            safeHarbor: true,
            financialNetIncome: 19200000,
            adjustments: [
                { type: 'Local tax incentives', amount: -600000 }
            ]
        },
        {
            EntityID: 28,
            name: "SPX Korea Co., Ltd.",
            Jurisdiction: "South Korea",
            JurisdictionalETR: 0.22,
            GloBEIncome: 21400000,
            TopUpTax: 0,
            SubstanceBasedIncomeExclusion: 3700000,
            TotalTaxesPayable: 4708000,
            payrollCosts: 48000000,
            tangibleAssets: 26000000,
            safeHarbor: true,
            financialNetIncome: 22000000,
            adjustments: [
                { type: 'Timing differences', amount: -600000 }
            ]
        },
        {
            EntityID: 29,
            name: "Schroder Investment Management (India) Private Limited",
            Jurisdiction: "India",
            JurisdictionalETR: 0.25,
            GloBEIncome: 15800000,
            TopUpTax: 0,
            SubstanceBasedIncomeExclusion: 2900000,
            TotalTaxesPayable: 3950000,
            payrollCosts: 38000000,
            tangibleAssets: 20000000,
            safeHarbor: true,
            financialNetIncome: 16300000,
            adjustments: [
                { type: 'Disallowed expenses', amount: -500000 }
            ]
        },
        {
            EntityID: 30,
            name: "Adveq Management (Dubai) Ltd",
            Jurisdiction: "United Arab Emirates",
            JurisdictionalETR: 0.04,
            GloBEIncome: 16200000,
            TopUpTax: 1782000,
            SubstanceBasedIncomeExclusion: 1400000,
            TotalTaxesPayable: 648000,
            payrollCosts: 18000000,
            tangibleAssets: 10000000,
            safeHarbor: false,
            financialNetIncome: 16800000,
            adjustments: [
                { type: 'Tax-exempt income', amount: -600000 }
            ]
        }
    ];
    
    // Add anomaly flags and calculated fields to make data more realistic
    entities.forEach(entity => {
        // Entities with ETR below 15% are likely to have anomalies
        let isAnomaly = entity.JurisdictionalETR < 0.15;
        
        // Some high-tax jurisdictions might have anomalies for other reasons
        if (entity.JurisdictionalETR > 0.25 && Math.random() < 0.3) {
            isAnomaly = true;
        }
        
        // Process entity to add anomaly information
        if (isAnomaly) {
            const anomalies = [];
            
            // Potential anomaly types
            if (entity.JurisdictionalETR < 0.15) {
                anomalies.push({
                    type: 'business_rule',
                    severity: 'high',
                    feature: 'JurisdictionalETR',
                    value: entity.JurisdictionalETR,
                    threshold: 0.15,
                    description: `ETR (${(entity.JurisdictionalETR * 100).toFixed(2)}%) below 15%`
                });
            }
            
            if (entity.TopUpTax > 0 && entity.GloBEIncome > 0) {
                const topUpRatio = entity.TopUpTax / entity.GloBEIncome;
                if (topUpRatio > 0.1) {
                    anomalies.push({
                        type: 'business_rule',
                        severity: 'medium',
                        feature: 'TopUpTaxRatio',
                        value: topUpRatio,
                        threshold: 0.1,
                        description: `Top-Up Tax (${(topUpRatio * 100).toFixed(2)}%) is high`
                    });
                }
            }
            
            // Generate statistical anomalies for some entities
            if (Math.random() < 0.4) {
                const features = ['GloBEIncome', 'SubstanceBasedIncomeExclusion', 'TotalTaxesPayable'];
                const feature = features[Math.floor(Math.random() * features.length)];
                const zScore = 2.5 + Math.random() * 2;
                
                anomalies.push({
                    type: 'statistical',
                    severity: zScore > 3 ? 'high' : 'medium',
                    feature: feature,
                    value: entity[feature],
                    zScore: zScore,
                    description: `${feature} (${entity[feature].toLocaleString()}) unusual (z-score: ${zScore.toFixed(2)})`
                });
            }
            
            entity.isAnomaly = true;
            entity.anomalyCount = anomalies.length;
            entity.anomalies = anomalies;
            
            // Generate recommendations
            const recommendations = [];
            if (entity.JurisdictionalETR < 0.15) {
                recommendations.push('Review tax planning for low ETR.');
            }
            if (entity.TopUpTax > 0) {
                recommendations.push('Analyze deductions to reduce top-up tax.');
            }
            if (entity.SubstanceBasedIncomeExclusion / entity.GloBEIncome < 0.1) {
                recommendations.push('Consider increasing substance in low-tax jurisdictions.');
            }
            
            entity.recommendations = recommendations;
            entity.anomalyScore = 0.5 + (Math.random() * 0.5);
        } else {
            entity.isAnomaly = false;
            entity.anomalyCount = 0;
            entity.anomalies = [];
            entity.recommendations = [];
            entity.anomalyScore = Math.random() * 0.3;
        }
    });
    
    // Return data functions
    return {
        /**
         * Gets all entities data
         * @returns {Array} All entities
         */
        getAllEntities: function() {
            return [...entities];
        },
        
        /**
         * Gets entities filtered by region
         * @param {string} region - Region code ('emea', 'apac', 'americas', 'all')
         * @returns {Array} Filtered entities
         */
        getEntitiesByRegion: function(region) {
            if (region === 'all') {
                return [...entities];
            }
            
            const regionMapping = {
                'emea': ['United Kingdom', 'Luxembourg', 'Ireland', 'Switzerland', 'United Arab Emirates', 
                         'France', 'Germany', 'Italy', 'Jersey'],
                'apac': ['Singapore', 'Hong Kong', 'Japan', 'Australia', 'China', 'Taiwan', 'South Korea', 'India'],
                'americas': ['United States', 'Cayman Islands', 'Bermuda', 'Canada', 'Brazil', 'Mexico']
            };
            
            return entities.filter(entity => 
                regionMapping[region] && regionMapping[region].includes(entity.Jurisdiction)
            );
        },
        
        /**
         * Gets entities with ETR below threshold
         * @param {number} threshold - ETR threshold (default: 0.15)
         * @returns {Array} Entities below threshold
         */
        getEntitiesBelowETR: function(threshold = 0.15) {
            return entities.filter(entity => entity.JurisdictionalETR < threshold);
        },
        
        /**
         * Gets entities with top-up tax
         * @returns {Array} Entities with top-up tax
         */
        getEntitiesWithTopUpTax: function() {
            return entities.filter(entity => entity.TopUpTax > 0);
        },
        
        /**
         * Gets anomalous entities
         * @returns {Array} Entities with anomalies
         */
        getAnomalousEntities: function() {
            return entities.filter(entity => entity.isAnomaly);
        },
        
        /**
         * Gets entity by ID
         * @param {number} id - Entity ID
         * @returns {Object|null} Entity or null if not found
         */
        getEntityById: function(id) {
            return entities.find(entity => entity.EntityID === id) || null;
        },
        
        /**
         * Gets aggregated data by jurisdiction
         * @returns {Array} Aggregated jurisdiction data
         */
        getJurisdictionData: function() {
            const jurisdictionMap = {};
            
            entities.forEach(entity => {
                if (!jurisdictionMap[entity.Jurisdiction]) {
                    jurisdictionMap[entity.Jurisdiction] = {
                        jurisdiction: entity.Jurisdiction,
                        entities: 0,
                        totalIncome: 0,
                        totalTopUpTax: 0,
                        totalTaxesPayable: 0,
                        avgETR: 0
                    };
                }
                
                jurisdictionMap[entity.Jurisdiction].entities += 1;
                jurisdictionMap[entity.Jurisdiction].totalIncome += entity.GloBEIncome;
                jurisdictionMap[entity.Jurisdiction].totalTopUpTax += entity.TopUpTax;
                jurisdictionMap[entity.Jurisdiction].totalTaxesPayable += entity.TotalTaxesPayable;
                jurisdictionMap[entity.Jurisdiction].avgETR += entity.JurisdictionalETR;
            });
            
            // Calculate averages
            return Object.values(jurisdictionMap).map(jurisdiction => {
                jurisdiction.avgETR = jurisdiction.avgETR / jurisdiction.entities;
                return jurisdiction;
            });
        },
        
        /**
         * Gets summary statistics
         * @returns {Object} Summary statistics
         */
        getSummaryStats: function() {
            const totalEntities = entities.length;
            const totalGloBEIncome = entities.reduce((sum, entity) => sum + entity.GloBEIncome, 0);
            const totalTopUpTax = entities.reduce((sum, entity) => sum + entity.TopUpTax, 0);
            const entitiesBelowETR = entities.filter(entity => entity.JurisdictionalETR < 0.15).length;
            const avgETR = entities.reduce((sum, entity) => sum + entity.JurisdictionalETR, 0) / totalEntities;
            const safeHarborEligible = entities.filter(entity => entity.safeHarbor).length;
            const anomaliesDetected = entities.filter(entity => entity.isAnomaly).length;
            
            return {
                totalEntities,
                totalGloBEIncome,
                totalTopUpTax,
                entitiesBelowETR,
                avgETR,
                safeHarborEligible,
                anomaliesDetected
            };
        }
    };
})();

// Export to global scope
window.SchrodersHFMData = SchrodersHFMData;
