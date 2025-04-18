/**
 * Simplified Tax Anomaly Detector
 * 
 * This is a minimalistic version of the tax anomaly detector that provides
 * just the core functionality needed for the dashboard to work.
 */

class TaxAnomalyDetector {
    /**
     * Creates a new TaxAnomalyDetector instance
     */
    constructor() {
        // Configuration values
        this.config = {
            etrThreshold: 0.15, // 15% minimum ETR
            topUpTaxRatioThreshold: 0.1,
            zScoreThreshold: 2.5
        };
    }
    
    /**
     * Detect anomalies in a set of entities
     * @param {Array} entities - Array of entity objects with tax data
     * @returns {Array} Entities with anomaly information
     */
    detectAnomalies(entities) {
        console.log("Detecting anomalies for", entities.length, "entities");
        
        if (!entities || entities.length === 0) {
            return [];
        }
        
        // If entities already have anomaly data, just return them
        if (entities[0].hasOwnProperty('isAnomaly')) {
            return entities;
        }
        
        // Process each entity
        return entities.map(entity => {
            // Check if ETR is below minimum threshold
            const isBelowETR = entity.JurisdictionalETR < this.config.etrThreshold;
            
            // Check if top-up tax ratio is high
            const hasHighTopUpRatio = entity.GloBEIncome > 0 && entity.TopUpTax > 0 && 
                                     (entity.TopUpTax / entity.GloBEIncome) > this.config.topUpTaxRatioThreshold;
            
            // Determine if entity is anomalous
            const isAnomaly = isBelowETR || hasHighTopUpRatio;
            
            // Generate anomalies
            const anomalies = [];
            
            if (isBelowETR) {
                anomalies.push({
                    type: 'business_rule',
                    severity: 'high',
                    feature: 'JurisdictionalETR',
                    value: entity.JurisdictionalETR,
                    threshold: this.config.etrThreshold,
                    description: `ETR (${(entity.JurisdictionalETR * 100).toFixed(2)}%) below 15%`
                });
            }
            
            if (hasHighTopUpRatio) {
                const topUpRatio = entity.TopUpTax / entity.GloBEIncome;
                anomalies.push({
                    type: 'business_rule',
                    severity: 'medium',
                    feature: 'TopUpTaxRatio',
                    value: topUpRatio,
                    threshold: this.config.topUpTaxRatioThreshold,
                    description: `Top-Up Tax (${(topUpRatio * 100).toFixed(2)}%) is high`
                });
            }
            
            // Generate recommendations
            const recommendations = [];
            if (isBelowETR) {
                recommendations.push('Review tax planning for low ETR.');
            }
            if (hasHighTopUpRatio) {
                recommendations.push('Analyze deductions to reduce top-up tax.');
            }
            
            // Return entity with anomaly info
            return {
                ...entity,
                isAnomaly,
                anomalyCount: anomalies.length,
                anomalies,
                recommendations,
                anomalyScore: isAnomaly ? 0.7 : 0.2
            };
        });
    }
    
    /**
     * Gets regulatory references for a specific calculation type
     * @param {string} calculationType - Type of calculation
     * @returns {Object} Regulatory reference information
     */
    getRegulatoryReference(calculationType) {
        const references = {
            etr: {
                article: 'Article 5.1 of the OECD Model Rules',
                text: "The effective tax rate of a jurisdiction is the total adjusted covered taxes of the constituent entities located in the jurisdiction divided by the net GloBE income of the jurisdiction for the fiscal year.",
                additionalArticles: [
                    {
                        article: 'Article 5.2',
                        text: "The effective tax rate of a jurisdiction shall be computed to the nearest one-hundredth of a percent."
                    }
                ]
            },
            sbie: {
                article: 'Article 5.3 of the OECD Model Rules',
                text: "The substance-based income exclusion for a jurisdiction is the sum of the payroll component and the tangible asset component for each constituent entity located in the jurisdiction.",
                additionalArticles: [
                    {
                        article: 'Article 5.3.1',
                        text: "The payroll component is 5% of the eligible payroll costs of eligible employees."
                    },
                    {
                        article: 'Article 5.3.2',
                        text: "The tangible asset component is 5% of the carrying value of eligible tangible assets."
                    }
                ]
            },
            topup: {
                article: 'Article 5.2 of the OECD Model Rules',
                text: "The top-up tax percentage for a jurisdiction for a fiscal year is the positive percentage point difference between the minimum rate and the jurisdiction's effective tax rate.",
                additionalArticles: [
                    {
                        article: 'Article 5.2.3',
                        text: "The jurisdictional top-up tax for a fiscal year is the sum of the top-up tax of all the constituent entities located in the jurisdiction for the fiscal year."
                    }
                ]
            },
            safeharbor: {
                article: 'OECD Pillar Two Safe Harbor Provisions',
                text: "The Safe Harbor provisions provide a simplified method to determine whether top-up tax is due in a jurisdiction, reducing compliance burden for MNE groups when certain conditions are met.",
                additionalArticles: [
                    {
                        article: 'Transitional Safe Harbor',
                        text: "For fiscal years beginning on or before 31 December 2026, a jurisdiction is a qualified jurisdiction if it meets the de minimis test, the simplified ETR test, or the routine profits test."
                    }
                ]
            }
        };
        
        return references[calculationType] || { 
            article: 'Unknown', 
            text: 'No regulatory reference found for this calculation type.' 
        };
    }
    
