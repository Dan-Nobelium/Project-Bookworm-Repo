# Backend Implementation Guide: Supabase + Vercel

## Learning Path for CS Students

This guide explains how to replace JATOS with a modern serverless backend. You'll learn:
- **Serverless architecture** (functions-as-a-service)
- **RESTful API design**
- **Database design** (PostgreSQL)
- **Authentication** and security
- **Frontend-backend integration**

---

## Part 1: Understanding the Architecture

### Current System (JATOS)
```
┌─────────────┐
│   Browser   │
│  (jsPsych)  │
└──────┬──────┘
       │
       │ HTTP POST
       │ (experiment data)
       ▼
┌─────────────┐
│    JATOS    │  ← Java server running on Digital Ocean
│   Server    │     (you manage this)
└──────┬──────┘
       │
       │ Stores data
       ▼
┌─────────────┐
│   Database  │  ← JATOS internal storage
└─────────────┘
```

**Problems:**
- Requires server management
- Costs $6+/month
- Java-based (less common in modern web dev)
- Limited customization

### New System (Supabase + Vercel)
```
┌─────────────┐
│   Browser   │
│  (jsPsych)  │
└──────┬──────┘
       │
       │ HTTPS POST
       │ (experiment data)
       ▼
┌─────────────────────────────────┐
│      Vercel Edge Network       │  ← Global CDN (fast worldwide)
│  (Serverless Functions)        │
└──────┬──────────────────────────┘
       │
       │ API Request
       ▼
┌─────────────────────────────────┐
│      Supabase (PostgreSQL)     │  ← Managed database
│  - Auto-generated REST API     │     (you just use it)
│  - Real-time subscriptions     │
│  - Built-in auth               │
└─────────────────────────────────┘
```

