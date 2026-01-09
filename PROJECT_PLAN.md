# Project Bookworm: 2-Week Implementation Plan

## Project Goals
- ✅ Set up Vercel + Supabase backend
- ✅ Replace JATOS data collection
- ✅ Test data collection with existing experiment
- ✅ Build participant data visualization dashboard

**Timeline**: 2 weeks (10 working days)  
**Start Date**: ___________  
**Target Completion**: ___________

---

## Week 1: Backend Setup & Data Collection

### Day 1: Project Setup & Accounts (Monday)

#### Morning: Environment Setup
- [ ] Create Supabase account at [supabase.com](https://supabase.com)
- [ ] Create new Supabase project: "project-bookworm"
- [ ] Save Supabase credentials:
  - [ ] Project URL: `https://xxxxx.supabase.co`
  - [ ] Anon public key
  - [ ] Service role key (keep secret!)
- [ ] Create Vercel account at [vercel.com](https://vercel.com)
- [ ] Install Node.js (if not already installed)
- [ ] Install Vercel CLI: `npm install -g vercel`
- [ ] Verify installations: `node --version`, `npm --version`, `vercel --version`

#### Afternoon: Project Structure
- [ ] Create project directory structure:
  ```
  project-bookworm/
  ├── Frontend/          (existing - keep as is)
  ├── api/              (new - Vercel functions)
  │   └── submit-data.js
  ├── package.json      (new)
  ├── vercel.json       (new)
  └── .env.local        (new - for local dev, gitignored)
  ```
- [ ] Initialize npm project: `npm init -y`
- [ ] Install dependencies: `npm install @supabase/supabase-js`
- [ ] Create `.gitignore` (if not exists):
  ```
  node_modules/
  .env.local
  .vercel
  ```
- [ ] Test Vercel CLI login: `vercel login`

**End of Day Checkpoint:**
- [ ] All accounts created
- [ ] Project structure ready
- [ ] Dependencies installed

---

### Day 2: Database Setup (Tuesday)

#### Morning: Database Schema Design
- [ ] Review current data structure in `app2.js`
- [ ] Design database schema (use guide from BACKEND_IMPLEMENTATION_GUIDE.md)
- [ ] Document schema decisions

#### Afternoon: Create Database Tables
- [ ] Open Supabase SQL Editor
- [ ] Create `participants` table:
  ```sql
  CREATE TABLE participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subject_id TEXT UNIQUE,
    group_assignment TEXT,
    sample TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP
  );
  ```
- [ ] Create `experiment_responses` table:
  ```sql
  CREATE TABLE experiment_responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    participant_id UUID REFERENCES participants(id),
    experiment_id TEXT NOT NULL,
    trial_data JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
  );
  ```
- [ ] Create indexes:
  ```sql
  CREATE INDEX idx_participant_id ON experiment_responses(participant_id);
  CREATE INDEX idx_experiment_id ON experiment_responses(experiment_id);
  CREATE INDEX idx_created_at ON experiment_responses(created_at);
  ```
- [ ] Set up Row Level Security (RLS):
  ```sql
  ALTER TABLE participants ENABLE ROW LEVEL SECURITY;
  ALTER TABLE experiment_responses ENABLE ROW LEVEL SECURITY;
  
  CREATE POLICY "Allow public inserts" ON experiment_responses
    FOR INSERT TO anon WITH CHECK (true);
  
  CREATE POLICY "Allow authenticated reads" ON experiment_responses
    FOR SELECT TO authenticated USING (true);
  ```
- [ ] Verify tables created in Supabase Table Editor
- [ ] Test insert manually in SQL Editor:
  ```sql
  INSERT INTO participants (subject_id, group_assignment) 
  VALUES ('test-001', 'early_0.1');
  ```

**End of Day Checkpoint:**
- [ ] All tables created
- [ ] Indexes in place
- [ ] RLS policies configured
- [ ] Manual insert test successful

---

### Day 3: Backend API Development (Wednesday)

#### Morning: Create Vercel Function
- [ ] Create `api/submit-data.js` file
- [ ] Implement basic function structure:
  ```javascript
  export default async function handler(req, res) {
    // CORS headers
    // Method validation
    // Basic response
  }
  ```
- [ ] Test function locally: `vercel dev`
- [ ] Verify function responds at `http://localhost:3000/api/submit-data`

#### Afternoon: Integrate Supabase
- [ ] Add Supabase client initialization to function
- [ ] Implement participant creation/retrieval logic
- [ ] Implement experiment data insertion
- [ ] Add error handling and logging
- [ ] Test with curl/Postman:
  ```bash
  curl -X POST http://localhost:3000/api/submit-data \
    -H "Content-Type: application/json" \
    -d '{"participantId": "test-001", "experimentId": "test", "data": [{"test": true}]}'
  ```
- [ ] Verify data appears in Supabase dashboard

**End of Day Checkpoint:**
- [ ] API function created
- [ ] Supabase integration working
- [ ] Local testing successful
- [ ] Data saving to database

---

### Day 4: Frontend Integration (Thursday)

#### Morning: Create API Client
- [ ] Create `Frontend/api-client.js` file
- [ ] Implement `submitExperimentData()` function
- [ ] Add error handling
- [ ] Add retry logic (optional but recommended)
- [ ] Test function in browser console

#### Afternoon: Modify Experiment
- [ ] Backup current `Frontend/index.html`
- [ ] Remove `jatos.js` script tag
- [ ] Add `api-client.js` script tag
- [ ] Replace `jatos.endStudy()` with `submitExperimentData()`
- [ ] Update `on_finish` callback to use async/await
- [ ] Remove `jatos.onLoad()` wrapper
- [ ] Test locally with `vercel dev`

**End of Day Checkpoint:**
- [ ] API client created
- [ ] Frontend modified
- [ ] JATOS dependency removed
- [ ] Local testing successful

---

### Day 5: Deployment & Testing (Friday)

#### Morning: Deploy to Vercel
- [ ] Set environment variables in Vercel:
  - [ ] `SUPABASE_URL`
  - [ ] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] Deploy: `vercel`
- [ ] Get deployment URL (e.g., `https://project-bookworm.vercel.app`)
- [ ] Update `API_BASE_URL` in `Frontend/api-client.js`
- [ ] Test API endpoint with deployed URL

#### Afternoon: End-to-End Testing
- [ ] Run full experiment locally
- [ ] Complete experiment as test participant
- [ ] Verify data in Supabase dashboard:
  - [ ] Participant created in `participants` table
  - [ ] Experiment data in `experiment_responses` table
  - [ ] JSONB data is valid and complete
- [ ] Test with multiple participants (3-5 test runs)
- [ ] Check for errors in Vercel function logs
- [ ] Document any issues found

**End of Day Checkpoint:**
- [ ] Deployed to Vercel
- [ ] Environment variables configured
- [ ] End-to-end test successful
- [ ] Multiple test participants verified
- [ ] Data collection working reliably

**Week 1 Milestone: ✅ Data Collection Working**

---

## Week 2: Data Visualization Dashboard

### Day 6: Dashboard Planning & Setup (Monday)

#### Morning: Requirements & Design
- [ ] Define dashboard features:
  - [ ] Participant summary (points, completion status)
  - [ ] Trial-by-trial visualization
  - [ ] Response time graphs
  - [ ] Choice patterns
- [ ] Sketch dashboard layout (paper or Figma)
- [ ] Choose visualization library (Chart.js recommended)
- [ ] Plan data queries needed from Supabase

#### Afternoon: Dashboard Structure
- [ ] Create `Frontend/dashboard.html` (new file)
- [ ] Set up basic HTML structure
- [ ] Include Chart.js: `<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>`
- [ ] Include Supabase client: `<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>`
- [ ] Create basic layout (header, participant selector, charts area)
- [ ] Add CSS for styling

**End of Day Checkpoint:**
- [ ] Dashboard requirements defined
- [ ] Layout designed
- [ ] Basic HTML structure created
- [ ] Libraries included

---

### Day 7: Data Fetching & Participant Selection (Tuesday)

#### Morning: Supabase Client Setup
- [ ] Initialize Supabase client in dashboard
- [ ] Add Supabase credentials (use anon key - safe for frontend)
- [ ] Create function to fetch all participants
- [ ] Create function to fetch participant by ID
- [ ] Test data fetching in browser console

#### Afternoon: Participant Selector UI
- [ ] Create dropdown/select for participant selection
- [ ] Populate with participant list from Supabase
- [ ] Add "Load Participant Data" button
- [ ] Implement participant data loading on selection
- [ ] Display basic participant info (ID, group, completion status)
- [ ] Add loading states and error handling

**End of Day Checkpoint:**
- [ ] Supabase client working
- [ ] Participant data fetching functional
- [ ] Participant selector UI complete
- [ ] Can load and display participant info

---

### Day 8: Trial Data Visualization (Wednesday)

#### Morning: Parse Trial Data
- [ ] Create function to parse JSONB trial data
- [ ] Extract key metrics:
  - [ ] Trial types
  - [ ] Response times
  - [ ] Points earned per trial
  - [ ] Choices made
  - [ ] Phase information
- [ ] Structure data for charting
- [ ] Test parsing with sample data

#### Afternoon: Create Charts
- [ ] Points Over Time Chart (Line Chart):
  - [ ] X-axis: Trial index or time elapsed
  - [ ] Y-axis: Points total
  - [ ] Show progression through experiment
- [ ] Response Times Chart (Bar/Line Chart):
  - [ ] X-axis: Trial index
  - [ ] Y-axis: Response time (ms)
  - [ ] Color-code by phase
- [ ] Choice Distribution Chart (Pie/Bar Chart):
  - [ ] Show which planets/ships were clicked most
  - [ ] Group by phase if applicable

**End of Day Checkpoint:**
- [ ] Trial data parsing working
- [ ] At least 2 charts displaying data
- [ ] Charts update when participant changes
- [ ] Data visualization functional

---

### Day 9: Enhanced Visualizations & Styling (Thursday)

#### Morning: Additional Charts
- [ ] Phase Breakdown Chart:
  - [ ] Show performance by phase (Phase 1, Phase 2, Phase 3)
  - [ ] Compare points/choices across phases
- [ ] Timeline Visualization:
  - [ ] Show experiment timeline with key events
  - [ ] Mark phase transitions
  - [ ] Highlight important trials
- [ ] Summary Statistics Panel:
  - [ ] Total points
  - [ ] Average response time
  - [ ] Total trials completed
  - [ ] Experiment duration

#### Afternoon: Styling & UX
- [ ] Apply consistent styling (match experiment theme)
- [ ] Add responsive design (mobile-friendly)
- [ ] Improve loading states
- [ ] Add error messages
- [ ] Add "Export Data" button (download JSON)
- [ ] Polish UI/UX

**End of Day Checkpoint:**
- [ ] Multiple visualizations complete
- [ ] Dashboard styled and polished
- [ ] Responsive design implemented
- [ ] Export functionality working

---

### Day 10: Testing, Documentation & Launch (Friday)

#### Morning: Comprehensive Testing
- [ ] Test with multiple participants
- [ ] Test with different experiment versions
- [ ] Test edge cases (empty data, missing fields)
- [ ] Test on different browsers (Chrome, Firefox, Safari)
- [ ] Test on mobile devices
- [ ] Performance testing (large datasets)
- [ ] Fix any bugs found

#### Afternoon: Documentation & Deployment
- [ ] Document dashboard features
- [ ] Create user guide (how to use dashboard)
- [ ] Add comments to code
- [ ] Update README with dashboard info
- [ ] Deploy dashboard to Vercel (or serve from same domain)
- [ ] Test deployed dashboard
- [ ] Create demo/test participant data for showcase

**End of Day Checkpoint:**
- [ ] All testing complete
- [ ] Documentation written
- [ ] Dashboard deployed
- [ ] Ready for use

**Week 2 Milestone: ✅ Data Visualization Complete**

---

## Final Deliverables Checklist

### Backend
- [ ] Vercel deployment live and working
- [ ] Supabase database configured
- [ ] API endpoint functional
- [ ] Data collection working for existing experiment
- [ ] Error handling implemented
- [ ] Environment variables secured

### Frontend
- [ ] Experiment modified to use new backend
- [ ] JATOS dependency removed
- [ ] Data submission working
- [ ] Error handling for failed submissions

### Dashboard
- [ ] Participant selection working
- [ ] Data fetching from Supabase
- [ ] Multiple visualizations displaying
- [ ] Responsive design
- [ ] Export functionality
- [ ] Styled and polished

### Documentation
- [ ] Setup instructions documented
- [ ] API documentation
- [ ] Dashboard user guide
- [ ] Troubleshooting guide

---

## Daily Time Estimates

**Week 1:**
- Day 1: 4-6 hours
- Day 2: 4-6 hours
- Day 3: 5-7 hours
- Day 4: 4-6 hours
- Day 5: 5-7 hours

**Week 2:**
- Day 6: 4-6 hours
- Day 7: 5-7 hours
- Day 8: 5-7 hours
- Day 9: 4-6 hours
- Day 10: 4-6 hours

**Total Estimated Time**: 44-62 hours over 2 weeks

---

## Risk Mitigation

### Potential Issues & Solutions

**Issue**: Vercel deployment fails
- **Solution**: Test locally first, check environment variables

**Issue**: Supabase connection errors
- **Solution**: Verify credentials, check RLS policies

**Issue**: Data not saving
- **Solution**: Check browser console, Vercel logs, Supabase logs

**Issue**: Dashboard not loading data
- **Solution**: Verify Supabase client initialization, check CORS

**Issue**: Charts not rendering
- **Solution**: Verify Chart.js loaded, check data format

---

## Success Criteria

### Week 1 Success
- ✅ Can complete experiment and data saves to Supabase
- ✅ Data structure matches expectations
- ✅ No errors in console/logs
- ✅ Works with multiple test participants

### Week 2 Success
- ✅ Dashboard loads and displays participant list
- ✅ Can view individual participant data
- ✅ Charts display correctly with real data
- ✅ Dashboard is usable and visually appealing
- ✅ Export functionality works

---

## Next Steps After 2 Weeks

- [ ] Add real-time updates (Supabase subscriptions)
- [ ] Add filtering and search
- [ ] Add comparison view (multiple participants)
- [ ] Add aggregate statistics
- [ ] Add experiment builder (from spec)
- [ ] Add participant management features

---

## Notes & Resources

**Key Files to Reference:**
- `BACKEND_IMPLEMENTATION_GUIDE.md` - Detailed implementation guide
- `BACKEND_OPTIONS.md` - Architecture decisions
- `Frontend/app2.js` - Current experiment structure
- `Frontend/index.html` - Current frontend entry point

**Useful Links:**
- [Vercel Docs](https://vercel.com/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Chart.js Docs](https://www.chartjs.org/docs/)
- [jsPsych Docs](https://www.jspsych.org/)

---

**Project Status**: 🟡 In Progress  
**Last Updated**: ___________  
**Current Day**: Day ___ of 10

