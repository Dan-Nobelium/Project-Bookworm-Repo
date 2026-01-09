# Backend Options Analysis - Project Bookworm

## Current State

**Current Setup:**
- Data collection via JATOS (Java-based experiment server)
- Data sent as JSON at experiment completion: `jatos.endStudy(jsPsych.data.get().json())`
- Deployed on Digital Ocean ($6/month minimum)
- Data includes: trial-by-trial responses, timestamps, behavioral data, questionnaire responses

**Data Volume Estimates:**
- Per participant: ~50-200KB (depending on experiment length)
- 100 participants: ~5-20MB
- 1000 participants: ~50-200MB
- Expected traffic: Low to moderate (research studies typically have 50-500 participants)

---

## Option 1: Serverless + Free Tier Cloud Database (Recommended for Start)

### Architecture
```
Frontend (Static Hosting) → API Gateway → Serverless Functions → Free Tier Database
```

### Technology Stack

**Backend API:**
- **Vercel** (Free tier) or **Netlify Functions** (Free tier)
  - 100GB bandwidth/month free
  - 100 hours execution time/month
  - Auto-scaling, zero maintenance
  - Global CDN included

**Database:**
- **Supabase** (Free tier) - PostgreSQL-based
  - 500MB database storage
  - 2GB bandwidth/month
  - Real-time subscriptions included
  - Built-in authentication
  - Auto-generated REST API

**Alternative Database Options:**
- **PlanetScale** (Free tier) - MySQL-compatible
  - 5GB storage free
  - 1 billion row reads/month
  - Branching (database versioning)
- **Neon** (Free tier) - Serverless PostgreSQL
  - 0.5GB storage free
  - Auto-scaling
  - Branching support

### Cost Breakdown
- **Vercel/Netlify**: $0/month (free tier sufficient for research)
- **Supabase**: $0/month (free tier)
- **Total**: **$0/month**

### Pros
✅ **Completely free** for typical research volumes  
✅ **Zero server maintenance** - fully managed  
✅ **Auto-scaling** - handles traffic spikes automatically  
✅ **Global CDN** - fast worldwide  
✅ **Built-in authentication** (Supabase)  
✅ **Real-time capabilities** for analytics dashboard  
✅ **Easy deployment** - git push to deploy  
✅ **Generous free tiers** - can handle 1000+ participants  

### Cons
⚠️ **Cold starts** - first request after inactivity may be slow (1-2 seconds)  
⚠️ **Function timeout limits** - 10 seconds (Vercel) or 26 seconds (Netlify)  
⚠️ **Database size limits** - may need upgrade for very large studies  
⚠️ **Vendor lock-in** - harder to migrate later  

### Performance
- **Latency**: 50-200ms (after cold start)
- **Throughput**: Handles 100+ concurrent participants easily
- **Scalability**: Excellent - auto-scales to demand
- **Uptime**: 99.9% SLA (Vercel Pro, but free tier is reliable)

### Implementation Complexity
- **Low-Medium** - Requires learning serverless patterns
- **Time to deploy**: 1-2 days for basic setup

### Best For
- Starting out with zero budget
- Low to moderate traffic (typical research studies)
- Teams wanting minimal infrastructure management
- Rapid prototyping

---

## Option 2: Self-Hosted on Oracle Cloud Free Tier (Maximum Control)

### Architecture
```
Frontend (Static/CDN) → Nginx Reverse Proxy → Backend API → PostgreSQL Database
All running on Oracle Cloud Always Free Tier
```

### Technology Stack

**Infrastructure:**
- **Oracle Cloud Infrastructure (OCI) Always Free Tier**
  - 2 AMD-based VMs (1/8 OCPU, 1GB RAM each)
  - 4 ARM-based VMs (Ampere A1: 4 OCPUs, 24GB RAM total)
  - 200GB block storage
  - 10TB egress bandwidth/month
  - **No credit card required** (unlike AWS/GCP)

**Backend:**
- **Node.js/Express** or **Python/FastAPI**
- **PostgreSQL** (self-hosted on VM)
- **Redis** (for caching, optional)
- **Docker** (containerization)

**Deployment:**
- Docker Compose for orchestration
- Nginx as reverse proxy
- Let's Encrypt for SSL (free)

