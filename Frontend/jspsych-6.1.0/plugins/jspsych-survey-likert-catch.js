/**
 * jspsych-survey-likert
 * a jspsych plugin for measuring items on a likert scale
 *
 * Josh de Leeuw // modded by Daniel Noble to include a catch question
 *
 * documentation: docs.jspsych.org
 *
 */

jsPsych.plugins["survey-likert-catch"] = (function () {
  var plugin = {};
  plugin.info = {
    name: "survey-likert-catch",
    description: "",
    parameters: {
      questions: {
        type: jsPsych.plugins.parameterType.COMPLEX,
        array: true,
        pretty_name: "Questions",
        nested: {
          prompt: {
            type: jsPsych.plugins.parameterType.STRING,
            pretty_name: "Prompt",
            default: undefined,
            description: "Questions that are associated with the slider.",
          },
          labels: {
            type: jsPsych.plugins.parameterType.STRING,
            array: true,
            pretty_name: "Labels",
            default: undefined,
            description: "Labels to display for individual question.",
          },
          required: {
            type: jsPsych.plugins.parameterType.BOOL,
            pretty_name: "Required",
            default: false,
            description: "Makes answering the question required.",
          },
          name: {
            type: jsPsych.plugins.parameterType.STRING,
            pretty_name: "Question Name",
            default: "",
            description:
              "Controls the name of data values associated with this question",
          },
          catch: {
            type: jsPsych.plugins.parameterType.BOOL,
            pretty_name: "Catch Question",
            default: false,
            description: "Indicates if this is a catch question",
          },
          catch_response: {
            type: jsPsych.plugins.parameterType.INT,
            pretty_name: "Catch Response",
            default: [0],
            description: "The correct response index for the catch question",
          },
        },
      },
      randomize_question_order: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: "Randomize Question Order",
        default: false,
        description: "If true, the order of the questions will be randomized",
      },
      preamble: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: "Preamble",
        default: null,
        description: "String to display at top of the page.",
      },
      scale_width: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: "Scale width",
        default: null,
        description: "Width of the likert scales in pixels.",
      },
      button_label: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: "Button label",
        default: "Continue",
        description: "Label of the button.",
      },
      catch_handling: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: "Catch Handling",
        default: "continue",
        description:
          'Specifies how to handle failed catch questions. "continue" will continue the experiment, "abort" will redirect to a screen notifying the participant they don\'t qualify for the study.',
      },
    },
  };

  plugin.trial = function (display_element, trial) {
    // Set the scale width based on trial parameters or default to 100%
    var scale_width = trial.scale_width || "100%";

    // Initialize HTML string
    var html = "";

    // Inject CSS for styling the trial
    html += "<style>";
    html +=
      ".jspsych-survey-likert-statement { display: block; font-size: 16px; padding-top: 40px; margin-bottom: 10px; }" +
      ".jspsych-survey-likert-opts { list-style: none; width: " +
      scale_width +
      "; margin: auto; padding: 0 0 35px; display: block; font-size: 14px; line-height: 1.1em; }" +
      ".jspsych-survey-likert-opt-label { line-height: 1.1em; color: #444; }" +
      ".jspsych-survey-likert-opts:before { content: ''; position: relative; top: 11px; display: block; background-color: #efefef; height: 4px; width: 100%; }" +
      ".jspsych-survey-likert-opts:last-of-type { border-bottom: 0; }" +
      ".jspsych-survey-likert-opts li { display: inline-block; text-align: center; vertical-align: top; }" +
      ".jspsych-survey-likert-opts li input[type=radio] { display: block; position: relative; top: 0; left: 50%; margin-left: -6px; }";
    html += "</style>";

    // Show the preamble if there is one
    if (trial.preamble !== null) {
      html +=
        '<div id="jspsych-survey-likert-preamble" class="jspsych-survey-likert-preamble">' +
        trial.preamble +
        "</div>";
    }

    // Start the form
    html += '<form id="jspsych-survey-likert-form">';

    // Randomize the question order if specified
    var question_order = [];
    for (var i = 0; i < trial.questions.length; i++) {
      question_order.push(i);
    }
    if (trial.randomize_question_order) {
      question_order = jsPsych.randomization.shuffle(question_order);
    }

    // Iterate over the questions
    for (var i = 0; i < trial.questions.length; i++) {
      var question = trial.questions[question_order[i]];
      var question_index = question_order[i];

      // Add the question prompt
      html +=
        '<label class="jspsych-survey-likert-statement">' +
        question.prompt +
        "</label>";

      // Initialize the options string
      var options_string =
        '<ul class="jspsych-survey-likert-opts" data-name="' +
        question.name +
        '" data-radio-group="Q' +
        question_index +
        '">';

      // Iterate over the labels
      for (var j = 0; j < question.labels.length; j++) {
        options_string +=
          '<li style="width:' +
          100 / question.labels.length +
          '%"><input id="' +
          i.toString() +
          "_" +
          j.toString() +
          '" type="radio" name="Q' +
          question_index +
          '" value="' +
          j +
          '"';
        if (question.required) {
          options_string += " required";
        }
        options_string +=
          '><label for="' +
          i.toString() +
          "_" +
          j.toString() +
          '" class="jspsych-survey-likert-opt-label">' +
          question.labels[j] +
          "</label></li>";
      }

      // Close the options string
      options_string += "</ul>";

      // Add the options string to the HTML
      html += options_string;

      // Add a warning message for unanswered required questions
      if (question.required) {
        html +=
          '<div class="jspsych-survey-likert-required-warning" style="display: none; color: red;">Please answer this question before continuing.</div>';
      }
    }

    // Add the submit button
    html +=
      '<input type="submit" id="jspsych-survey-likert-next" class="jspsych-survey-likert jspsych-btn" value="' +
      trial.button_label +
      '"></input>';

    // End the form
    html += "</form>";

    // Display the HTML
    display_element.innerHTML = html;

    // Define the form submit event handler
    display_element
      .querySelector("#jspsych-survey-likert-form")
      .addEventListener("submit", function (event) {
        event.preventDefault();

        // Measure the response time
        var endTime = performance.now();
        var response_time = endTime - startTime;

        // Create an object to hold the responses
        var question_data = {};
        var catch_failed = false;
        var required_failed = false;

        // Get all the selected options
        var matches = display_element.querySelectorAll(
          "#jspsych-survey-likert-form .jspsych-survey-likert-opts",
        );
        for (var index = 0; index < matches.length; index++) {
          var question_index = parseInt(
            matches[index].dataset["radioGroup"].replace("Q", ""),
          );
          var question = trial.questions[question_index];
          var el = display_element.querySelector(
            'input[name="Q' + question_index + '"]:checked',
          );

          // Check if the question is required and unanswered
          if (question.required && el === null) {
            required_failed = true;
            display_element.querySelector(
              '#jspsych-survey-likert-form .jspsych-survey-likert-opts[data-radio-group="Q' +
                question_index +
                '"]',
            ).nextElementSibling.style.display = "block";
          } else {
            if (el === null) {
              var response = "";
            } else {
              var response = parseInt(el.value);
            }

            var response_object = {};
            var name =
              question.name !== "" ? question.name : "Q" + question_index;
            response_object[name] = response;
            Object.assign(question_data, response_object);

            // Check if the question is a catch question and answered incorrectly
            if (question.catch && response !== question.catch_response) {
              catch_failed = true;
            }
          }
        }

        // Don't proceed if there are unanswered required questions
        if (required_failed) {
          return;
        }

        // Create the trial data object
        var trial_data = {
          rt: response_time,
          responses: JSON.stringify(question_data),
          question_order: JSON.stringify(question_order),
          catch_failed: catch_failed,
        };

        // Check the catch_handling parameter
        if (catch_failed && trial.catch_handling === "abort") {
          // Redirect to a screen notifying the participant they don't qualify for the study
          display_element.innerHTML =
            "<p>Unfortunately, you do not meet the attention check criteria for this study. Please contact your researcher for further instructions.</p>";
          setTimeout(function () {
            jsPsych.endExperiment(
              "Experiment ended due to failed attention check.",
            );
          });
        } else {
          // Clear the display and finish the trial
          display_element.innerHTML = "";
          jsPsych.finishTrial(trial_data);
        }
      });

    var startTime = performance.now();
  };

  return plugin;
})();
