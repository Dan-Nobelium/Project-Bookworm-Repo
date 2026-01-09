# Project Bookworm - Platform Specification

## Executive Summary

This specification outlines the expansion of Project Bookworm from a single-experiment repository into a comprehensive psychological research platform. The platform will enable researchers to create, deploy, and manage behavioral experiments with enhanced data collection, monitoring, and analysis capabilities.

---

## Core Features (Already Planned)

### 1. Custom Backend for Data Collection
- **Purpose**: Replace JATOS dependency with a custom backend API
- **Capabilities**:
  - RESTful API for experiment data submission
  - Real-time data streaming and storage
  - Database schema optimized for behavioral data
  - Data validation and integrity checks
  - Support for large-scale data collection
  - API authentication and rate limiting
  - Data export in multiple formats (JSON, CSV, R, Python)

### 2. Enhanced Experiment Hosting
- **Purpose**: Support more complex and detailed experimental designs
- **Capabilities**:
  - Multi-experiment management system
  - Experiment versioning and rollback
  - A/B testing and experimental conditions
  - Dynamic parameter configuration
  - Support for longer-running experiments
  - Resource optimization for complex stimuli
  - CDN integration for asset delivery

---

## Proposed Additional Features

### 3. Visual Experiment Builder & Configuration System

**Problem**: Currently, experiments require direct code editing in `app2.js`, making it difficult for non-programmers to create or modify experiments.

**Solution**: A web-based visual experiment builder that allows researchers to:
- **Drag-and-drop interface** for creating experiment timelines
- **Visual parameter configuration** for:
  - Trial blocks and repetitions
  - Stimulus presentation (planets, ships, images)
  - Probability distributions and contingencies
  - Timing parameters (durations, delays, ITIs)
  - Questionnaires and survey blocks
- **Template library** with pre-built experiment structures
- **Code generation** that outputs jsPsych-compatible configuration
- **Preview mode** to test experiments before deployment
- **Version control** integration for experiment configurations

**Benefits**:
- Democratizes experiment creation (no coding required)
- Reduces errors from manual code editing
- Enables rapid prototyping and iteration
- Maintains consistency across experiments

**Technical Approach**:
- React-based frontend for the builder interface
- JSON-based experiment schema/configuration format
- Backend API to store and retrieve experiment configurations
- Compiler/transpiler to convert configurations to jsPsych timeline objects

---

### 4. Real-Time Analytics Dashboard & Data Quality Monitoring

**Problem**: Researchers currently have no visibility into experiment progress, data quality, or participant behavior until data collection is complete.

**Solution**: A comprehensive analytics dashboard providing:
- **Real-time experiment monitoring**:
  - Active participant count
  - Completion rates and dropout points
  - Average experiment duration
  - Geographic distribution of participants
- **Data quality indicators**:
  - Attention check pass/fail rates
  - Response time distributions and outliers
  - Missing data detection
  - Automated quality flags (e.g., suspiciously fast responses)
- **Participant-level insights**:
  - Individual progress tracking
  - Behavioral pattern visualization (e.g., click patterns, choice distributions)
  - Performance metrics (points earned, accuracy)
- **Automated alerts**:
  - Low completion rates
  - Technical errors or failures
  - Data quality issues requiring attention
  - Recruitment targets reached

**Benefits**:
- Early detection of problems (technical or methodological)
- Data-driven decisions about continuing/stopping data collection
- Quality assurance before data analysis
- Reduced time to publication

**Technical Approach**:
- WebSocket connections for real-time updates
- Time-series database for behavioral data
- Aggregation pipelines for metrics calculation
- Visualization library (e.g., D3.js, Chart.js, Plotly)
- Alert system with email/Slack integration

---

### 5. Participant Management & Recruitment Integration System

**Problem**: Managing participants, recruitment, consent, and communication is currently manual and fragmented.

**Solution**: An integrated participant management system featuring:
- **Participant database**:
  - Profile management (demographics, consent status, participation history)
  - Unique participant IDs and tracking across experiments
  - Privacy-compliant data handling (GDPR, IRB compliance)