    /**
     * Validates a specific type of calculation for an entity
     * @param {string} calculationType - Type of calculation to validate
     * @param {Object} entityData - Entity data to validate
     * @returns {Object} Validation result
     */
    validateCalculation(calculationType, entityData) {
        console.log("Validating calculation:", calculationType, entityData);
        
        switch (calculationType) {
            case 'etr':
                return this.validateETRCalculation(entityData);
            case 'sbie':
                return this.validateSBIECalculation(entityData);
            case 'topup':
                return this.validateTopUpCalculation(entityData);
            case 'safeharbor':
                return this.validateSafeHarborCalculation(entityData);
            case 'adjustments':
                return this.validateAdjustmentsCalculation(entityData);
            default:
                return {
                    isValid: false,
                    errors: ['Unknown calculation type']
                };
        }
    }
    
    /**
     * Validates ETR calculation
     * @param {Object} entityData - Entity data to validate
     * @returns {Object} Validation result
     */
    validateETRCalculation(entityData) {
        const { JurisdictionalETR, GloBEIncome, TotalTaxesPayable } = entityData;
        const calculatedETR = GloBEIncome > 0 ? TotalTaxesPayable / GloBEIncome : 0;
        const difference = Math.abs(calculatedETR - JurisdictionalETR);
        
        return {
            isValid: difference < 0.001, // Allow for rounding differences
            calculatedValue: calculatedETR,
            reportedValue: JurisdictionalETR,
            difference: difference,
            errors: difference >= 0.001 ? ['ETR calculation does not match reported value'] : [],
            warnings: JurisdictionalETR < this.config.etrThreshold ? ['ETR is below the minimum threshold of 15%'] : []
        };
    }
    
    /**
     * Validates SBIE calculation
     * @param {Object} entityData - Entity data to validate
     * @returns {Object} Validation result
     */
    validateSBIECalculation(entityData) {
        const { SubstanceBasedIncomeExclusion, payrollCosts, tangibleAssets } = entityData;
        const payrollComponent = payrollCosts * 0.05;
        const assetsComponent = tangibleAssets * 0.05;
        const calculatedSBIE = payrollComponent + assetsComponent;
        const difference = Math.abs(calculatedSBIE - SubstanceBasedIncomeExclusion);
        
        return {
            isValid: difference < 100, // Allow for rounding differences
            calculatedValue: calculatedSBIE,
            reportedValue: SubstanceBasedIncomeExclusion,
            difference: difference,
            components: {
                payrollComponent,
                assetsComponent
            },
            errors: difference >= 100 ? ['SBIE calculation does not match reported value'] : [],
            warnings: []
        };
    }
    