### Cost Breakdown
- **Oracle Cloud**: $0/month (always free, no expiration)
- **Domain name**: $10-15/year (optional, can use free subdomain)
- **Total**: **$0-1.25/month**

### Pros
✅ **Truly free forever** - no credit card needed  
✅ **Full control** - complete customization  
✅ **No vendor lock-in** - standard technologies  
✅ **Generous resources** - 24GB RAM total (ARM instances)  
✅ **High bandwidth** - 10TB/month free  
✅ **Can run multiple services** - API, database, Redis, etc.  
✅ **No cold starts** - always-on servers  
✅ **Privacy** - data stays on your infrastructure  

### Cons
⚠️ **Requires technical expertise** - server management, security, updates  
⚠️ **Manual scaling** - need to configure load balancing yourself  
⚠️ **No managed services** - you handle backups, monitoring, etc.  
⚠️ **Setup complexity** - more initial work  
⚠️ **Oracle Cloud learning curve** - different from AWS/GCP  
⚠️ **ARM architecture** - may need to compile some dependencies  

### Performance
- **Latency**: 20-100ms (depending on location)
- **Throughput**: Can handle 50-200 concurrent participants (depends on app optimization)
- **Scalability**: Manual - need to add more VMs or upgrade
- **Uptime**: Depends on your configuration (typically 99%+ with proper setup)

### Implementation Complexity
- **High** - Requires DevOps knowledge
- **Time to deploy**: 3-5 days for full setup with security hardening

### Best For
- Teams with DevOps experience
- Maximum privacy/control requirements
- Long-term projects (no risk of free tier changes)
- Learning infrastructure management

---

## Option 3: Railway/Render Free Tier + Managed Database (Balanced)

### Architecture
```
Frontend (Static) → Railway/Render Backend → Managed PostgreSQL
```

### Technology Stack

**Backend Hosting:**
- **Railway** (Free tier)
  - $5 free credit/month (enough for small apps)
  - Auto-deploy from GitHub
  - Built-in PostgreSQL option
  - Simple pricing model

- **Render** (Free tier alternative)
  - Free tier with limitations
  - Auto-SSL
  - Zero-downtime deploys

**Database:**
- **Railway PostgreSQL** (included) or
- **Supabase** (separate, free tier)
- **Neon** (serverless PostgreSQL, free tier)

### Cost Breakdown
- **Railway**: $0-5/month (free credit usually covers small apps)
- **Database**: $0/month (if using free tier)
- **Total**: **$0-5/month** (typically free for research volumes)

### Pros
✅ **Easy deployment** - GitHub integration, auto-deploy  
✅ **Managed infrastructure** - less maintenance than self-hosted  
✅ **Good developer experience** - modern platform  
✅ **Free tier is generous** - $5 credit/month  
✅ **Built-in database** option  
✅ **Auto-scaling** capabilities  
✅ **Good documentation** and community  

### Cons
⚠️ **Free tier limitations** - may need to pay if traffic grows  
⚠️ **Less control** than self-hosting  
⚠️ **Platform dependency** - vendor lock-in  
⚠️ **Resource limits** - apps may sleep after inactivity (Render)  
⚠️ **Cost uncertainty** - pay-as-you-go can surprise  

### Performance
- **Latency**: 100-300ms
- **Throughput**: Good for moderate traffic
- **Scalability**: Auto-scales but may incur costs
- **Uptime**: 99.9%+ (managed platform)

### Implementation Complexity
- **Low** - Very easy to get started
- **Time to deploy**: 1 day for basic setup

### Best For
- Quick deployment needs
- Teams wanting managed infrastructure without full cloud complexity
- Projects that may scale but want simple pricing
- Good balance of ease and control

---

## Detailed Comparison Matrix

| Feature | Option 1: Serverless | Option 2: Self-Hosted | Option 3: Railway/Render |
|--------|---------------------|----------------------|------------------------|
| **Monthly Cost** | $0 | $0 | $0-5 |
| **Setup Time** | 1-2 days | 3-5 days | 1 day |
| **Maintenance** | None | High | Low |
| **Scalability** | Excellent | Manual | Good |
| **Performance** | Good (cold starts) | Excellent | Good |
| **Control** | Low | High | Medium |
| **Learning Curve** | Medium | High | Low |
| **Data Privacy** | Medium | High | Medium |
| **Vendor Lock-in** | High | None | Medium |
| **Free Tier Limits** | Generous | Very Generous | Moderate |
| **Best For** | Starting out | Long-term control | Quick deployment |