- **Recruitment platform integrations**:
  - Direct API connections to Prolific, MTurk, SONA Systems
  - Automated participant assignment to conditions
  - Pre-screening and qualification management
  - Payment processing integration
- **Communication tools**:
  - Automated email notifications (invitations, reminders, completion)
  - Customizable email templates
  - Follow-up survey scheduling
  - Participant support ticket system
- **Consent management**:
  - Digital consent forms with version tracking
  - Consent withdrawal handling
  - Audit trails for compliance
- **Session management**:
  - Scheduling and calendar integration
  - Session reminders and check-ins
  - Multi-session experiment support
  - Progress tracking across sessions

**Benefits**:
- Streamlined recruitment workflow
- Reduced administrative burden
- Better participant retention
- Compliance with research ethics requirements
- Centralized participant data

**Technical Approach**:
- RESTful API for participant CRUD operations
- Integration adapters for recruitment platforms
- Email service integration (SendGrid, AWS SES)
- Calendar API integration (Google Calendar, Outlook)
- Secure storage for sensitive participant data

---

## Technical Architecture Overview

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend Layer                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Experiment  │  │   Analytics   │  │  Participant  │      │
│  │   Builder    │  │   Dashboard   │  │   Management  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────────┐
│                    API Gateway                               │
│         (Authentication, Rate Limiting, Routing)             │
└─────────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────────┐
│                    Backend Services                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Experiment  │  │   Data       │  │  Participant │      │
│  │   Service    │  │   Service    │  │   Service    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────────┐
│                    Data Layer                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  PostgreSQL  │  │   Redis      │  │   S3/Storage │      │
│  │  (Primary)   │  │   (Cache)    │  │   (Assets)   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack Recommendations

**Backend**:
- Node.js/Express or Python/FastAPI for API services
- PostgreSQL for relational data (experiments, participants, metadata)
- Redis for caching and real-time data
- WebSocket server for real-time updates

**Frontend**:
- React or Vue.js for admin interfaces
- Existing jsPsych for experiment runtime (no changes needed)
- Chart.js/D3.js for visualizations

**Infrastructure**:
- Docker containerization
- Kubernetes or Docker Compose for orchestration
- Nginx for reverse proxy (already in use)
- AWS S3 or similar for asset storage

---

## Implementation Phases

### Phase 1: Foundation (Months 1-3)
- Custom backend API development
- Database schema design and migration
- Basic data collection endpoints
- Authentication and security

### Phase 2: Core Features (Months 4-6)
- Experiment builder MVP
- Real-time analytics dashboard
- Participant management system
- Integration with one recruitment platform

### Phase 3: Enhancement (Months 7-9)
- Advanced experiment builder features
- Comprehensive analytics and reporting
- Multiple recruitment platform integrations
- Advanced data quality monitoring

### Phase 4: Optimization (Months 10-12)
- Performance optimization
- User experience improvements
- Documentation and training materials
- Community features (if applicable)

---

## Success Metrics

- **Experiment Creation Time**: Reduce from days to hours
- **Data Quality**: Increase attention check pass rates by 20%
- **Participant Management**: Reduce administrative time by 50%
- **Platform Adoption**: 10+ active experiments within 6 months
- **System Reliability**: 99.9% uptime for data collection

---

## Open Questions & Considerations

1. **Multi-tenancy**: Should the platform support multiple research labs/organizations?
2. **Pricing Model**: Free, subscription-based, or usage-based?
3. **Data Privacy**: Additional compliance requirements beyond GDPR?
4. **Mobile Support**: Should experiments run on mobile devices?
5. **Collaboration**: Should multiple researchers be able to collaborate on experiments?
6. **Open Source**: Should any components be open-sourced?

---

## Next Steps

1. **Stakeholder Review**: Gather feedback on proposed features
2. **Technical Feasibility**: Assess complexity and resource requirements
3. **Prioritization**: Determine feature implementation order
4. **Prototype Development**: Build MVP for highest-priority feature
5. **User Testing**: Validate features with target users (researchers)

---

*Document Version: 1.0*  
*Last Updated: [Current Date]*

