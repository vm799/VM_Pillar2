# VM_Pillar2
Pillar 2 Tax dashboard 
# Pillar Two Tax Dashboard - Technical README

## 🏗️ **Architecture**

**Frontend Stack:**
- Pure HTML5/CSS3/JavaScript (no frameworks - optimal for performance)
- Modular ES6+ architecture with component-based design
- Chart.js 4.4.3 for data visualizations
- CSS Grid/Flexbox for responsive layouts
- Progressive Web App principles

**Key Modules:**
```
├── app.js                    # Main application orchestrator
├── chart-renderer.js         # Chart visualization engine  
├── validation-handler.js     # Tax calculation validator
├── tax-anomaly-detector.js   # ML-style anomaly detection
├── schroders-hfm-data.js    # Mock HFM data (30 entities)
├── tab-manager.js           # Accessible tab navigation
└── placeholder-handler.js   # Dynamic image handling
```

## 📊 **Tax Compliance Features**

### **OECD Pillar Two Implementation:**
- **Effective Tax Rate (ETR)** monitoring across 20+ jurisdictions
- **Top-Up Tax** calculations per Article 5.2 OECD Model Rules
- **Substance-Based Income Exclusion (SBIE)** - 5% payroll + tangible assets
- **Safe Harbor** provisions (De Minimis, ETR, Routine Profits tests)
- **Global Information Reporting (GIR)** compliance

### **Advanced Analytics:**
- Real-time **anomaly detection** (statistical + business rule based)
- **Regulatory validation** engine with OECD article references
- Interactive **jurisdiction heatmaps** and trend analysis
- **Risk assessment** with color-coded compliance indicators

## 💼 **Business Use Cases**

**For Tax Teams:**
- Monitor 15% minimum tax compliance across global entities
- Validate complex Pillar Two calculations against OECD standards
- Generate audit-ready compliance reports
- Identify tax planning opportunities

**For Finance/Treasury:**
- Track top-up tax liabilities ($42M+ identified in dataset)
- Assess safe harbor eligibility by jurisdiction
- Monitor substance requirements for low-tax jurisdictions

**For Risk/Compliance:**
- Detect calculation anomalies and data inconsistencies
- Ensure regulatory compliance across 30+ entities
- Generate executive dashboards for board reporting

## 🚀 **Technical Highlights**

- **Zero Dependencies** (except Chart.js) - reduces security vulnerabilities
- **Accessibility First** - WCAG 2.1 compliant with ARIA labels
- **Performance Optimized** - Lazy loading, efficient DOM manipulation
- **Mobile Responsive** - Works on tablets/phones for field teams
- **Error Resilient** - Comprehensive error handling throughout

**Data Processing:**
- Handles 30 entities with real-time filtering/aggregation
- Mock data based on actual Schroders public filings
- Statistical anomaly detection using z-score analysis
- Regulatory compliance engine with formula validation

This dashboard transforms complex tax regulations into actionable insights, helping global asset managers navigate the $15B+ annual impact of Pillar Two compliance.