**Benefits:**
- **Serverless**: No server to manage
- **Free tier**: $0/month for research volumes
- **Auto-scaling**: Handles traffic spikes automatically
- **Modern**: JavaScript/TypeScript (what you're learning)
- **Real-time**: Can build live analytics dashboard

---

## Part 2: Core Concepts Explained

### What is Serverless?

**Traditional Server:**
```
Your Code → Always-running server → Database
           (costs money 24/7)
```

**Serverless:**
```
Your Code → Function (sleeps when not used) → Database
           (only costs when executing)
```

**Vercel Functions:**
- You write a JavaScript function
- Vercel runs it when someone calls your API
- Function "wakes up" (cold start: ~100-500ms)
- Executes your code
- Returns response
- Function "sleeps" again

**Example:**
```javascript
// api/submit-data.js
export default async function handler(req, res) {
  // This function only runs when someone POSTs to /api/submit-data
  // When not in use, it doesn't cost anything
  return res.json({ message: "Hello!" });
}
```

### What is Supabase?

**Think of it as:**
- **Firebase** (if you've heard of it) but open-source
- **PostgreSQL database** (industry-standard SQL database)
- **Auto-generated REST API** (you don't write API code)
- **Real-time subscriptions** (like WebSockets, but easier)

**Key Features:**
1. **Database**: PostgreSQL (same as many companies use)
2. **API**: Automatically creates REST endpoints from your tables
3. **Auth**: Built-in user authentication
4. **Storage**: File storage (for experiment assets)
5. **Real-time**: Subscribe to database changes

---

## Part 3: Data Flow - Step by Step

### Current Flow (JATOS)
```javascript
// In Frontend/index.html
on_finish: () => jatos.endStudy(jsPsych.data.get().json())
```

**What happens:**
1. Experiment finishes
2. `jsPsych.data.get().json()` converts all trial data to JSON string
3. `jatos.endStudy()` sends it to JATOS server
4. JATOS stores it in its database

### New Flow (Supabase + Vercel)

**Step 1: Experiment finishes**
```javascript
// In Frontend/index.html (modified)
on_finish: async () => {
  const experimentData = jsPsych.data.get().json();
  await submitToBackend(experimentData);
}
```

**Step 2: Frontend sends data to Vercel function**
```javascript
// In Frontend/api-client.js (new file)
async function submitToBackend(data) {
  const response = await fetch('https://your-app.vercel.app/api/submit-data', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      participantId: jsPsych.data.getURLVariable('Subject_id'),
      experimentId: 'planets-pirates-v1',
      data: data
    })
  });
  
  if (!response.ok) {
    throw new Error('Failed to submit data');
  }
  
  return response.json();
}
```

**Step 3: Vercel function receives request**
```javascript
// api/submit-data.js (runs on Vercel)
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { participantId, experimentId, data } = req.body;

    // Insert into database
    const { data: result, error } = await supabase
      .from('experiment_responses')
      .insert({
        participant_id: participantId,
        experiment_id: experimentId,
        trial_data: data,  // JSONB column stores the full experiment data
        created_at: new Date().toISOString()
      });

    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ 
      success: true, 
      id: result.id 
    });
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
```

**Step 4: Supabase stores data**
- Automatically validates data
- Stores in PostgreSQL database
- Returns success/error

**Step 5: Response back to frontend**
- Frontend receives confirmation
- Can show success message to participant

---

## Part 4: Database Schema Design

### Understanding Your Data

**Current jsPsych data structure:**
```json
[
  {
    "trial_type": "planet-response-command",
    "trial_index": 0,
    "time_elapsed": 1234,
    "planets": ["planet_p.png", "planet_o.png"],
    "points_total": 100,
    "phase": "phase1",
    "block_number": 0,
    "subject_id": "P001",
    "group": "early_0.1"
  },
  {
    "trial_type": "valence-check",
    "trial_index": 1,
    "time_elapsed": 5000,
    "responses": {...},
    "phase": "val_check_5"
  }
  // ... more trials
]
```

### Database Tables

**Table 1: `participants`**
```sql
CREATE TABLE participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subject_id TEXT UNIQUE,  -- From URL parameter
  group_assignment TEXT,   -- "early_0.1", "late_0.4", etc.
  sample TEXT,             -- "ProA", "others"
  created_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);
```

**Why separate table?**
- One participant can have multiple experiments
- Track participant metadata separately
- Easier to query "all participants in group X"

**Table 2: `experiment_responses`**
```sql
CREATE TABLE experiment_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  participant_id UUID REFERENCES participants(id),
  experiment_id TEXT,        -- "planets-pirates-v1"
  trial_data JSONB,         -- The full jsPsych data array
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Why JSONB?**
- PostgreSQL's JSON type optimized for querying
- Can store entire jsPsych output without flattening
- Can query inside JSON: `WHERE trial_data->>'phase' = 'phase1'`
- Flexible: different experiments can have different structures

**Table 3: `experiments` (optional, for tracking)**
```sql
CREATE TABLE experiments (
  id TEXT PRIMARY KEY,       -- "planets-pirates-v1"
  name TEXT,                 -- "Planets and Pirates Study"
  version TEXT,              -- "1.0.0"
  created_at TIMESTAMP DEFAULT NOW(),
  status TEXT                -- "active", "completed", "archived"
);
```

### Indexes for Performance

```sql
-- Speed up queries by participant
CREATE INDEX idx_participant_id ON experiment_responses(participant_id);

-- Speed up queries by experiment
CREATE INDEX idx_experiment_id ON experiment_responses(experiment_id);

-- Speed up queries by creation date
CREATE INDEX idx_created_at ON experiment_responses(created_at);

-- Speed up JSON queries
CREATE INDEX idx_trial_data_phase ON experiment_responses 
  USING GIN ((trial_data->>'phase'));
```

**What are indexes?**
- Like a book's index: helps database find data faster
- Trade-off: Slightly slower writes, much faster reads
- Essential for queries on large datasets

---

## Part 5: Implementation Steps

### Step 1: Set Up Supabase

1. **Create account**: Go to [supabase.com](https://supabase.com)
2. **Create project**:
   - Click "New Project"
   - Name: "project-bookworm"
   - Database password: (save this!)
   - Region: Choose closest to you
3. **Get credentials**:
   - Go to Settings → API
   - Copy:
     - `Project URL` (e.g., `https://xxxxx.supabase.co`)
     - `anon public` key (safe to expose in frontend)
     - `service_role` key (keep secret! Only for backend)

### Step 2: Create Database Tables

**In Supabase Dashboard:**
1. Go to "SQL Editor"
2. Run this SQL:

```sql
-- Create participants table
CREATE TABLE participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subject_id TEXT UNIQUE,
  group_assignment TEXT,
  sample TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);

-- Create experiment_responses table
CREATE TABLE experiment_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  participant_id UUID REFERENCES participants(id),
  experiment_id TEXT NOT NULL,
  trial_data JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_participant_id ON experiment_responses(participant_id);
CREATE INDEX idx_experiment_id ON experiment_responses(experiment_id);
CREATE INDEX idx_created_at ON experiment_responses(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiment_responses ENABLE ROW LEVEL SECURITY;

-- Create policy: Allow inserts (for data collection)
CREATE POLICY "Allow public inserts" ON experiment_responses
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Create policy: Allow reads only for authenticated users (you)
CREATE POLICY "Allow authenticated reads" ON experiment_responses
  FOR SELECT
  TO authenticated
  USING (true);
```

**What is Row Level Security (RLS)?**
- PostgreSQL feature for fine-grained access control
- Policies define who can read/write what
- `anon` = anonymous (public, for data collection)
- `authenticated` = logged-in users (you, for viewing data)

### Step 3: Set Up Vercel Project

1. **Install Vercel CLI**:
```bash
npm install -g vercel
```

2. **Create project structure**:
```
project-bookworm/
├── Frontend/          (existing)
├── api/              (new - Vercel functions)
│   └── submit-data.js
├── package.json      (new)
└── vercel.json       (new - config)
```

3. **Initialize package.json**:
```bash
cd project-bookworm
npm init -y
npm install @supabase/supabase-js
```

4. **Create `api/submit-data.js`**:
```javascript
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
// These come from environment variables (set in Vercel dashboard)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY  // Use service role for backend
);

export default async function handler(req, res) {
  // CORS headers (allow requests from your frontend domain)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { participantId, experimentId, data, group, sample } = req.body;

    // Validate required fields
    if (!experimentId || !data) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Step 1: Create or get participant
    let participant;
    if (participantId) {
      // Check if participant exists
      const { data: existing } = await supabase
        .from('participants')
        .select('id')
        .eq('subject_id', participantId)
        .single();

      if (existing) {
        participant = existing;
      } else {
        // Create new participant
        const { data: newParticipant, error: participantError } = await supabase
          .from('participants')
          .insert({
            subject_id: participantId,
            group_assignment: group || null,
            sample: sample || null
          })
          .select()
          .single();

        if (participantError) {
          console.error('Participant creation error:', participantError);
          return res.status(500).json({ error: 'Failed to create participant' });
        }
        participant = newParticipant;
      }
    } else {
      // Anonymous participant (no subject_id)
      const { data: newParticipant, error: participantError } = await supabase
        .from('participants')
        .insert({
          group_assignment: group || null,
          sample: sample || null
        })
        .select()
        .single();

      if (participantError) {
        console.error('Participant creation error:', participantError);
        return res.status(500).json({ error: 'Failed to create participant' });
      }
      participant = newParticipant;
    }

    // Step 2: Store experiment data
    const { data: response, error: dataError } = await supabase
      .from('experiment_responses')
      .insert({
        participant_id: participant.id,
        experiment_id: experimentId,
        trial_data: typeof data === 'string' ? JSON.parse(data) : data
      })
      .select()
      .single();

    if (dataError) {
      console.error('Data insertion error:', dataError);
      return res.status(500).json({ error: 'Failed to save data' });
    }

    // Step 3: Update participant completion time
    await supabase
      .from('participants')
      .update({ completed_at: new Date().toISOString() })
      .eq('id', participant.id);

    return res.status(200).json({
      success: true,
      responseId: response.id,
      participantId: participant.id
    });

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
```

5. **Create `vercel.json`** (optional, for configuration):
```json
{
  "functions": {
    "api/submit-data.js": {
      "maxDuration": 10
    }
  },
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "*"
        }
      ]
    }
  ]
}
```

6. **Set environment variables in Vercel**:
   - Go to Vercel dashboard → Your project → Settings → Environment Variables
   - Add:
     - `SUPABASE_URL`: Your Supabase project URL
     - `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key (keep secret!)

### Step 4: Modify Frontend

**Create `Frontend/api-client.js`**:
```javascript
/**
 * API Client for submitting experiment data to backend
 * Replaces jatos.endStudy()
 */

const API_BASE_URL = 'https://your-app.vercel.app/api';  // Replace with your Vercel URL
const EXPERIMENT_ID = 'planets-pirates-v1';  // Change per experiment version

/**
 * Submit experiment data to backend
 * @param {Object} options - Submission options
 * @param {string} options.participantId - Participant ID from URL
 * @param {string} options.group - Group assignment
 * @param {string} options.sample - Sample assignment
 * @returns {Promise<Object>} Response from server
 */
async function submitExperimentData(options = {}) {
  const {
    participantId = jsPsych.data.getURLVariable('Subject_id'),
    group = jsPsych.data.get().values()[0]?.group,
    sample = jsPsych.data.get().values()[0]?.sample
  } = options;

  // Get all experiment data
  const experimentData = jsPsych.data.get().json();

  try {
    const response = await fetch(`${API_BASE_URL}/submit-data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        participantId: participantId || null,
        experimentId: EXPERIMENT_ID,
        data: experimentData,
        group: group,
        sample: sample
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to submit data');
    }

    const result = await response.json();
    console.log('Data submitted successfully:', result);
    return result;

  } catch (error) {
    console.error('Error submitting data:', error);
    
    // Fallback: Could save to localStorage or show error to user
    // For now, we'll just log it
    throw error;
  }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { submitExperimentData };
}
```

**Modify `Frontend/index.html`**:
```html
<!DOCTYPE html>
<html>
<head>
  <!-- ... existing head content ... -->
  <script src="text.js"></script>
  <script src="api-client.js"></script>  <!-- Add this -->
  <script src="app2.js"></script>
</head>
<body>
  <script>
    jsPsych.init({
      timeline: timeline,
      preload_images: images,
      on_finish: async () => {
        try {
          // Replace jatos.endStudy() with our new function
          await submitExperimentData();
          console.log('Experiment data submitted successfully');
          
          // Optional: Show success message to participant
          // You could add a final screen here
        } catch (error) {
          console.error('Failed to submit data:', error);
          // Optional: Show error message or retry logic
        }
      },
    });

    // Remove jatos.onLoad() - not needed anymore
    // jatos.onLoad(() => {
    //   jsPsych.run(timeline);
    // });
  </script>
</body>
</html>
```

### Step 5: Deploy to Vercel

1. **Install Vercel CLI** (if not already):
```bash
npm install -g vercel
```

2. **Login**:
```bash
vercel login
```

3. **Deploy**:
```bash
vercel
```

4. **Follow prompts**:
   - Link to existing project? No (first time)
   - Project name: project-bookworm
   - Directory: ./
   - Override settings? No

5. **Update API_BASE_URL** in `Frontend/api-client.js` with your Vercel URL

---

## Part 6: Testing

### Test Locally First

1. **Install Vercel CLI dev server**:
```bash
npm install -g vercel
vercel dev
```

2. **Test API endpoint**:
```bash
curl -X POST http://localhost:3000/api/submit-data \
  -H "Content-Type: application/json" \
  -d '{
    "participantId": "test-001",
    "experimentId": "planets-pirates-v1",
    "data": [{"trial_type": "test", "trial_index": 0}],
    "group": "early_0.1"
  }'
```

3. **Check Supabase**:
   - Go to Supabase dashboard → Table Editor
   - Check `participants` and `experiment_responses` tables
   - Should see your test data

### Test Full Flow

1. **Run experiment locally**
2. **Complete experiment**
3. **Check browser console** for success/error
4. **Verify in Supabase** that data was saved

---

## Part 7: Querying Your Data

### Using Supabase Dashboard

1. **Go to Table Editor**:
   - View all participants
   - View all experiment responses
   - Filter, sort, search

2. **Use SQL Editor** for complex queries:

```sql
-- Get all participants who completed
SELECT * FROM participants 
WHERE completed_at IS NOT NULL;

-- Get experiment data for a specific participant
SELECT * FROM experiment_responses
WHERE participant_id = 'uuid-here';

-- Count participants by group
SELECT group_assignment, COUNT(*) 
FROM participants 
GROUP BY group_assignment;

-- Get all phase1 trials
SELECT * FROM experiment_responses
WHERE trial_data->>'phase' = 'phase1';
```

### Using Supabase JavaScript Client (for Analytics Dashboard)

```javascript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'YOUR_SUPABASE_URL',
  'YOUR_SUPABASE_ANON_KEY'
);

// Get all responses
const { data, error } = await supabase
  .from('experiment_responses')
  .select('*')
  .order('created_at', { ascending: false });

// Get responses for specific experiment
const { data } = await supabase
  .from('experiment_responses')
  .select('*')
  .eq('experiment_id', 'planets-pirates-v1');

// Real-time subscription (for live dashboard)
supabase
  .from('experiment_responses')
  .on('INSERT', (payload) => {
    console.log('New response received!', payload.new);
    // Update your dashboard in real-time
  })
  .subscribe();
```

---

## Part 8: Learning Resources

### Concepts to Learn

1. **RESTful APIs**:
   - [MDN: HTTP Methods](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods)
   - [REST API Tutorial](https://restfulapi.net/)

2. **PostgreSQL**:
   - [PostgreSQL Tutorial](https://www.postgresqltutorial.com/)
   - [JSONB in PostgreSQL](https://www.postgresql.org/docs/current/datatype-json.html)

3. **Serverless Functions**:
   - [Vercel Functions Docs](https://vercel.com/docs/functions)
   - [AWS Lambda (similar concept)](https://aws.amazon.com/lambda/)

4. **Supabase**:
   - [Supabase Docs](https://supabase.com/docs)
   - [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)

### Practice Projects

1. **Build a simple API**:
   - Create a function that accepts name, returns greeting
   - Deploy to Vercel
   - Test with Postman or curl

2. **Database queries**:
   - Practice SQL queries in Supabase SQL Editor
   - Learn JOINs, aggregations, filtering

3. **Real-time dashboard**:
   - Build a simple HTML page that shows experiment data
   - Use Supabase real-time to update automatically

---

## Part 9: Common Issues & Solutions

### Issue: CORS Errors

**Error**: `Access-Control-Allow-Origin` header missing

**Solution**: Add CORS headers in your Vercel function:
```javascript
res.setHeader('Access-Control-Allow-Origin', '*');
```

### Issue: Cold Start Delay

**Problem**: First request after inactivity is slow

**Solution**: 
- Acceptable for research (participants don't notice)
- Can use Vercel Pro for faster cold starts
- Or keep function warm with scheduled ping

### Issue: Database Connection Limits

**Problem**: Too many concurrent connections

**Solution**: 
- Supabase free tier: 60 connections (usually enough)
- Use connection pooling
- Upgrade if needed

### Issue: Data Not Saving

**Debug steps**:
1. Check browser console for errors
2. Check Vercel function logs (Vercel dashboard → Functions → Logs)
3. Check Supabase logs (Supabase dashboard → Logs)
4. Verify environment variables are set correctly

---

## Part 10: Next Steps

1. **Implement basic version** (this guide)
2. **Add error handling** (retry logic, fallback storage)
3. **Add authentication** (protect admin endpoints)
4. **Build analytics dashboard** (using Supabase real-time)
5. **Add data export** (CSV, JSON download)
6. **Implement participant management** (from spec)

---

## Summary

**What you've learned:**
- ✅ Serverless architecture (functions-as-a-service)
- ✅ RESTful API design
- ✅ Database schema design (PostgreSQL)
- ✅ Frontend-backend integration
- ✅ Modern web development stack

**What you've built:**
- ✅ Replacement for JATOS (free, modern, scalable)
- ✅ Data collection system
- ✅ Foundation for analytics dashboard

**Next:**
- Build the analytics dashboard (Part 2)
- Add experiment builder (Part 3)
- Add participant management (Part 4)

---

*Questions? Check the troubleshooting section or review the code examples above.*

