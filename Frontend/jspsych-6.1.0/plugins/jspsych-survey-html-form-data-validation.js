jsPsych.plugins['survey-html-form-data-validation'] = (function() {
  var plugin = {}

  plugin.info = {
    name: 'survey-html-form-data-validation',
    description: 'Displays a survey form with HTML content, language selection, and data validation.',
    parameters: {
      preamble: {
        type: jsPsych.plugins.parameterType.HTML_STRING,
        default: null,
        description: 'HTML formatted string to display above the form.'
      },
      html: {
        type: jsPsych.plugins.parameterType.HTML_STRING,
        pretty_name: 'HTML',
        default: null,
        description: 'HTML formatted string comprising the survey form.'
      },
      data: {
        type: jsPsych.plugins.parameterType.OBJECT,
        pretty_name: 'Data',
        default: {},
        description: 'Object containing data about the trial to be collected.'
      },
      button_label: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Button label',
        default:  'Continue',
        description: 'Label of the button to submit responses.'
      },
      language_data_file: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Language Data File',
        default: 'languages.json', 
        description: 'Path to the JSON file containing language data.'
      },
      on_finish: {
        type: jsPsych.plugins.parameterType.FUNCTION,
        default: null,
        description: 'Function to execute when trial finishes.'
      }
    }
  }

  plugin.trial = function(display_element, trial) {
    var html = ''

    // Show preamble text
    if (trial.preamble !== null) {
      html += '<div id="jspsych-survey-html-form-preamble">' + trial.preamble + '</div>'
    }

    // Start the form
    html += trial.html 

    html += '<div id="jspsych-survey-html-form-error-message" style="color: red; display: none"></div>' 
    // Fetch language options
    fetch(trial.language_data_file)
      .then(response => response.json())
      .then(languages => {
        languages.sort((a, b) => a.name.localeCompare(b.name))

        const dropdown = document.getElementById('languageDropdown')

        languages.forEach(language => {
          const option = document.createElement('option')
          option.value = language.name
          option.textContent = language.name
          
          // Set English as the default
          if (language.name === "English") {
            option.selected = true
          }

          dropdown.appendChild(option)
        })
      })
      .catch(error => console.error('Error loading languages:', error))

    // Add submit button
    html += '<button id="jspsych-survey-html-form-next" class="jspsych-btn">' + trial.button_label + '</button>'
    display_element.innerHTML = html
    display_element.querySelector('#jspsych-survey-html-form-next').addEventListener('click', function() {
      const inputs = display_element.querySelectorAll('input[required]')
      const select = display_element.querySelector('select[required]')
      const errorMessageElement = display_element.querySelector('#jspsych-survey-html-form-error-message')

      let isValid = true

      inputs.forEach(input => {
        if (!input.value) {
          isValid = false
          input.classList.add('invalid')
        } else {
          input.classList.remove('invalid')
        }
      })

      if (!select.value) {
        isValid = false
        select.classList.add('invalid')
      } else {
        select.classList.remove('invalid')
      }

      if (isValid) {
        var trial_data = {
          language: select.value 
        }

        if (trial.on_finish !== null) {
          trial.on_finish(trial_data)
        }

        jsPsych.finishTrial(trial_data)
      } else {
        errorMessageElement.textContent = 'Please fill in all required fields.'
        errorMessageElement.style.display = 'block'
      }
    })
  }

  return plugin
})()
