jsPsych.plugins['survey-multi-catch'] = (function() {
  var plugin = {};

  plugin.info = {
    name: 'survey-multi-catch',
    description: 'A plugin for multiple-choice survey questions with instruction looping and error catching',
    parameters: {
      questions: {
        type: jsPsych.plugins.parameterType.COMPLEX,
        array: true,
        pretty_name: 'Questions',
        nested: {
          prompt: {
            type: jsPsych.plugins.parameterType.STRING,
            pretty_name: 'Prompt',
            default: undefined,
            description: 'The strings that will be associated with a group of options.'
          },
          options: {
            type: jsPsych.plugins.parameterType.STRING,
            pretty_name: 'Options',
            array: true,
            default: undefined,
            description: 'Displays options for an individual question.'
          },
          required: {
            type: jsPsych.plugins.parameterType.BOOL,
            pretty_name: 'Required',
            default: false,
            description: 'Subject will be required to pick an option for each question.'
          },
          horizontal: {
            type: jsPsych.plugins.parameterType.BOOL,
            pretty_name: 'Horizontal',
            default: false,
            description: 'If true, then questions are centered and options are displayed horizontally.'
          },
          name: {
            type: jsPsych.plugins.parameterType.STRING,
            pretty_name: 'Question Name',
            default: '',
            description: 'Controls the name of data values associated with this question'
          }
        }
      },
      randomize_question_order: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Randomize Question Order',
        default: false,
        description: 'If true, the order of the questions will be randomized'
      },
      preamble: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Preamble',
        default: null,
        description: 'HTML formatted string to display at the top of the page above all the questions.'
      },
      button_label: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Button label',
        default: 'Continue',
        description: 'Label of the button.'
      },
      correct_answers: {
        type: jsPsych.plugins.parameterType.OBJECT,
        pretty_name: 'Correct Answers',
        default: {},
        description: 'An object containing the correct answers for each question'
      },
      instructions: {
        type: jsPsych.plugins.parameterType.HTML_STRING,
        pretty_name: 'Instructions',
        default: null,
        description: 'HTML-formatted string containing the instructions to display'
      }
    }
  };

  plugin.trial = function(display_element, trial) {
    var plugin_id_name = "jspsych-survey-multi-catch";
    var html = "";
    let failedSubmissionData = {
      count: 0,
      timestamps: []
    };

    // inject CSS for trial
    html += '<style id="jspsych-survey-multi-catch-css">';
    html += ".jspsych-survey-multi-catch-question { margin-top: 2em; margin-bottom: 2em; text-align: left; }" +
      ".jspsych-survey-multi-catch-text span.required {color: darkred;}" +
      ".jspsych-survey-multi-catch-horizontal .jspsych-survey-multi-catch-text {  text-align: center;}" +
      ".jspsych-survey-multi-catch-option { line-height: 2; }" +
      ".jspsych-survey-multi-catch-horizontal .jspsych-survey-multi-catch-option {  display: inline-block;  margin-left: 1em;  margin-right: 1em;  vertical-align: top;}" +
      "label.jspsych-survey-multi-catch-text input[type='radio'] {margin-right: 1em;}";
    html += '</style>';

    // show preamble text
    if (trial.preamble !== null) {
      html += '<div id="jspsych-survey-multi-catch-preamble" class="jspsych-survey-multi-catch-preamble">' + trial.preamble + '</div>';
    }

    // form element
    html += '<form id="jspsych-survey-multi-catch-form">';

    // generate question order
    var question_order = [];
    for (var i = 0; i < trial.questions.length; i++) {
      question_order.push(i);
    }
    if (trial.randomize_question_order) {
      question_order = jsPsych.randomization.shuffle(question_order);
    }

    // add multiple-choice questions
    for (var i = 0; i < trial.questions.length; i++) {
      var question = trial.questions[question_order[i]];
      var question_id = question_order[i];

      // create question container
      var question_classes = ['jspsych-survey-multi-catch-question'];
      if (question.horizontal) {
        question_classes.push('jspsych-survey-multi-catch-horizontal');
      }

      html += '<div id="jspsych-survey-multi-catch-' + question_id + '" class="' + question_classes.join(' ') + '"  data-name="' + question.name + '">';

      // add question text
      html += '<p class="jspsych-survey-multi-catch-text survey-multi-catch">' + question.prompt;
      if (question.required) {
        html += "<span class='required'>*</span>";
      }
      html += '</p>';

      // create option radio buttons
      for (var j = 0; j < question.options.length; j++) {
        var option_id_name = "jspsych-survey-multi-catch-option-" + question_id + "-" + j;
        var input_name = 'jspsych-survey-multi-catch-response-' + question_id;
        var input_id = 'jspsych-survey-multi-catch-response-' + question_id + '-' + j;

        var required_attr = question.required ? 'required' : '';

        // add radio button container
        html += '<div id="' + option_id_name + '" class="jspsych-survey-multi-catch-option">';
        html += '<label class="jspsych-survey-multi-catch-text" for="' + input_id + '">' + question.options[j] + '</label>';
        html += '<input type="radio" name="' + input_name + '" id="' + input_id + '" value="' + question.options[j] + '" ' + required_attr + '></input>';
        html += '</div>';
      }

      html += '</div>';
    }

    // add submit button
    // html += '<input type="submit" id="' + plugin_id_name + '-next" class="' + plugin_id_name + ' jspsych-btn"' + (trial.button_label ? ' value="' + trial.button_label + '"' : '') + '></input>';
    html += '</form>';

    let currentInstructionPage = 0;
    let showingInstructions = true;
    let instruction_count = 0;
    let start_time = performance.now();
    let responses = {};
    let question_data = {};
    let instructionTimeout = null;

    function showInstructionPage() {
      console.log('Showing instruction page', currentInstructionPage);
      instruction_count++;
    
      display_element.innerHTML = `
      <div id="instructionContainer">
        ${trial.instructions[currentInstructionPage]}
        <div class="jspsych-survey-multi-catch-nav">
          <button id="backButton" class="jspsych-btn" style="display: ${currentInstructionPage === 0 ? 'none' : 'inline'};">Back</button>
          <button id="nextButton" class="jspsych-btn">Next</button>
        </div>
      </div>
    `;

      display_element.querySelector('#nextButton').addEventListener('click', function() {
        currentInstructionPage++;
        if (currentInstructionPage < trial.instructions.length) {
          showInstructionPage();
        } else {
          showingInstructions = false;
          showCatchQuestions();
        }
      });

      display_element.querySelector('#backButton').addEventListener('click', function() {
        currentInstructionPage--;
        showInstructionPage();
      });
    }
function showCatchQuestions() {
  console.log('Showing catch questions');
  // display the catch questions
  display_element.innerHTML = html;

  // add 'Back' and 'Next' buttons
  display_element.innerHTML += `
    <div class="jspsych-survey-multi-catch-nav">
      <button id="backButton" class="jspsych-btn">Back</button>
      <button id="nextButton" class="jspsych-btn">Next</button>
    </div>
  `;
    
      // set up form submission event listener after rendering the form
      var formElement = display_element.querySelector('form');
      if (formElement) {
        formElement.addEventListener('submit', function(event) {
          event.preventDefault();
          // measure response time
          var end_time = performance.now();
          var response_time = end_time - start_time;
    
          // create object to hold responses
          for (var i = 0; i < trial.questions.length; i++) {
            var match = display_element.querySelector('#jspsych-survey-multi-catch-' + i);
            var id = "Q" + i;
            if (match.querySelector("input[type=radio]:checked") !== null) {
              var val = match.querySelector("input[type=radio]:checked").value;
            } else {
              var val = "";
            }
            var obje = {};
            var name = id;
            if (match.attributes['data-name'].value !== '') {
              name = match.attributes['data-name'].value;
            }
            obje[name] = val;
            Object.assign(question_data, obje);
          }
    
          // check answers
          var all_correct = true;
          for (var q in question_data) {
            if (question_data[q] !== trial.correct_answers[q]) {
              all_correct = false;
              break;
            }
          }
    
          if (all_correct) {
            // Display the end instruction screen
            display_element.innerHTML = `
              <div id="endInstructionContainer">
              <button id="startPhase1Button" class="jspsych-btn">Start Phase 1</button>
              </div>
            `;
    
            display_element.querySelector('#startPhase1Button').addEventListener('click', function() {
              var trial_data = {
                "rt": response_time,
                "responses": JSON.stringify(question_data),
                "question_order": JSON.stringify(question_order),
                "instruction_count": instruction_count,
                "all_correct": all_correct,
                "failed_submission_count": failedSubmissionData.count,
                "failed_submission_timestamps": JSON.stringify(failedSubmissionData.timestamps)
              };
              jsPsych.finishTrial(trial_data);
            });
          } else {
            // Increment failed submission count and store timestamp
            failedSubmissionData.count++;
            failedSubmissionData.timestamps.push(performance.now());
    
            responses = question_data;
            display_element.innerHTML = `
              <p>Wrong answer, please review the instructions.</p>
              <button id="reviewButton">Review Instructions</button>
            `;
            display_element.querySelector('#reviewButton').addEventListener('click', function() {
              showingInstructions = true;
              currentInstructionPage = 0;
              showInstructionPage();
            });
          }
        });
      } else {
        console.error('Form element not found in the DOM.');
      }
    
      // add event listeners for 'Back' and 'Next' buttons
      display_element.querySelector('#backButton').addEventListener('click', function() {
        currentInstructionPage--;
        showInstructionPage();
      });
    
      display_element.querySelector('#nextButton').addEventListener('click', function() {
        var formElement = display_element.querySelector('form');
        if (formElement) {
          formElement.requestSubmit();
        } else {
          console.error('Form element not found in the DOM.');
        }
      });
    }

    showInstructionPage();
  };

  return plugin;
})();