jsPsych.plugins["survey-multi-catch-image"] = (function () {
  var plugin = {};

  plugin.info = {
    name: "survey-multi-catch-image",
    description: "Displays instruction pages with catch questions and images",
    parameters: {
      pages: {
        type: jsPsych.plugins.parameterType.HTML_STRING,
        pretty_name: "Pages",
        default: undefined,
        array: true,
        description:
          "Each element of the array is the content for a single page.",
      },
      question_prompts: {
        type: jsPsych.plugins.parameterType.HTML_STRING,
        pretty_name: "Question prompts",
        default: null,
        array: true,
        description: "Array of HTML strings representing the question prompts.",
      },
      planet_options: {
        type: jsPsych.plugins.parameterType.HTML_STRING,
        pretty_name: "Planet options",
        default: null,
        array: true,
        description: "Array of HTML strings representing the planet options.",
      },
      ship_option_1: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: "Ship option 1",
        default: null,
        description: "The image source for ship option 1.",
      },
      ship_option_2: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: "Ship option 2",
        default: null,
        description: "The image source for ship option 2.",
      },
      ship_option_3: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: "Ship option 3",
        default: null,
        description: "The image source for ship option 3.",
      },
      correct_answers: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: "Correct answers",
        default: null,
        array: true,
        description:
          "Array of strings representing the correct answers for each question.",
      },
      instructions: {
        type: jsPsych.plugins.parameterType.HTML_STRING,
        pretty_name: "Instructions",
        default: null,
        description:
          "HTML-formatted string containing the instructions to display when an incorrect answer is given.",
      },
      show_clickable_nav: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: "Show clickable nav",
        default: false,
        description:
          'If true, then a "Previous" and "Next" button will be displayed beneath the instructions.',
      },
      button_label_previous: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: "Button label previous",
        default: "Previous",
        description: "The text that appears on the button to go backwards.",
      },
      button_label_next: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: "Button label next",
        default: "Next",
        description: "The text that appears on the button to go forwards.",
      },
      allow_keys: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: "Allow keys",
        default: true,
        description:
          "If true, the subject can use keyboard keys to navigate the pages.",
      }
    },
  };

  plugin.trial = function (display_element, trial) {
    var currentInstructionPage = 0;
    var startTime = performance.now();
    var instructionPages = trial.pages;
    var catchQuestions = {
      question_prompts: trial.question_prompts,
      planet_options: trial.planet_options,
      ship_option_1: trial.ship_option_1,
      ship_option_2: trial.ship_option_2,
      ship_option_3: trial.ship_option_3,
      correct_answers: trial.correct_answers,
    };
    var catchResponses = {};
    var contingencies_correct = false;
    var failedSubmissionCount = 0;

    function createInstructionPage(pageContent) {
      var pageHtml = pageContent;
      return pageHtml;
    }
    function createCatchQuestions() {
      var html = `
        <form id="jspsych-survey-multi-catch-form">
          <p align='center'><b>Check your knowledge before you continue.</b></p>
          ${trial.question_prompts
            .map(
              (prompt, index) => `
            <p align='center'><b>Question ${index + 1}:</b> ${prompt}</p>
            <div class="jspsych-survey-multi-catch-options">
              ${
                index === 1 || index === 3
                  ? `
                <div class="option-container">
                  <label for="Q${index}-1">
                    <img src="${trial.ship_option_1}" class="option-image">
                  </label>
                  <input type="radio" name="Q${index}" id="Q${index}-1" value="${trial.ship_option_1}" required>
                </div>
                <div class="option-container">
                  <label for="Q${index}-2">
                    <img src="${trial.ship_option_2}" class="option-image">
                  </label>
                  <input type="radio" name="Q${index}" id="Q${index}-2" value="${trial.ship_option_2}" required>
                </div>
                <div class="option-container">
                  <label for="Q${index}-3">
                    <img src="${trial.ship_option_3}" class="option-image">
                  </label>
                  <input type="radio" name="Q${index}" id="Q${index}-3" value="${trial.ship_option_3}" required>
                </div>
              `
                  : `
                ${trial.planet_options
                  .map(
                    (planet, planetIndex) => `
                  <div class="option-container">
                    <label for="Q${index}-${planet}">
                      <img src="${planet}" class="option-image">
                    </label>
                    <input type="radio" name="Q${index}" id="Q${index}-${planet}" value="${trial.planet_options[planetIndex]}" required>
                  </div>
                `,
                  )
                  .join("")}
              `
              }
            </div>
          `,
            )
            .join("")}
          <div class="jspsych-survey-multi-catch-nav">
            <button id="backButton" class="jspsych-btn" type="button">${trial.button_label_previous}</button>
            <button id="submitButton" class="jspsych-btn" type="submit">${trial.button_label_next}</button>
          </div>
        </form>
      `;

      // Log the ship options and their relative planets
      console.log("Ship Options:");
      console.log("Ship 1:", trial.ship_option_1);
      console.log("Ship 2:", trial.ship_option_2);
      console.log("Ship 3:", trial.ship_option_3);

      console.log("Planet Options:");
      trial.planet_options.forEach((planet, index) => {
        console.log(`Planet ${String.fromCharCode(65 + index)}:`, planet);
      });
      console.log("correct answers: ", trial.correct_answers);

      // Attach event listener to the back button
      setTimeout(function () {
        var backButton = document.getElementById("backButton");
        if (backButton) {
          backButton.addEventListener("click", function () {
            console.log("Back button clicked");
            previousPage();
          });
        }
      }, 0);

      return html;
    }

    function showInstructionPage() {
      var pageContent = instructionPages[currentInstructionPage];
      var pageHtml = createInstructionPage(pageContent);
      display_element.innerHTML = pageHtml;

      if (trial.show_clickable_nav) {
        var navButtons = `
          <div class="jspsych-instructions-nav">
            <button id="prevButton" class="jspsych-btn">${trial.button_label_previous}</button>
            <button id="nextButton" class="jspsych-btn">${trial.button_label_next}</button>
          </div>
        `;
        display_element.insertAdjacentHTML("beforeend", navButtons);

        display_element
          .querySelector("#prevButton")
          .addEventListener("click", previousPage);
        display_element
          .querySelector("#nextButton")
          .addEventListener("click", nextPage);
      }

      if (trial.allow_keys) {
        var keyListener = jsPsych.pluginAPI.getKeyboardResponse({
          callback_function: keyHandler,
          valid_responses: [trial.key_backward, trial.key_forward],
          rt_method: "performance",
          persist: false,
        });
      }
    }

    function showCatchQuestions() {
      var catchQuestionsHtml = createCatchQuestions();
      display_element.innerHTML = catchQuestionsHtml;

      var form = document.querySelector("#jspsych-survey-multi-catch-form");
      if (form) {
        form.addEventListener("submit", function (event) {
          event.preventDefault();
          var selectedAnswers = [];
          for (var i = 0; i < trial.question_prompts.length; i++) {
            var selectedOption = document.querySelector(
              `input[name="Q${i}"]:checked`,
            ).value;
            selectedAnswers.push(selectedOption);
          }
          catchResponses = selectedAnswers;

          console.log("Correct Answers:", trial.correct_answers);
          console.log("Selected Answers:", selectedAnswers);

          contingencies_correct = trial.correct_answers.every(
            (answer, index) => answer === selectedAnswers[index],
          );

          console.log("Contingencies Correct:", contingencies_correct);

          if (contingencies_correct) {
            endTrial();
          } else {
            failedSubmissionCount++;
            displayInstructions();
          }
        });
      }
    }

    function previousPage() {
      if (currentInstructionPage > 0) {
        currentInstructionPage--;
        showInstructionPage();
      }
    }

    function nextPage() {
      if (currentInstructionPage < instructionPages.length - 1) {
        currentInstructionPage++;
        showInstructionPage();
      } else {
        showCatchQuestions();
      }
    }

    function keyHandler(info) {
      if (
        jsPsych.pluginAPI.compareKeys(info.key, trial.key_backward) &&
        trial.allow_backward
      ) {
        previousPage();
      } else if (jsPsych.pluginAPI.compareKeys(info.key, trial.key_forward)) {
        nextPage();
      }
    }

    function displayInstructions() {
      var modalOverlay = document.createElement("div");
      modalOverlay.id = "instructionModal";
      modalOverlay.style.position = "fixed";
      modalOverlay.style.top = "0";
      modalOverlay.style.left = "0";
      modalOverlay.style.width = "100%";
      modalOverlay.style.height = "100%";
      modalOverlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
      modalOverlay.style.zIndex = "9999";
      modalOverlay.style.display = "flex";
      modalOverlay.style.justifyContent = "center";
      modalOverlay.style.alignItems = "center";

      var modalContent = document.createElement("div");
      modalContent.style.backgroundColor = "white";
      modalContent.style.padding = "20px";
      modalContent.style.borderRadius = "5px";
      modalContent.style.maxWidth = "80%";
      modalContent.innerHTML = trial.instructions;

      var closeButton = document.createElement("button");
      closeButton.innerText = "Close";
      closeButton.style.marginTop = "10px";
      closeButton.addEventListener("click", function () {
        modalOverlay.remove();
        currentInstructionPage = instructionPages.length - 1;
        showInstructionPage();
      });

      modalContent.appendChild(closeButton);
      modalOverlay.appendChild(modalContent);
      display_element.appendChild(modalOverlay);
    }

    function endTrial() {
      var endTime = performance.now();
      var responseTime = endTime - startTime;

      var trialData = {
        instruction_pages: JSON.stringify(instructionPages),
        catch_questions: JSON.stringify(catchQuestions),
        catch_responses: JSON.stringify(catchResponses),
        contingencies_correct: contingencies_correct,
        failed_submission_count: failedSubmissionCount,
        rt: responseTime,
      };

      display_element.innerHTML = "";
      jsPsych.finishTrial(trialData);
    }

    showInstructionPage();
  };

  return plugin;
})();
