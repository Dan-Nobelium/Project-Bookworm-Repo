
jsPsych.plugins['valence-check-9'] = (function () {
  var plugin = {};

  // Register preloads for images
  jsPsych.pluginAPI.registerPreload('valence-check-9', 'stimulus', 'image');

  plugin.info = {
    name: 'valence-check-10',
    description: '',
    parameters: {
      win_100_text: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Win 100 text',
        default: '',
        description: 'The text for winning 100 points.',
      },
      ship_outcome_1_unshielded: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Ship outcome 1 unshielded',
        default: '',
        description: 'The text for ship outcome 1 unshielded.',
      },
      ship_outcome_2_unshielded: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Ship outcome 2 unshielded',
        default: '',
        description: 'The text for ship outcome 2 unshielded.',
      },
      stimulus_4: {
        type: jsPsych.plugins.parameterType.IMAGE,
        pretty_name: 'Stimulus 4',
        default: undefined,
        description: 'The fourth image to be displayed',
      },
      stim_text_4: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Stimulus text 4',
        default: null,
        description: 'Any content here will be displayed with stimulus 4.',
      },
      stimulus_5: {
        type: jsPsych.plugins.parameterType.IMAGE,
        pretty_name: 'Stimulus 5',
        default: undefined,
        description: 'The fifth image to be displayed',
      },
      stim_text_5: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Stimulus text 5',
        default: null,
        description: 'Any content here will be displayed with stimulus 5.',
      },
      stimulus_6: {
        type: jsPsych.plugins.parameterType.IMAGE,
        pretty_name: 'Stimulus 6',
        default: undefined,
        description: 'The sixth image to be displayed',
      },
      stim_text_6: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Stimulus text 6',
        default: null,
        description: 'Any content here will be displayed with stimulus 6.',
      },
      stimulus_7: {
        type: jsPsych.plugins.parameterType.IMAGE,
        pretty_name: 'Stimulus 7',
        default: undefined,
        description: 'The seventh image to be displayed',
      },
      stim_text_7: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Stimulus text 7',
        default: null,
        description: 'Any content here will be displayed with stimulus 7.',
      },
      stimulus_8: {
        type: jsPsych.plugins.parameterType.IMAGE,
        pretty_name: 'Stimulus 8',
        default: undefined,
        description: 'The eighth image to be displayed',
      },
      stim_text_8: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Stimulus text 8',
        default: null,
        description: 'Any content here will be displayed with stimulus 8.',
      },
      stimulus_9: {
        type: jsPsych.plugins.parameterType.IMAGE,
        pretty_name: 'Stimulus 9',
        default: undefined,
        description: 'The ninth image to be displayed',
      },
      stim_text_9: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Stimulus text 9',
        default: null,
        description: 'Any content here will be displayed with stimulus 9.',
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
      html += `${trial.prompt}



`;
    }

    // Text Variables
    html += `<div id="jspsych-valence-check-10-slide-1-stimulus">${trial.win_100_text}</div>
`;
    html += `<div class="jspsych-valence-check-10-container" style="position: relative; margin: 0 auto 3em auto; ";`;
    if (trial.slider_width != null) {
      html += `width:${trial.slider_width}px;`;
    }
    html += `>`;
    html += `<input type="range" value="${trial.start}" min="${trial.min}" max="${trial.max}" step="${trial.step}" style="width: 100%;" id="jspsych-valence-check-10-response1"></input>`;
    html += `<div>`;
    for (let j = 0; j < trial.labels.length; j++) {
      let width = 100 / (trial.labels.length - 1);
      let leftOffset = (j * (100 / (trial.labels.length - 1))) - (width / 2);
      html += `<div style="display:inline-block; position:absolute; left:${leftOffset}%; text-align:center; width:${width}%;"><span style="text-align:center; font-size:80%;">${trial.labels[j]}</span></div>`;
    }
    html += "</div>";
    html += "</div>";
    html += "</div>";
    html += "<hr>";

    html += `<div id="jspsych-valence-check-10-slide-2-stimulus">${trial.ship_outcome_1_unshielded}</div>
`;
    html += `<div class="jspsych-valence-check-10-container" style="position: relative; margin: 0 auto 3em auto; ";`;
    if (trial.slider_width != null) {
      html += `width:${trial.slider_width}px;`;
    }
    html += `>`;
    html += `<input type="range" value="${trial.start}" min="${trial.min}" max="${trial.max}" step="${trial.step}" style="width: 100%;" id="jspsych-valence-check-10-response2"></input>`;
    html += `<div>`;
    for (let j = 0; j < trial.labels.length; j++) {
      let width = 100 / (trial.labels.length - 1);
      let leftOffset = (j * (100 / (trial.labels.length - 1))) - (width / 2);
      html += `<div style="display:inline-block; position:absolute; left:${leftOffset}%; text-align:center; width:${width}%;"><span style="text-align:center; font-size:80%;">${trial.labels[j]}</span></div>`;
    }
    html += "<br>";
    html += "</div>";
    html += "</div>";
    html += "</div>";
    html += "<hr>";

    html += `<div id="jspsych-valence-check-10-slide-3-stimulus">${trial.ship_outcome_2_unshielded}</div>
`;
    html += `<div class="jspsych-valence-check-10-container" style="position: relative; margin: 0 auto 3em auto; ";`;
    if (trial.slider_width != null) {
      html += `width:${trial.slider_width}px;`;
    }
    html += `>`;
    html += `<input type="range" value="${trial.start}" min="${trial.min}" max="${trial.max}" step="${trial.step}" style="width: 100%;" id="jspsych-valence-check-10-response3"></input>`;
    html += `<div>`;
    for (let j = 0; j < trial.labels.length; j++) {
      let width = 100 / (trial.labels.length - 1);
      let leftOffset = (j * (100 / (trial.labels.length - 1))) - (width / 2);
      html += `<div style="display:inline-block; position:absolute; left:${leftOffset}%; text-align:center; width:${width}%;"><span style="text-align:center; font-size:80%;">${trial.labels[j]}</span></div>`;
    }
    html += "<br>";
    html += "</div>";
    html += "</div>";
    html += "</div>";
    html += "<hr>";

    // Images & Sliders
    for (let i = 4; i <= 9; i++) {
      const slideIdBase = `jspsych-valence-check-10-slide-${i}`;
      const inputIdBase = `jspsych-valence-check-10-response${i}`;
      
      // Image & Stimulus Text
      html += `<div id="${slideIdBase}-stimulus">`;
      html += `<img src="${eval(`trial.stimulus_${i}`)}"`;
      html += `style="height:${trial.stimulus_height}px;";`;
      html += `></img></div>`;

      if (eval(`trial.stim_text_${i}`) != null) {
        html += eval(`trial.stim_text_${i}`);
      }
      html += "<br><br>";

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
      html += "</div>";
      html += "<br><br>";

      // Horizontal Line Between Slides
      if (i < 9) {
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
    const response = {
      rt: null,
      val_1: null,
      val_2: null,
      val_3: null,
      val_4: null,
      val_5: null,
      val_6: null,
      val_7: null,
      val_8: null,
      val_9: null
    };

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
      response.rt = endTime - startTime;

      // Get Responses From All Nine Sliders
      response.val_1 = document.querySelector("#jspsych-valence-check-10-response1").value;
      response.val_2 = document.querySelector("#jspsych-valence-check-10-response2").value;
      response.val_3 = document.querySelector("#jspsych-valence-check-10-response3").value;
      response.val_4 = document.querySelector("#jspsych-valence-check-10-response4").value;
      response.val_5 = document.querySelector("#jspsych-valence-check-10-response5").value;
      response.val_6 = document.querySelector("#jspsych-valence-check-10-response6").value;
      response.val_7 = document.querySelector("#jspsych-valence-check-10-response7").value;
      response.val_8 = document.querySelector("#jspsych-valence-check-10-response8").value;
      response.val_9 = document.querySelector("#jspsych-valence-check-10-response9").value;
 
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
 
      // Save Data
      const trialData = {
        "rt": response.rt,
        "val_1": response.val_1,
        "val_2": response.val_2,
        "val_3": response.val_3,
        "val_4": response.val_4,
        "val_5": response.val_5,
        "val_6": response.val_6,
        "val_7": response.val_7,
        "val_8": response.val_8,
        "val_9": response.val_9
      };
 
      // Clean Up Display Element
      displayElement.innerHTML = "";
 
      // Finish Trial With Saved Data
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