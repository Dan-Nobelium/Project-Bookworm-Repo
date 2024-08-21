jsPsych.plugins["html-slider-triplet"] = (function () {
  var plugin = {};

  plugin.info = {
    name: "html-slider-triplet",
    description: "A plugin for creating three sliders to input proportions",
    parameters: {
      stimulus_all: {
        type: jsPsych.plugins.parameterType.ARRAY,
        pretty_name: "Stimulus all",
        default: [],
        description: "Array of stimulus image paths",
      },
      planetColors: {
        type: jsPsych.plugins.parameterType.OBJECT,
        pretty_name: "Planet colors",
        default: null,
        description: "Object mapping image paths to their respective colors",
      },
      prompt: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: "Prompt",
        default: null,
        description: "Any content here will be displayed above the sliders.",
      },
      slider_width: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: "Slider width",
        default: 500,
        description: "Width of the sliders in pixels.",
      },
      stimulus_height: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: "Stimulus height",
        default: 100,
        description: "Height of the stimulus images in pixels.",
      },
      pie_chart_size: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: "Pie chart size",
        default: 200,
        description: "Size of the pie chart in pixels.",
      },
      require_movement: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: "Require movement",
        default: false,
        description:
          "If true, the participant will have to move the sliders before continuing.",
      },
    },
  };
  plugin.trial = function (display_element, trial) {
    var planetOrder = trial.stimulus_all;
    var planetColors = trial.planetColors;

    // HTML structure
    var html = `
      <div id="jspsych-html-slider-triplet-wrapper" style="display: grid; grid-template-columns: 1fr 1fr; grid-gap: 20px; height: 100%;">
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
          <!-- Prompt -->
          ${trial.prompt ? `<div id="jspsych-html-slider-triplet-prompt">${trial.prompt}</div>` : ""}
  
          <!-- Sliders -->
          ${planetOrder
            .map(
              (planet, index) => `
            <div class="jspsych-html-slider-triplet-slider-container" style="margin-bottom: 20px; text-align: center;">
              <div style="display: flex; flex-direction: column; align-items: center;">
                <img src="${planet}" class="jspsych-html-slider-triplet-stimulus" style="height: ${trial.stimulus_height}px;"/>
                <span style="margin-top: 10px;">Planet ${String.fromCharCode(65 + index)}</span>
              </div>
              <input type="range" class="jspsych-html-slider-triplet-slider jspsych-slider" id="slider-${index}" min="0" max="100" value="33" step="1" style="width: 100%;"/>
              <span id="slider-value-${index}" class="jspsych-slider-value">33%</span>
            </div>
          `,
            )
            .join("")}
        </div>
  
        <div style="display: flex; justify-content: center; align-items: center;">
          <!-- Pie Chart -->
          <div id="jspsych-html-slider-triplet-pie-chart" style="width: ${trial.pie_chart_size * 1.5}px; height: ${trial.pie_chart_size * 1.5}px; border: 2px solid black;"></div>
        </div>
      </div>
  
      <!-- Continue Button -->
      <div style="text-align: center; margin-top: 20px;">
        <button id="jspsych-html-slider-triplet-continue" class="jspsych-btn">Continue</button>
      </div>
    `;

    display_element.innerHTML = html;

    // Initial state variables
    var proportions = Array(planetOrder.length).fill(33);

    // Get DOM elements
    var sliders = display_element.querySelectorAll(
      ".jspsych-html-slider-triplet-slider",
    );
    var continueButton = display_element.querySelector(
      "#jspsych-html-slider-triplet-continue",
    );
    var pieChartElement = display_element.querySelector(
      "#jspsych-html-slider-triplet-pie-chart",
    );

    // Update slider value display and store proportions
    function updateSliderValue(index, value) {
      value = Math.max(0, Math.min(100, value)); // Ensure value is between 0 and 100
      document.getElementById(`slider-value-${index}`).textContent =
        value + "%";
      proportions[index] = parseInt(value);
      updatePieChart();
    }

    // Event listeners for sliders
    sliders.forEach((slider, index) => {
      slider.addEventListener("input", function () {
        updateSliderValue(index, this.value);
      });
    });

    // Function to update the pie chart
    function updatePieChart() {
      var totalProportion = proportions.reduce((sum, value) => sum + value, 0);
      var pieChartData;

      if (totalProportion === 0) {
        pieChartData = planetOrder.map((_, index) => ({
          value: 1 / planetOrder.length,
          color: "gray",
        }));
      } else {
        pieChartData = proportions.map((value, index) => ({
          value: value / totalProportion,
          color: planetColors[planetOrder[index]],
        }));
      }

      // Render the pie chart using a library or custom code
      renderPieChart(pieChartElement, pieChartData);
    }

    // Function to render the pie chart
    function renderPieChart(element, data) {
      // Clear the existing pie chart
      element.innerHTML = "";

      // Create an SVG element for the pie chart
      var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("width", trial.pie_chart_size * 1.5);
      svg.setAttribute("height", trial.pie_chart_size * 1.5);
      element.appendChild(svg);

      var radius = (trial.pie_chart_size * 1.5) / 2;
      var center = (trial.pie_chart_size * 1.5) / 2;

      var startAngle = 0;
      for (var i = 0; i < data.length; i++) {
        if (data[i].value > 0) {
          var endAngle = startAngle + data[i].value * 360;

          var path = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "path",
          );
          var largeArcFlag = data[i].value > 0.5 ? 1 : 0;
          var pathData = [
            "M",
            center,
            center,
            "L",
            center + radius * Math.cos((startAngle * Math.PI) / 180),
            center + radius * Math.sin((startAngle * Math.PI) / 180),
            "A",
            radius,
            radius,
            0,
            largeArcFlag,
            1,
            center + radius * Math.cos((endAngle * Math.PI) / 180),
            center + radius * Math.sin((endAngle * Math.PI) / 180),
            "Z",
          ].join(" ");
          path.setAttribute("d", pathData);
          path.setAttribute("fill", data[i].color);
          svg.appendChild(path);

          startAngle = endAngle;
        }
      }
    }

    // Response object
    var response = {
      proportions: proportions,
      rt: null,
      stimulus_all: trial.stimulus_all,
      planetColors: trial.planetColors,
    };

    // Record the start timestamp
    var startTime = performance.now();

    // Function to end the trial
    var end_trial = function () {
      // Set the end timestamp and reaction time
      var endTime = performance.now();
      response.rt = endTime - startTime;

      // Prepare the trial data
      var trial_data = {
        response: response,
      };

      // Clear the display
      display_element.innerHTML = "";

      // End the trial
      jsPsych.finishTrial(trial_data);
    };

    // Event listener for the continue button
    continueButton.addEventListener("click", function () {
      end_trial();
    });

    // Initial pie chart update
    updatePieChart();
  };

  return plugin;
})();
