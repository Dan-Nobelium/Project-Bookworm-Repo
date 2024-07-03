jsPsych.plugins['valence-check-all'] = (function() {
  var plugin = {};

  plugin.info = {
    name: 'valence-check-all',
    description: 'A plugin for checking valence ratings for multiple stimuli',
    parameters: {
      stimuli: {
        type: jsPsych.plugins.parameterType.COMPLEX,
        array: true,
        pretty_name: 'Stimuli',
        default: undefined,
        description: 'An array of objects containing stimulus information.',
      },
      labels: {
        type: jsPsych.plugins.parameterType.HTML_STRING,
        pretty_name: 'Labels',
        default: [],
        array: true,
        description: 'Labels for the slider.',
      },
      stimulus_height: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Stimulus height',
        default: null,
        description: 'Height of the stimuli in pixels.',
      },
      slider_width: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Slider width',
        default: null,
        description: 'Width of the sliders in pixels.',
      },
      require_movement: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Require movement',
        default: false,
        description: 'If true, the participant will have to move the slider before continuing.',
      },
      prompt: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Prompt',
        default: null,
        description: 'Any content here will be displayed at the top of the screen.',
      },
    }
  };

  plugin.trial = function(display_element, trial) {
    // Initialize HTML
    var html = '';

    // Add prompt if available
    if (trial.prompt !== null) {
      html += `<div class="jspsych-valence-check-all-prompt">${trial.prompt}</div>`;
    }

    // Generate HTML for each stimulus
    html += '<div class="jspsych-valence-check-all-stimuli">';
    for (var i = 0; i < trial.stimuli.length; i++) {
      var stimulus = trial.stimuli[i];
      var stimulus_id = 'jspsych-valence-check-all-stimulus-' + i;
      var slider_id = 'jspsych-valence-check-all-slider-' + i;

      html += `
        <div class="jspsych-valence-check-all-stimulus">
          <img src="${stimulus.image}" alt="Stimulus ${i}" height="${trial.stimulus_height}">
          <p>${stimulus.text}</p>
          <input type="range" class="jspsych-slider" id="${slider_id}" min="0" max="100" value="50" step="1" width="${trial.slider_width}">
        </div>
      `;
    }
    html += '</div>';

    // Add submit button
    html += '<button id="jspsych-valence-check-all-next" class="jspsych-btn">Next</button>';

    // Display HTML
    display_element.innerHTML = html;

    // Initialize response object
    var response = {};

    // Add event listener to submit button
    display_element.querySelector('#jspsych-valence-check-all-next').addEventListener('click', function() {
      // Retrieve response values
      for (var i = 0; i < trial.stimuli.length; i++) {
        var slider_id = 'jspsych-valence-check-all-slider-' + i;
        response[trial.stimuli[i].id] = display_element.querySelector('#' + slider_id).value;
      }

      // End trial
      var trial_data = {
        "rt": response.rt,
        "responses": JSON.stringify(response),
        "stimulus": JSON.stringify(trial.stimuli),
      };

      // Clear display
      display_element.innerHTML = '';

      // Finish trial
      jsPsych.finishTrial(trial_data);
    });

    // Store response start time
    var startTime = performance.now();
  };

  return plugin;
})();