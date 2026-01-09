/**
 * API Client for submitting experiment data to backend
 * Replaces jatos.endStudy()
 * 
 * Usage:
 *   import { submitExperimentData } from './api-client.js';
 *   await submitExperimentData();
 */

// TODO: Update this with your Vercel deployment URL after deployment
// You can find this in your Vercel dashboard
const API_BASE_URL = 'https://project-bookworm-repo.vercel.app/api';
const EXPERIMENT_ID = 'planets-pirates-v1';  // Change per experiment version

/**
 * Submit experiment data to backend
 * @param {Object} options - Submission options
 * @param {string} options.participantId - Participant ID from URL (optional)
 * @param {string} options.group - Group assignment (optional)
 * @param {string} options.sample - Sample assignment (optional)
 * @returns {Promise<Object>} Response from server
 */
async function submitExperimentData(options = {}) {
  // Get values from options or from jsPsych data
  const participantId = options.participantId || 
    (typeof jsPsych !== 'undefined' ? jsPsych.data.getURLVariable('Subject_id') : null);
  
  const group = options.group || 
    (typeof jsPsych !== 'undefined' && jsPsych.data.get().values().length > 0 
      ? jsPsych.data.get().values()[0].group 
      : null);
  
  const sample = options.sample || 
    (typeof jsPsych !== 'undefined' && jsPsych.data.get().values().length > 0 
      ? jsPsych.data.get().values()[0].sample 
      : null);

  // Get all experiment data from jsPsych
  if (typeof jsPsych === 'undefined') {
    throw new Error('jsPsych is not loaded. Make sure jsPsych is loaded before this script.');
  }

  const experimentData = jsPsych.data.get().json();

  try {
    console.log('Submitting experiment data...', {
      participantId,
      experimentId: EXPERIMENT_ID,
      dataLength: experimentData.length
    });

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
      throw new Error(error.error || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Data submitted successfully:', result);
    return result;

  } catch (error) {
    console.error('Error submitting data:', error);
    
    // Optional: Save to localStorage as backup
    try {
      const backupKey = `experiment_backup_${Date.now()}`;
      localStorage.setItem(backupKey, JSON.stringify({
        participantId,
        experimentId: EXPERIMENT_ID,
        data: experimentData,
        group,
        sample,
        timestamp: new Date().toISOString(),
        error: error.message
      }));
      console.warn('Data saved to localStorage as backup:', backupKey);
    } catch (storageError) {
      console.error('Failed to save backup to localStorage:', storageError);
    }
    
    throw error;
  }
}

// Export for use in other files (if using modules)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { submitExperimentData };
}

