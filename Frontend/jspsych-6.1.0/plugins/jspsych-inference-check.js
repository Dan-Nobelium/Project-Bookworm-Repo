jsPsych.plugins["inference-check"] = (function () {
  var plugin = {};

  // Preload the stimulus
  jsPsych.pluginAPI.registerPreload(
    "inference-check",
    "main_stimulus",
    "image",
  );

  // Plugin info
  plugin.info = {
    name: "inference-check",
    description: "",
    parameters: {
      main_stimulus: {
        type: jsPsych.plugins.parameterType.IMAGE,
        pretty_name: "Main stimulus",
        default: undefined,
        description: "The large image to be displayed",
      },
      main_stimulus_height: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: "Main image height",
        default: null,
        description: "Set the main image height in pixels",
      },
      main_stimulus_width: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: "Main image width",
        default: null,
        description: "Set the main image width in pixels",
      },
      stimuli_and_text: {
        type: jsPsych.plugins.parameterType.ARRAY,
        pretty_name: "Stimuli and text",
        default: null,
        description: "Array containing stimuli and text",
      },
      stimulus_height: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: "Image height",
        default: null,
        description: "Set the image height in pixels",
      },
      stimulus_width: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: "Image width",
        default: null,
        description: "Set the image width in pixels",
      },
      maintain_aspect_ratio: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: "Maintain aspect ratio",
        default: true,
        description: "Maintain the aspect ratio after setting width or height",
      },
      min: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: "Min slider",
        default: 0,
        description: "Sets the minimum value of the slider.",
      },
      max: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: "Max slider",
        default: 100,
        description: "Sets the maximum value of the slider",
      },
      start: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: "Slider starting value",
        default: 50,
        description: "Sets the starting value of the slider",
      },
      step: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: "Step",
        default: 1,
        description: "Sets the step of the slider",
      },
      slider_text_top: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: "Top slider text",
        default: "",
        description: "Any content here will be displayed with the top slider.",
      },
      labels_top: {
        type: jsPsych.plugins.parameterType.HTML_STRING,
        pretty_name: "Labels",
        default: [],
        array: true,
        description: "Labels of the top slider.",
      },
      slider_width: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: "Slider width",
        default: null,
        description: "Width of the slider in pixels.",
      },
      button_label: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: "Button label",
        default: "Continue",
        array: false,
        description: "Label of the button to advance.",
      },
      require_movement: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: "Require movement",
        default: false,
        description:
          "If true, the participant will have to move the slider before continuing.",
      },
      prompt: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: "Prompt",
        default: "",
        description:
          "Any content here will be displayed at the top of the screen.",
      },
      stimulus_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: "Stimulus duration",
        default: null,
        description: "How long to hide the stimulus.",
      },
      trial_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: "Trial duration",
        default: null,
        description: "How long to show the trial.",
      },
      response_ends_trial: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: "Response ends trial",
        default: true,
        description: "If true, trial will end when user makes a response.",
      },
    },
  };

  // Trial function
  plugin.trial = function (display_element, trial) {
    // Create the HTML for the trial
    var html =
      '<div id="jspsych-inference-check-wrapper" style="margin: 100px 0px;">';

    // Add the main stimulus
    html += '<div id="jspsych-inference-check-stimulus">';
    html += '<img src="' + trial.main_stimulus + '" style="';
    if (trial.main_stimulus_height !== null) {
      html += "height:" + trial.main_stimulus_height + "px; ";
      if (trial.main_stimulus_width == null && trial.maintain_aspect_ratio) {
        html += "width: auto; ";
      }
    }
    if (trial.main_stimulus_width !== null) {
      html += "width:" + trial.main_stimulus_width + "px; ";
      if (trial.main_stimulus_height == null && trial.maintain_aspect_ratio) {
        html += "height: auto; ";
      }
    }

    html += '"></img>';
    html += "</div>";

    // Add the prompt
    if (trial.prompt !== null) {
      html += trial.prompt + "<br><br><br><br>";
    }

    trial.stimuli_and_text = trial.stimuli_and_text.filter((pair) => {return pair[0] != null});

    // Loop through stimuli
    for (let pair of trial.stimuli_and_text) {
      let i = trial.stimuli_and_text.indexOf(pair) + 1;
      let stimulus = pair[0];
      let text = pair[1];
      if (stimulus[0] == "<") {
        html += '<div id="jspsych-inference-check-stimulus">';
        html += stimulus;
        html += "</div>";
      } else {
        html += '<div id="jspsych-inference-check-stimulus">';
        html += '<img src="' + stimulus + '" style="';
        if (trial.stimulus_height !== null) {
          html += "height:" + trial.stimulus_height + "px; ";
          if (trial.stimulus_width == null && trial.maintain_aspect_ratio) {
            html += "width: auto; ";
          }
        }
        if (trial.stimulus_width !== null) {
          html += "width:" + trial.stimulus_width + "px; ";
          if (trial.stimulus_height == null && trial.maintain_aspect_ratio) {
            html += "height: auto; ";
          }
        }
        html += '"></img>';
        html += "</div>";
      }

      // Add the stimulus text
      if (text) {
        html += text;
      }
      html += "<br><br>";

      // Add the slider
      if (trial.slider_text_top !== null) {
        html += trial.slider_text_top;
      }

      html +=
        '<div class="jspsych-inference-check-container" style="position:relative; margin: 0 auto 3em auto; ';
      if (trial.slider_width !== null) {
        html += "width:" + trial.slider_width + "px;";
      }
      html += '">';
      html +=
        '<input type="range" value="' +
        trial.start +
        '" min="' +
        trial.min +
        '" max="' +
        trial.max +
        '" step="' +
        trial.step +
        '" style="width: 100%;" id="jspsych-inference-check-response-' +
        i +
        '"></input>';
      html += "<div>";
      for (var j = 0; j < trial.labels_top.length; j++) {
        var width = 100 / (trial.labels_top.length - 1);
        var left_offset = j * (100 / (trial.labels_top.length - 1)) - width / 2;
        html +=
          '<div style="display: inline-block; position: absolute; left:' +
          left_offset +
          "%; text-align: center; width: " +
          width +
          '%;">';
        html +=
          '<span style="text-align: center; font-size: 80%;">' +
          trial.labels_top[j] +
          "</span>";
        html += "</div>";
      }
      html += "</div>";
      html += "</div>";
      html += "</div>";

      // Add a separator between stimuli and sliders
      if (i < trial.stimuli_and_text.length) {
        html += "<br><br><br><hr><br><br><br>";
      }
    }

    // Add the submit button
    html +=
      '<button id="jspsych-inference-check-next" class="jspsych-btn" ' +
      (trial.require_movement ? "disabled" : "") +
      ">" +
      trial.button_label +
      "</button>";

    // Close the wrapper div
    html += "</div>";

    // Display the HTML
    display_element.innerHTML = html;

    // Initialize the response object
    var response = {
      rt: null,
      responses: [],
    };

    // Disable the submit button if movement is required
    if (trial.require_movement) {
      display_element
        .querySelector(
          "#jspsych-inference-check-response-" + trial.stimuli_and_text.length,
        )
        .addEventListener("change", function () {
          display_element.querySelector(
            "#jspsych-inference-check-next",
          ).disabled = false;
        });
    }

    // Add event listener to the submit button
    display_element
      .querySelector("#jspsych-inference-check-next")
      .addEventListener("click", function () {
        // Measure the response time
        var endTime = performance.now();
        response.rt = endTime - startTime;

        // Save the responses
        for (var i = 1; i <= trial.stimuli_and_text.length; i++) {
          response.responses.push(
            display_element.querySelector(
              "#jspsych-inference-check-response-" + i,
            ).value,
          );
        }

        // End the trial if response ends trial
        if (trial.response_ends_trial) {
          end_trial();
        } else {
          // Disable the submit button after a response
          display_element.querySelector(
            "#jspsych-inference-check-next",
          ).disabled = true;
        }
      });

    // Function to end the trial
    function end_trial() {
      // Clear any remaining timeouts
      jsPsych.pluginAPI.clearAllTimeouts();

      // Prepare the trial data
      var trialdata = {
        rt: response.rt,
        responses: JSON.stringify(response.responses),
      };

      // Clear the display
      display_element.innerHTML = "";

      // Finish the trial and move to the next one
      jsPsych.finishTrial(trialdata);
    }

    // Hide the stimulus if stimulus_duration is set
    if (trial.stimulus_duration !== null) {
      jsPsych.pluginAPI.setTimeout(function () {
        display_element.querySelector(
          "#jspsych-inference-check-stimulus",
        ).style.visibility = "hidden";
      }, trial.stimulus_duration);
    }

    // End the trial if trial_duration is set
    if (trial.trial_duration !== null) {
      jsPsych.pluginAPI.setTimeout(function () {
        end_trial();
      }, trial.trial_duration);
    }

    // Record the start time
    var startTime = performance.now();
  };

  // Return the plugin object
  return plugin;
})();