---

## Recommendation by Use Case

### 🎯 **Starting Out / MVP** → **Option 1 (Serverless)**
- Fastest to deploy
- Zero maintenance
- Free tier handles typical research volumes
- Can migrate later if needed

### 🏗️ **Long-term / Maximum Control** → **Option 2 (Self-Hosted)**
- Truly free forever
- Complete control
- No vendor dependencies
- Best for privacy-sensitive research

### ⚡ **Quick Launch / Balanced** → **Option 3 (Railway/Render)**
- Easiest deployment
- Managed but flexible
- Good for teams wanting simplicity

---

## Migration Path

**Recommended Approach:**
1. **Start with Option 1** (Serverless) - Get platform running quickly
2. **Monitor costs and usage** - Track if free tier is sufficient
3. **Migrate to Option 2** (Self-Hosted) if:
   - Free tier limits are reached
   - Need more control/privacy
   - Have DevOps resources
4. **Stay with Option 1** if:
   - Free tier is sufficient
   - Team prefers managed services
   - Focus is on research, not infrastructure

---

## Implementation Details for Recommended Option (Option 1)

### Tech Stack Specifics

**API Framework:**
```javascript
// Vercel Serverless Function Example
// api/submit-data.js
export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { experimentData, participantId } = req.body;
    
    // Save to Supabase
    const { data, error } = await supabase
      .from('experiment_responses')
      .insert([{
        participant_id: participantId,
        data: experimentData,
        created_at: new Date()
      }]);
    
    if (error) return res.status(500).json({ error });
    return res.status(200).json({ success: true });
  }
}
```

**Database Schema (Supabase):**
```sql
-- Participants table
CREATE TABLE participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subject_id TEXT,
  group_assignment TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Experiment responses table
CREATE TABLE experiment_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  participant_id UUID REFERENCES participants(id),
  experiment_id TEXT,
  trial_data JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_participant_id ON experiment_responses(participant_id);
CREATE INDEX idx_experiment_id ON experiment_responses(experiment_id);
```

**Frontend Integration:**
```javascript
// Replace jatos.endStudy() with:
async function submitExperimentData(data) {
  const response = await fetch('/api/submit-data', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      participantId: jsPsych.data.getURLVariable('Subject_id'),
      experimentData: jsPsych.data.get().json()
    })
  });
  return response.json();
}
```

---

## Cost Projections (If Free Tier Exceeded)

### Option 1 (Serverless)
- **Vercel Pro**: $20/month (if free tier exceeded)
- **Supabase Pro**: $25/month (if free tier exceeded)
- **Total if scaling**: $45/month

### Option 2 (Self-Hosted)
- **Oracle Cloud**: $0/month (always free)
- **Domain**: $10-15/year
- **Total**: $0-1.25/month (stays free)

### Option 3 (Railway/Render)
- **Railway**: Pay-as-you-go, ~$5-20/month for moderate usage
- **Render**: Free tier or $7/month for web services
- **Total**: $0-20/month

---

## Security Considerations

### All Options Should Include:
- ✅ HTTPS/SSL encryption
- ✅ API authentication (API keys or JWT)
- ✅ Input validation and sanitization
- ✅ Rate limiting
- ✅ CORS configuration
- ✅ Data encryption at rest (database)
- ✅ Regular backups

### Option-Specific:
- **Option 1**: Managed security by platform
- **Option 2**: You handle all security (firewall, updates, etc.)
- **Option 3**: Platform handles most security

---

## Final Recommendation

**For Project Bookworm, I recommend starting with Option 1 (Serverless + Supabase):**

1. **Zero cost** - Completely free for research volumes
2. **Fast deployment** - Get running in 1-2 days
3. **No maintenance** - Focus on research, not infrastructure
4. **Scalable** - Can handle growth automatically
5. **Real-time ready** - Supabase has built-in real-time for analytics dashboard
6. **Easy migration** - Can move to self-hosted later if needed

**Migration path**: Start with Option 1, monitor usage, migrate to Option 2 if free tier becomes limiting or if you need more control.

---

*Last Updated: [Current Date]*  
*Next Steps: Choose option and begin implementation planning*

