# VM_Pillar2
Pillar 2 Tax dashboard 
# Pillar 2 Regulatory Dashboard - Technical README

## Overview
Power BI dashboard for Pillar 2 regulatory capital adequacy reporting, designed for asset management firms to monitor CET1 ratios, capital requirements, and data quality compliance.

## Technical Architecture

### Data Sources
- **P&L Data**: Connected via Power Query from Excel/SQL source
- **Balance Sheet Data**: Real-time connection to financial data warehouse
- **Entity Master**: Reference data for organizational hierarchy
- **Risk Data**: RWA (Risk Weighted Assets) calculations

### Data Model
```
Entities (1) -----> (*) FinancialData
DateTable (1) -----> (*) FinancialData
```

**Relationships:**
- `Entities[EntityID] → FinancialData[EntityID]` (One-to-Many)
- `DateTable[Date] → FinancialData[ReportingDate]` (One-to-Many)

### Key DAX Measures

```dax
// Core regulatory calculation
CET1 Ratio = 
VAR HasRWA = NOT(ISBLANK([Total RWA])) && [Total RWA] > 0
RETURN
IF(HasRWA, DIVIDE([CET1 Capital], [Total RWA]), BLANK())

// Data quality tracking
Data Quality Flag = 
IF(ISBLANK([Total RWA]) || [Total RWA] = 0, "Missing RWA Data", "Complete")

// Capital surplus calculation
Capital Surplus = [CET1 Capital] - ([Total RWA] * 0.08)
```

### Data Transformation (Power Query)
- Column standardization and type conversion
- Entity name normalization
- Date formatting for time intelligence
- Data quality flagging for incomplete records
- Currency conversion to reporting standard (GBP)

## Dashboard Components

### Page 1: Executive Summary
- **KPI Cards**: CET1 Ratio, Total Capital, Total RWA
- **Gauge Chart**: Regulatory threshold visualization (8% minimum, 10.5% target)
- **Status Indicators**: Color-coded compliance status

### Page 2: Entity Analysis
- **Comparison Table**: Entity-level metrics with conditional formatting
- **Trend Analysis**: Time series CET1 ratio performance
- **Peer Benchmarking**: Relative performance across entities

### Page 3: Data Quality
- **Completeness Metrics**: % of entities with complete RWA data
- **Issues Table**: Entities requiring data remediation
- **Quality Trends**: Data completeness over time

### Page 4: Documentation
- **Calculation Methodologies**: Regulatory formula explanations
- **Compliance Requirements**: Regulatory threshold definitions
- **Data Lineage**: Source system documentation

## Tax and Regulatory Purpose

### Pillar 2 Compliance
- **Capital Adequacy Assessment**: Monitors CET1 ratios against Basel III requirements
- **Risk Management**: Tracks Risk Weighted Assets exposure across entities
- **Regulatory Reporting**: Supports ICAAP (Internal Capital Adequacy Assessment Process)

### Tax Implications
- **Transfer Pricing**: Capital allocation tracking for intercompany pricing
- **Tax Planning**: Entity-level capital optimization for tax efficiency
- **Compliance Documentation**: Audit trail for regulatory examinations
- **Risk Assessment**: Capital adequacy impacts on tax risk management

### Business Use Cases
1. **Monthly Board Reporting**: Executive summary for capital adequacy status
2. **Regulatory Submissions**: Data validation before regulatory filing
3. **Risk Management**: Early warning system for capital threshold breaches
4. **Tax Optimization**: Capital reallocation decisions for tax efficiency
5. **Audit Support**: Documentation for internal and external audits

## Performance & Security

### Optimization
- **Incremental Refresh**: Daily data updates with historical retention
- **Aggregations**: Pre-calculated summaries for faster rendering
- **DirectQuery**: Real-time connection for critical metrics

### Data Governance
- **Row-Level Security**: Entity access based on user permissions
- **Data Classification**: Sensitive financial data protection
- **Audit Logging**: User access and data modification tracking

## Deployment & Maintenance

### Power BI Service Configuration
- **Scheduled Refresh**: Daily at 6 AM GMT
- **Email Alerts**: Notifications for CET1 ratio < 9%
- **Workspace Security**: Restricted to regulatory team and senior management

### Dependencies
- **Data Sources**: SQL Server 2019+, Excel Online
- **Power BI**: Premium capacity required for real-time features
- **Gateways**: On-premises data gateway for internal systems

## Change Log
- **v1.0**: Initial MVP with core regulatory metrics
- **v1.1**: Enhanced data quality monitoring
- **v1.2**: Added drill-through functionality and documentation

## Support & Contacts
- **Technical Owner**: [Your Name] - Power BI Developer
- **Business Owner**: Risk Management Team
- **Data Source**: Finance Systems Team
- **Compliance**: Regulatory Reporting Team

---
*Last Updated: [Current Date]*
*Classification: Internal Use - Regulatory Data*
