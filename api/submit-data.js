import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
// These environment variables are set in Vercel dashboard
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY  // Use service role for backend (has full access)
);

export default async function handler(req, res) {
  // CORS headers - allow requests from your frontend domain
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests (browser checks before actual request)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { participantId, experimentId, data, group, sample } = req.body;

    // Validate required fields
    if (!experimentId || !data) {
      return res.status(400).json({ 
        error: 'Missing required fields: experimentId and data are required' 
      });
    }

    // Step 1: Create or get participant
    let participant;
    
    if (participantId) {
      // Check if participant already exists
      const { data: existing, error: fetchError } = await supabase
        .from('participants')
        .select('id')
        .eq('subject_id', participantId)
        .single();

      if (existing) {
        // Participant exists, use their ID
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
          return res.status(500).json({ 
            error: 'Failed to create participant',
            details: participantError.message 
          });
        }
        participant = newParticipant;
      }
    } else {
      // Anonymous participant (no subject_id provided)
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
        return res.status(500).json({ 
          error: 'Failed to create participant',
          details: participantError.message 
        });
      }
      participant = newParticipant;
    }

    // Step 2: Store experiment data
    // Parse data if it's a string (jsPsych sometimes returns JSON string)
    const trialData = typeof data === 'string' ? JSON.parse(data) : data;

    const { data: response, error: dataError } = await supabase
      .from('experiment_responses')
      .insert({
        participant_id: participant.id,
        experiment_id: experimentId,
        trial_data: trialData
      })
      .select()
      .single();

    if (dataError) {
      console.error('Data insertion error:', dataError);
      return res.status(500).json({ 
        error: 'Failed to save experiment data',
        details: dataError.message 
      });
    }

    // Step 3: Update participant completion time
    await supabase
      .from('participants')
      .update({ completed_at: new Date().toISOString() })
      .eq('id', participant.id);

    // Success response
    return res.status(200).json({
      success: true,
      responseId: response.id,
      participantId: participant.id,
      message: 'Data saved successfully'
    });

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
}