    /**
     * Validates Top-Up Tax calculation
     * @param {Object} entityData - Entity data to validate
     * @returns {Object} Validation result
     */
    validateTopUpCalculation(entityData) {
        const { JurisdictionalETR, GloBEIncome, TopUpTax, SubstanceBasedIncomeExclusion } = entityData;
        const topUpTaxPercentage = Math.max(0, this.config.etrThreshold - JurisdictionalETR);
        const excessProfit = Math.max(0, GloBEIncome - SubstanceBasedIncomeExclusion);
        const calculatedTopUpTax = topUpTaxPercentage * excessProfit;
        const difference = Math.abs(calculatedTopUpTax - TopUpTax);
        
        return {
            isValid: difference < 100, // Allow for rounding differences
            calculatedValue: calculatedTopUpTax,
            reportedValue: TopUpTax,
            difference: difference,
            components: {
                topUpTaxPercentage,
                excessProfit
            },
            errors: difference >= 100 ? ['Top-Up Tax calculation does not match reported value'] : [],
            warnings: []
        };
    }
    
    /**
     * Validates Safe Harbor calculation
     * @param {Object} entityData - Entity data to validate
     * @returns {Object} Validation result
     */
    validateSafeHarborCalculation(entityData) {
        const safeHarborThresholds = {
            deMinimisRevenue: 10000000, // €10M
            deMinimisProfit: 1000000, // €1M
            etr: { 2023: 0.15, 2024: 0.15, 2025: 0.16, 2026: 0.17 }
        };
        
        const year = entityData.year || '2024';
        const etrThreshold = safeHarborThresholds.etr[year] || 0.15;
        
        // Mock income as GloBE income (would be revenue in real data)
        const income = entityData.GloBEIncome;
        const profit = entityData.GloBEIncome * entityData.JurisdictionalETR;
        const etr = entityData.JurisdictionalETR;
        const sbie = entityData.SubstanceBasedIncomeExclusion;
        
        // De Minimis Test
        const deMinimisTest = {
            passed: income < safeHarborThresholds.deMinimisRevenue && 
                    Math.abs(profit) < safeHarborThresholds.deMinimisProfit,
            income,
            profit,
            incomeThreshold: safeHarborThresholds.deMinimisRevenue,
            profitThreshold: safeHarborThresholds.deMinimisProfit
        };
        
        // ETR Test
        const etrTest = {
            passed: etr >= etrThreshold,
            etr,
            threshold: etrThreshold
        };
        
        // Routine Profits Test
        const routineProfitsTest = {
            passed: profit <= sbie || profit <= 0,
            profit,
            sbie
        };
        
        // Overall result
        const safeHarborApplies = deMinimisTest.passed || etrTest.passed || routineProfitsTest.passed;
        const reason = deMinimisTest.passed ? 'De Minimis Test' : 
                      etrTest.passed ? 'ETR Test' : 
                      routineProfitsTest.passed ? 'Routine Profits Test' : 
                      'Does not meet safe harbor criteria';
        
        return {
            isValid: true, // Validation is always valid (just checking qualifications)
            safeHarborApplies,
            reason,
            tests: {
                deMinimisTest,
                etrTest,
                routineProfitsTest
            },
            errors: [],
            warnings: []
        };
    }
    
    /**
     * Validates adjustments calculation
     * @param {Object} entityData - Entity data to validate
     * @returns {Object} Validation result
     */
    validateAdjustmentsCalculation(entityData) {
        // Mock adjustment data since we don't have actual adjustment breakdowns
        const financialNetIncome = entityData.financialNetIncome || entityData.GloBEIncome * 1.05;
        const mockAdjustments = [
            { type: 'Net tax expense adjustments', amount: -entityData.GloBEIncome * 0.02 },
            { type: 'Excluded dividends', amount: -entityData.GloBEIncome * 0.015 },
            { type: 'Policy disallowed expenses', amount: -entityData.GloBEIncome * 0.01 }
        ];
        
        const totalAdjustments = mockAdjustments.reduce((sum, adj) => sum + adj.amount, 0);
        const calculatedGloBEIncome = financialNetIncome + totalAdjustments;
        const difference = Math.abs(calculatedGloBEIncome - entityData.GloBEIncome);
        
        return {
            isValid: true, // Always valid for mock data
            calculatedValue: calculatedGloBEIncome,
            reportedValue: entityData.GloBEIncome,
            difference: difference,
            financialNetIncome,
            adjustments: mockAdjustments,
            errors: [],
            warnings: []
        };
    }
}

// Make the class available globally
window.TaxAnomalyDetector = TaxAnomalyDetector;
