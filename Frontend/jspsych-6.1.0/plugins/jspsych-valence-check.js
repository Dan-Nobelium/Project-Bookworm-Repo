
jsPsych.plugins['valence-check'] = (function () {
  var plugin = {};

  // Register preloads for images
  jsPsych.pluginAPI.registerPreload('valence-check-9-m', 'stimulus', 'image');

  plugin.info = {
    name: 'valence-check',
    description: '',
    parameters: {
      stimuli_and_text: {
        type: jsPsych.plugins.parameterType.ARRAY,
        pretty_name: 'Stimuli and text',
        default: null,
        description: 'Array of [stimulus, text] arrays'
      },      
      stimulus_height: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Image height',
        default: null,
        description: 'Set the image height in pixels',
      },
      stimulus_width: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Image width',
        default: null,
        description: 'Set the image width in pixels',
      },
      maintain_aspect_ratio: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Maintain aspect ratio',
        default: true,
        description: 'Maintain the aspect ratio after setting width or height',
      },
      min: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Min slider',
        default: 0,
        description: 'Sets the minimum value of the slider.',
      },
      max: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Max slider',
        default: 100,
        description: 'Sets the maximum value of the slider',
      },
      start: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Slider starting value',
        default: 50,
        description: 'Sets the starting value of the slider',
      },
      step: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Step',
        default: 1,
        description: 'Sets the step of the slider',
      },
      labels: {
        type: jsPsych.plugins.parameterType.HTML_STRING,
        pretty_name: 'Labels',
        default: [],
        array: true,
        description: 'Labels of the slider.',
      },
      slider_width: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Slider width',
        default: null,
        description: 'Width of the slider in pixels.',
      },
      button_label: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Button label',
        default: 'Continue',
        array: false,
        description: 'Label of the button to advance.',
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
      stimulus_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Stimulus duration',
        default: null,
        description: 'How long to hide the stimulus.',
      },
      trial_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Trial duration',
        default: null,
        description: 'How long to show the trial.',
      },
      response_ends_trial: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Response ends trial',
        default: true,
        description: 'If true, trial will end when user makes a response.',
      },
    },
  };

  plugin.trial = function (displayElement, trial) {
    // Initialize variables
    let html = '<div id="jspsych-valence-check-10-wrapper" style="margin: 100px 0px;">';
    let startTime;

    // Prompt
    if (trial.prompt != null) {
      html += `${trial.prompt}`;
      html += '<BR><BR>'
    }

    console.log(trial.stimuli_and_text);

    // Loop through all stimuli
    for (let pair of trial.stimuli_and_text) {
      let i = trial.stimuli_and_text.indexOf(pair) + 1;
      const slideIdBase = `jspsych-valence-check-10-slide-${i}`;
      const inputIdBase = `jspsych-valence-check-10-response${i}`;
      let stimulus = pair[0];
      let text = pair[1];

      if (stimulus[0] == "<") {
        html += `<div id="${slideIdBase}-stimulus">`;      
        html += `${stimulus}`;
        html += `</div>`;
      }
      else {
        html += `<div id="${slideIdBase}-stimulus">`;      
        html += `<img src="${stimulus}"`;
        html += `style="height:${trial.stimulus_height}px;";`;
        html += `></img></div>`;
      }

      if (text) {
        html += text;
        html += "<br><br>";
      }


      // Slider
      html += `<div class="jspsych-valence-check-10-container" style="position: relative; margin: 0 auto 3em auto; ";`;
      if (trial.slider_width != null) {
        html += `width:${trial.slider_width}px;`;
      }
      html += `>`;
      html += `<input type="range" value="${trial.start}" min="${trial.min}" max="${trial.max}" step="${trial.step}" style="width: 100%;" id="${inputIdBase}"></input>`;
      html += `<div>`;
      for (let j = 0; j < trial.labels.length; j++) {
        let width = 100 / (trial.labels.length - 1);
        let leftOffset = (j * (100 / (trial.labels.length - 1))) - (width / 2);
        html += `<div style="display:inline-block; position:absolute; left:${leftOffset}%; text-align:center; width:${width}%;"><span style="text-align:center; font-size:80%;">${trial.labels[j]}</span></div>`;
      }
      html += "</div>";
      html += "</div>";
      html += "<br><br>";

      // Horizontal Line Between Slides
      if (i < trial.stimuli_and_text.length) {
        html += "<hr>";
      }
    }

    // Submit Button
    html += `<button id="jspsych-valence-check-10-next" class="jspsych-btn" ${
      trial.require_movement ? "disabled" : ""
    }>${trial.button_label}</button>`;

    // Append generated HTML to displayElement
    displayElement.innerHTML = html;

    // Response Object Initialization
    const trialData = {};

    // Enable Next Button After Movement If Require_Movement Is True
    if (trial.require_movement) {
      document.querySelector(`#${inputIdBase}`).addEventListener("change", function () {
        document.querySelector("#jspsych-valence-check-10-next").disabled = false;
      });
    }

    // Event Listener For Click On The Submit Button
    document.querySelector("#jspsych-valence-check-10-next").addEventListener("click", function () {
      // Calculate RT
      const endTime = performance.now();
      trialData.rt = endTime - startTime;

      // Get Responses From All Sliders
      for (let i = 1; i <= trial.stimuli_and_text.length; i++) {
        trialData['val_' + i] = document.querySelector("#jspsych-valence-check-10-response" + i).value;        
      }
 
      // End Trial Or Disable The Submit Button Based On Settings
      if (trial.response_ends_trial) {
        end_trial();
      } else {
        document.querySelector("#jspsych-valence-check-10-next").disabled = true;
      }
    });
 
    // Function To Handle Timing And Data Collection Before Moving Onto The Next Trail
    function end_trial() {
      // Clear Timeouts
      jsPsych.pluginAPI.clearAllTimeouts();
 
      // Clean Up Display Element
      displayElement.innerHTML = "";
 
      // Finish Trial With Saved Data
      console.log('finishing trial with data:', trialData);
      jsPsych.finishTrial(trialData);
    }
 
    // Set Start Time For Performance Now
    startTime = performance.now();
 
    // Manage Duration Of The Trial Using setTimeout Functions
    if (trial.stimulus_duration != null) {
      jsPsych.pluginAPI.setTimeout(function () {
        document.querySelector(`#${slideIdBase}-stimulus`).style.visibility = "hidden";
      }, trial.stimulus_duration);
    }
 
    if (trial.trial_duration != null) {
      jsPsych.pluginAPI.setTimeout(function () {
        end_trial();
      }, trial.trial_duration);
    }
  };
 
  return plugin;
 })();