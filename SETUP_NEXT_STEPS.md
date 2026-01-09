# Next Steps: Complete Backend Setup

## ✅ What You've Done
- [x] Created Vercel account
- [x] Linked GitHub repository
- [x] Deployment is live
- [x] Created API function structure
- [x] Created frontend API client

## 🎯 What's Next (In Order)

### Step 1: Set Up Supabase (15 minutes)

1. **Create Supabase Account**
   - Go to [supabase.com](https://supabase.com)
   - Sign up with GitHub (easiest)
   - Verify your email

2. **Create New Project**
   - Click "New Project"
   - Organization: Create new or use default
   - Project name: `project-bookworm`
   - Database password: **SAVE THIS!** You'll need it
   - Region: Choose closest to you (or where participants are)
   - Click "Create new project"
   - Wait 2-3 minutes for setup

3. **Get Your Credentials**
   - Once project is ready, go to **Settings** → **API**
   - Copy these (you'll need them):
     - **Project URL**: `https://xxxxx.supabase.co`
     - **anon public** key (long string starting with `eyJ...`)
     - **service_role** key (long string, **KEEP SECRET!**)

### Step 2: Create Database Tables (10 minutes)

1. **Open SQL Editor**
   - In Supabase dashboard, click **SQL Editor** in left sidebar
   - Click **New query**

2. **Run This SQL** (copy and paste):

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

-- Create indexes for performance
CREATE INDEX idx_participant_id ON experiment_responses(participant_id);
CREATE INDEX idx_experiment_id ON experiment_responses(experiment_id);
CREATE INDEX idx_created_at ON experiment_responses(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiment_responses ENABLE ROW LEVEL SECURITY;

-- Create policy: Allow public inserts (for data collection)
CREATE POLICY "Allow public inserts" ON experiment_responses
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Create policy: Allow authenticated reads (for you to view data)
CREATE POLICY "Allow authenticated reads" ON experiment_responses
  FOR SELECT
  TO authenticated
  USING (true);
```

3. **Click "Run"** (or press Ctrl+Enter)
4. **Verify**: Go to **Table Editor** → You should see both tables

### Step 3: Configure Vercel Environment Variables (5 minutes)

1. **Go to Vercel Dashboard**
   - Visit [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click on your project: `project-bookworm-repo`

2. **Add Environment Variables**
   - Go to **Settings** → **Environment Variables**
   - Add these two variables:

   **Variable 1:**
   - Name: `SUPABASE_URL`
   - Value: Your Supabase Project URL (from Step 1)
   - Environment: Production, Preview, Development (check all)
   - Click "Save"

   **Variable 2:**
   - Name: `SUPABASE_SERVICE_ROLE_KEY`
   - Value: Your Supabase service_role key (from Step 1)
   - Environment: Production, Preview, Development (check all)
   - Click "Save"

3. **Redeploy** (so new env vars are used)
   - Go to **Deployments** tab
   - Click the three dots (⋯) on latest deployment
   - Click "Redeploy"
   - Or just push a new commit to trigger redeploy

### Step 4: Update Frontend API Client (2 minutes)

1. **Update API URL**
   - Open `Frontend/api-client.js`
   - Find line: `const API_BASE_URL = 'https://project-bookworm-repo.vercel.app/api';`
   - Update if your Vercel URL is different (check your Vercel dashboard)
   - Save file

2. **Commit and Push**
   ```bash
   git add .
   git commit -m "Add backend API and Supabase integration"
   git push
   ```

### Step 5: Modify Frontend to Use New Backend (5 minutes)

1. **Backup Current File**
   ```bash
   cp Frontend/index.html Frontend/index.html.backup
   ```

2. **Edit `Frontend/index.html`**
   - Remove this line:
     ```html
     <script src="jatos.js"></script>
     ```
   
   - Add this line (after text.js, before app2.js):
     ```html
     <script src="api-client.js"></script>
     ```
   
   - Replace this:
     ```javascript
     on_finish: () => jatos.endStudy(jsPsych.data.get().json()),
     ```
   
   - With this:
     ```javascript
     on_finish: async () => {
       try {
         await submitExperimentData();
         console.log('Experiment data submitted successfully');
       } catch (error) {
         console.error('Failed to submit data:', error);
         alert('There was an error saving your data. Please contact the researcher.');
       }
     },
     ```
   
   - Remove or comment out:
     ```javascript
     jatos.onLoad(() => {
       jsPsych.run(timeline);
     });
     ```
   
   - The experiment should start automatically (jsPsych.init already runs it)

3. **Save and Commit**
   ```bash
   git add Frontend/index.html
   git commit -m "Replace JATOS with new backend API"
   git push
   ```

### Step 6: Test Everything (10 minutes)

1. **Wait for Vercel Deployment**
   - Check Vercel dashboard - should see new deployment
   - Wait for it to finish (usually 1-2 minutes)

2. **Test API Endpoint Directly**
   - Open your browser console
   - Or use curl:
   ```bash
   curl -X POST https://project-bookworm-repo.vercel.app/api/submit-data \
     -H "Content-Type: application/json" \
     -d '{
       "participantId": "test-001",
       "experimentId": "test",
       "data": [{"trial_type": "test", "trial_index": 0}],
       "group": "early_0.1"
     }'
   ```
   - Should return: `{"success": true, ...}`

3. **Test Full Experiment**
   - Visit your deployed site
   - Complete the experiment (or skip through quickly)
   - Check browser console for success message
   - Check Supabase dashboard → Table Editor → `experiment_responses`
   - You should see your test data!

4. **Verify Data in Supabase**
   - Go to Supabase → Table Editor
   - Check `participants` table - should have your test participant
   - Check `experiment_responses` table - should have experiment data
   - Click on a row to see the JSONB data

## ✅ Success Checklist

- [ ] Supabase project created
- [ ] Database tables created
- [ ] Vercel environment variables set
- [ ] Frontend modified to use new API
- [ ] API endpoint responds correctly
- [ ] Test experiment completes successfully
- [ ] Data appears in Supabase database

## 🐛 Troubleshooting

### API returns 500 error
- Check Vercel function logs (Deployments → Click deployment → Functions → View logs)
- Verify environment variables are set correctly
- Check Supabase credentials are correct

### CORS errors
- Verify `vercel.json` is committed and deployed
- Check API function has CORS headers (already included in code)

### Data not saving
- Check browser console for errors
- Check Vercel function logs
- Verify Supabase RLS policies are set correctly
- Check Supabase logs (Settings → Logs)

### "jsPsych is not loaded" error
- Make sure `api-client.js` is loaded AFTER `jspsych.js`
- Check script order in `index.html`

## 🎉 Next Steps After This Works

Once data collection is working:
1. Test with multiple participants
2. Build the data visualization dashboard (Week 2)
3. Add error handling improvements
4. Add retry logic for failed submissions

---

**Need Help?** Check:
- `BACKEND_IMPLEMENTATION_GUIDE.md` for detailed explanations
- Vercel function logs for errors
- Supabase logs for database errors
- Browser console for frontend errors

